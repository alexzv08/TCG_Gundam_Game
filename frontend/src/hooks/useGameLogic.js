// src/hooks/useGameLogic.js

import { useState, useEffect, useRef } from 'react';
import { useSocket } from '../context/SocketContext';

import {
    initializeDeck,
    drawCard,
    shieldAdd,
    shieldRemove,
    addResource,
    addResourceEx,
    baseTokenAdd,
} from '../utils/funcionesGame';

export function useGameLogic(setShowModal) {
  // --- Socket setup ---
    const socket = useSocket();

    const onSalaEncontrada = (room, startPlayer) => {
        console.log('Sala encontrada:', room, startPlayer);
        // setShowModal(false);
    }

    useEffect(() => {
        if (!socket.connected) {
            socket.connect();
        }
        
        socket.once('salaCreada', (roomData) => {
            console.log("Sala creadaaa:", roomData);
        });
        socket.once('salaEncontrada', (roomData) => {
            console.log("Sala creadaaa:", roomData);
        });
        return () => {
        socket.off('connect');
        socket.off('salaEncontrada');
        socket.disconnect();
        };
    }, [socket, setShowModal]);

    useEffect(() => {console.log("se ejecuta un socket")}, [socket]);

    const onSalaCreada = (room) => {
        console.log('Sala creada:', room);
    };
    
    // --- State refs ---
    const deckRef = useRef([]);
    const roomIdRef = useRef(null);
    const turnRef = useRef(null);
    const pendingSearch = useRef(null);

    // --- Game state ---
    const [deck, setDeck] = useState([]);
    const [hand, setHand] = useState([]);
    const [battleCards, setBattleCards] = useState([]);
    const [trash, setTrash] = useState([]);
    const [shields, setShields] = useState([]);
    const [baseArea, setBaseArea] = useState([]);
    const [myResources, setMyResources] = useState([]);
    const [rivalResources, setRivalResources] = useState([]);
    const [turn, setTurn] = useState(null);
    const [isMyTurn, setIsMyTurn] = useState(false);
    const [gameTurn, setGameTurn] = useState(0);

    // Modal state
    const [showConfirm, setShowConfirm] = useState(false);
    const [confirmConfig, setConfirmConfig] = useState({});
    const [showPilotModal, setShowPilotModal] = useState(false);
    const [selectedPilot, setSelectedPilot] = useState(null);

    // Sincronizar refs
    useEffect(() => {
        deckRef.current = deck;
    }, [deck]);
    useEffect(() => {
        turnRef.current = turn;
    }, [turn]);

    // --- Core actions ---

    function buscarSala() {
        const user = localStorage.getItem('user');
        socket.emit('buscarSala', user);
    }




    //Por revisar ?¿
    function startGame() {
        const newDeck = initializeDeck();
        setDeck(newDeck);
        const { drawnCards, remainingDeck } = drawCard(newDeck, 5);
        setHand(drawnCards);
        setDeck(remainingDeck);
    }

    function addUnit(card) {
        setBattleCards((prev) => {
        const updated = [...prev, { unit: card, pilots: [] }];
        socketRef.current.emit('battleAreaUpdated', updated);
        return updated;
        });
        setHand((prev) => prev.filter((c) => c.id !== card.id));
    }

    function requestPilot(card) {
        if (battleCards.length === 0) return false;
        setSelectedPilot(card);
        setShowPilotModal(true);
        return true;
    }

    function assignPilot(unitIndex) {
        setBattleCards((prev) => {
        const updated = prev.map((slot, i) =>
            i === unitIndex
            ? { unit: slot.unit, pilots: [...slot.pilots, selectedPilot] }
            : slot
        );
        socketRef.current.emit('battleAreaUpdated', updated);
        return updated;
        });
        setHand((prev) => prev.filter((c) => c.id !== selectedPilot.id));
        setSelectedPilot(null);
        setShowPilotModal(false);
    }

    function confirmAction(config) {
        setConfirmConfig(config);
        setShowConfirm(true);
    }

    function handleConfirm(accepted) {
        if (accepted && confirmConfig.onConfirm) confirmConfig.onConfirm();
        if (!accepted && confirmConfig.onCancel) confirmConfig.onCancel();
        setShowConfirm(false);
        setConfirmConfig({});
    }

    function drawOneCard() {
        if (deckRef.current.length === 0) return;
        const { drawnCards, remainingDeck } = drawCard(deckRef.current, 1);
        setHand((prev) => [...prev, ...drawnCards]);
        setDeck(remainingDeck);
    }

    function addShieldToField() {
        setShields((prev) => {
        const updated = [...prev];
        shieldAdd((newShields) => updated.push(newShields), setDeck, deckRef.current);
        return updated;
        });
    }

    function removeShield(index) {
        setShields((prev) => {
        const updated = shieldRemove(prev, index);
        return updated;
        });
    }

    return {
        // state
        deck,
        hand,
        battleCards,
        trash,
        shields,
        baseArea,
        myResources,
        rivalResources,
        turn,
        isMyTurn,
        gameTurn,
        showConfirm,
        confirmConfig,
        showPilotModal,
        selectedPilot,
        // actions
        buscarSala,
        
        //por revisar ?¿
        startGame,
        addUnit,
        requestPilot,
        assignPilot,
        confirmAction,
        handleConfirm,
        drawOneCard,
        addShieldToField,
        removeShield,

    };
}
