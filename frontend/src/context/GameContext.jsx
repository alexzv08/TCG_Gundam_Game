// src/contexts/GameContext.jsx
import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import socket from '../utils/socket'; // Importa el socket --> Conecxion al socket
import { PHASES,PHASES_SETUP } from '../constant/phases'; // Importa las fases del juego
import {
    initializeDeck,
    drawCard,
    shieldAdd,
    shieldRemove,
    addResource,
    addResourceEx,
    baseTokenAdd,
    nextTurn,
    nextPhase
} from '../utils/funcionesGame';


const GameContext = createContext();
export const useGame = () => useContext(GameContext);

export function GameProvider({ children }) {
  // — Estados de juego —

        // --- State turns ---
        const [currentPlayer, setCurrentPlayer] = useState(null);   // "player1" o "player2"
        const [turnCount, setTurnCount]         = useState(0);      // número de turnos transcurridos
        const [players, setPlayers]         = useState([]);      // jugadores en la sala

        // --- State game phase ---
        const [hasRunSetup, setHasRunSetup] = useState(false);
        const [turnPhaseIndex, setTurnPhaseIndex] = useState();
        const [setupPhaseIndex, setSetupPhaseIndex] = useState();
        const currentPhase = !hasRunSetup
            ? PHASES_SETUP[setupPhaseIndex]
            : PHASES[turnPhaseIndex];


        // --- State refs ---
        const deckRef = useRef([]);
        const roomIdRef = useRef(null);
        const turnRef = useRef(null);
        const pendingSearch = useRef(null);
    
        // --- Game state ---
        const [deck, setDeck] = useState([]);
        const [deckInitialized, setDeckInitialized] = useState(false);
        // datos de la mano
        const [hand, setHand] = useState([]);
        const handRef = useRef([]);

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
        const [showModal, setShowModal] = useState(true);
        const [showConfirm, setShowConfirm] = useState(false);
        const [confirmConfig, setConfirmConfig] = useState({});
        const [showPilotModal, setShowPilotModal] = useState(false);
        const [selectedPilot, setSelectedPilot] = useState(null);
        const [modalConfig, setModalConfig] = useState({
            title: '',
            content: [],      // debe ser array
            actions: [],      // debe ser array
            isLoading: false
        });
        const [isLoading, setIsLoading] = useState(false);
        // Modal en el que enseño cartas
        const [showModalAcciones, setShowModalAcciones] = useState(false);
        const [configModalModalAcciones, setConfigModalModalAcciones] = useState({});
    // — Ref para búsquedas —

    // — Handlers definidos una sola vez —
    const onSalaCreada = room => console.log('Sala creada:', room);
    const onSalaEncontrada = (room,startPlayer) => {
        setPlayers(room.players);
        setCurrentPlayer(startPlayer);
        setTurnCount(1);
        setSetupPhaseIndex(0);
        setShowModal(false);
    };

    useEffect(() => {
        console.log("Fase actualizada a:", currentPhase);
        const handler = phaseHandlers[currentPhase];
        if (handler) handler();
    }, [currentPhase]);

    // — Conexión socket solo aquí —
    useEffect(() => {
        if (!socket.connected) socket.connect();
        socket.once('salaCreada',    onSalaCreada);
        socket.once('salaEncontrada', onSalaEncontrada);
        return () => {
        socket.off('salaCreada',    onSalaCreada);
        socket.off('salaEncontrada', onSalaEncontrada);
        };
    }, []);

    // — Acción pública para buscarSala —
    function buscarSala(user) {
        pendingSearch.current = user;
        socket.emit('buscarSala', user);
    }
    // — Accion para avanzar de fase —
    function handleAdvancePhase() {
        nextPhase(
            hasRunSetup,
            setupPhaseIndex,
            turnPhaseIndex,
            setHasRunSetup,
            setSetupPhaseIndex,
            setTurnPhaseIndex,
            nextTurn
        );
    }

    // — Funcion para cambiar el turno —
    function changeTurn() {
        setCurrentPlayer(prev =>
            players[(players.indexOf(prev) + 1) % players.length]
        );
        setTurnCount(tc => tc + 1);
        setTurnPhaseIndex(0);
    }
    // — Funcion para finalizar el turno —
    function endTurn() {
    changeTurn();
    if (hasRunSetup) {
        setTurnPhaseIndex(PHASES.indexOf('DRAW_PHASE'));
    }
    // socket.emit('startTurn', {
    //     roomId: roomIdRef.current,
    //     currentPlayer: players[(players.indexOf(currentPlayer) + 1) % players.length]
    // });
    }

    // — Acciones para el ciclo de juego // Gestion automatica de acciones por fases de la partida —
    const phaseHandlers = {
        SETUP_DECK: async () => {
            // Inicializa el mazo y lo guarda en la ref
            const mano = await initializeDeck(setDeck, setHand, setDeckInitialized);
            handRef.current = mano;
            setSetupPhaseIndex(i => i + 1); // Avanza a la siguiente fase de setup
        },
        MULLIGAN: () => {
            const manoActual = handRef.current;
            console.log("Mano inicial:", manoActual); 
            setShowModalAcciones(true);
            setConfigModalModalAcciones({
                title: "Quieres hacer mulligan?",
                content: "",
                cartas: manoActual,
                actions: [
                    { 
                        label: 'Aceptar', onClick: () => {
                        initializeDeck(setDeck, setHand, setDeckInitialized);
                        setShowModalAcciones(false);
                        setSetupPhaseIndex(i => i + 1); 
                        }, 
                        style: 'bg-green-500 text-white' 
                    },
                    { 
                        label: 'Cancelar', onClick: () => {
                        setShowModalAcciones(false);
                        setSetupPhaseIndex(i => i + 1); 
                        },
                        style: 'bg-red-500 text-white' 
                    },
                ]
            });
        },
        SETUP_BASE: () => {
            baseTokenAdd(setBaseArea)
            setSetupPhaseIndex(i => i + 1); 
        },
        SETUP_SHIELD: () => {
            shieldAdd(setShields, setDeck, deck)
            setSetupPhaseIndex(i => i + 1); 
        },
        SETUP_RESOURCES: () => {
            if (currentPlayer !== localStorage.getItem('user')) {
                addResourceEx(setMyResources);
            }
            setHasRunSetup(true);
            setTurnPhaseIndex(0);
        },
        START_ACTIVE_STEP: () => {
            if(currentPlayer === localStorage.getItem('user')) {
                // todo funcion para enderezar cartas enjuego
                // todo funcion para enderezar recursos
            }
            setTurnPhaseIndex(i => i + 1); 
        },
        START_STEP: () => {
            if(currentPlayer === localStorage.getItem('user')) {
                // todo funcion activacion de los efectos start-turn
            }
            setTurnPhaseIndex(i => i + 1); 
        },
        DRAW_PHASE: () => {
            if(currentPlayer === localStorage.getItem('user')) {
                drawCard(deck, setDeck, setHand, 1)
            }
            setTurnPhaseIndex(i => i + 1); 
        },
        RESOURCE_PHASE: () => {
            if(currentPlayer === localStorage.getItem('user')) {
                addResource(setMyResources); // Llama a la función para agregar un recurso
            }
            setTurnPhaseIndex(i => i + 1); 
        }


    }

    // — Otras acciones (draw, play, etc.) …
    // function drawOne() {
    //     const { drawnCards, remainingDeck } = drawCard(deckRef.current, 1);
    //     setHand(h => [...h, ...drawnCards]);
    //     deckRef.current = remainingDeck;
    // }

    return (
        <GameContext.Provider value={{
                // state
                deck,
                setDeck,
                hand,
                setHand,
                battleCards,
                trash,
                shields,
                baseArea,
                setBaseArea,
                myResources,
                setMyResources,
                rivalResources,
                turn,
                isMyTurn,
                gameTurn,
                showModal,
                setShowModal,
                isLoading, 
                setIsLoading,
                modalConfig, 
                setModalConfig,
                showModalAcciones,
                configModalModalAcciones,
                setShowModalAcciones,
                setConfigModalModalAcciones,
                showConfirm,
                confirmConfig,
                showPilotModal,
                selectedPilot,
                buscarSala,
                endTurn
        }}>
        {children}
        </GameContext.Provider>
    );
}
