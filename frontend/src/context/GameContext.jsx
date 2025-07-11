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
import { use } from 'react';


const GameContext = createContext();
export const useGame = () => useContext(GameContext);

export function GameProvider({ children }) {
  // — Estados de juego —

        // --- State turns ---
        const [currentPlayer, setCurrentPlayer] = useState(null);   // "player1" o "player2"
        const [turnCount, setTurnCount]         = useState(0);      // número de turnos transcurridos
        const [players, setPlayers]         = useState([]);      // jugadores en la sala
        const [hasConfirmedMulligan, setHasConfirmedMulligan] = useState(false);
        const [opponentConfirmedMulligan, setOpponentConfirmedMulligan] = useState(false);

        // --- State game phase ---
        const [hasRunSetup, setHasRunSetup] = useState(false);
        const [turnPhaseIndex, setTurnPhaseIndex] = useState();
        const [setupPhaseIndex, setSetupPhaseIndex] = useState();
        const currentPhase = !hasRunSetup
            ? PHASES_SETUP[setupPhaseIndex]
            : PHASES[turnPhaseIndex];


        // --- State refs ---
        const roomIdRef = useRef(null);
        const turnRef = useRef(null);
        const pendingSearch = useRef(null);
    
        // --- Game state ---
        // datos del mazo
        const [deck, setDeck] = useState([]);
        const [deckInitialized, setDeckInitialized] = useState(false);
        const deckRef = useRef([]);
        // datos mazo rival
        const [deckRival, setDeckRival] = useState([]);
        // datos de la mano
        const [hand, setHand] = useState([]);
        const handRef = useRef([]);
        // datos de la mano rival
        const [handRival, setHandRival] = useState([]);
        const handRivalRef = useRef([]);
        // datos de la zona de batalla
        const [battleCards, setBattleCards] = useState([]);
        // datos de la zona de batalla rival
        const [battleCardsRival, setBattleCardsRival] = useState([]);
        // datos de la zona de descarte
        const [trash, setTrash] = useState([]);
        // datos de la zona de descarte rival
        const [trashRival, setTrashRival] = useState([]);
        // datos de la zona de escudos
        const [shields, setShields] = useState([]);
        // datos de la zona de escudos rival
        const [shieldsRival, setShieldsRival] = useState([]);
        // datos de la zona de la base
        const [baseArea, setBaseArea] = useState([]);
        // datos de la zona de la base rival
        const [baseAreaRival, setBaseAreaRival] = useState([]);

        const [rotated, setRotated] = useState({});
        const [rotatedRival, setRotatedRival] = useState({});  // nuevas rotaciones del rival

        // datos de la zona de resources//energia
        const [myResources, setMyResources] = useState([]);
        const [rivalResources, setRivalResources] = useState([]);
        // datos de los turnos
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
        const [showCartaModal, setShowCartaModal] = useState(false);
        const [selectedCarta, setSelectedCarta] = useState(null);
    // — Ref para búsquedas —

    // — Handlers definidos una sola vez —
    const onSalaCreada = room => console.log('Sala creada:', room);
    const onSalaEncontrada = (room,startPlayer) => {
        roomIdRef.current = room.id;
        setPlayers(room.players);
        setCurrentPlayer(startPlayer);
        setTurnCount(1);
        setSetupPhaseIndex(0);
        setShowModal(false);
    };

    useEffect(() => {
        const handler = phaseHandlers[currentPhase];
        if (handler) handler();
    }, [currentPhase]);

    // — Conexión socket solo aquí —
    useEffect(() => {
        if (!socket.connected) socket.connect();
        socket.once('salaCreada',    onSalaCreada);
        socket.once('salaEncontrada', onSalaEncontrada);
        socket.on('opponentHand', ({ playerId, hand }) => {
            console.log('opponentHand', playerId, hand);
            setHandRival(hand);
            handRival.current = hand; // Actualiza la ref de la mano rival
        });
        socket.on('opponentDeck', ({ playerId, deck }) => {
            setDeckRival(deck);
        });
        socket.on("opponentShields", ({ playerId, shields }) => {
            setShieldsRival(shields);
        })
        socket.on("opponentResources", ({ playerId, resources }) => {
            setRivalResources(resources);
        })
        socket.on("opponentBaseArea", ({ playerId, baseArea }) => {
            setBaseAreaRival(baseArea);
        })
        socket.on("opponentBattleArea", ({ playerId, battleCards }) => {
            setBattleCardsRival(battleCards);
        })
        socket.on("opponentTrash", ({ playerId, trash }) => {
            setTrashRival(trash);
        })
        socket.on('opponentRotated', ({ playerId, rotated }) => {
            setRotatedRival(rotated);
        });

        socket.on("actualizarMulligan", ({ playerId }) => {
            const myId = localStorage.getItem("user");
            if (playerId === myId) {
                setHasConfirmedMulligan(true);
            } else {
                setOpponentConfirmedMulligan(true);
            }
        });

        // socket.on('turnoComenzado', ({ currentPlayer }) => {
        //     setCurrentPlayer(currentPlayer);
        //     setTurnPhaseIndex(PHASES.indexOf('DRAW_PHASE'));
        //     console.log(`Es el turno de: ${currentPlayer}`);
        // })
        return () => {
        socket.off('salaCreada',    onSalaCreada);
        socket.off('salaEncontrada', onSalaEncontrada);
        socket.off('opponentHand');
        socket.off('opponentDeck');
        socket.off('opponentRotated');
        socket.off("actualizarMulligan")
        socket.off('startTurn');
        };
    }, []);

    // — Acción pública para buscarSala —
    function buscarSala(user) {
        pendingSearch.current = user;
        socket.emit('buscarSala', user);
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
        changeTurn(); // Cambia el jugador y resetea la fase a 0

        if (hasRunSetup) {
            setTurnPhaseIndex(PHASES.indexOf('DRAW_PHASE'));
        }

        const nextPlayer = players[(players.indexOf(currentPlayer) + 1) % players.length];

        socket.emit('startTurn', {
            roomId: roomIdRef.current,
            currentPlayer: nextPlayer,
        });
    }


    // — Acciones para el ciclo de juego // Gestion automatica de acciones por fases de la partida —
    const phaseHandlers = {
        SETUP_DECK: async () => {
            // Inicializa el mazo y lo guarda en la ref
            const mano = await initializeDeck(setDeck, setHand, setDeckInitialized);
            handRef.current = mano["initialHand"];
            deckRef.current = mano["remainingDeck"];

            syncHand(); // Sincroniza la mano con el rival
            syncDeck(); // Sincroniza el mazo con el rival

            setSetupPhaseIndex(i => i + 1); // Avanza a la siguiente fase de setup
        },
        MULLIGAN: () => {
            const manoActual = handRef.current;
            setShowModalAcciones(true);
            setConfigModalModalAcciones({
                title: "Quieres hacer mulligan?",
                content: "",
                cartas: manoActual,
                actions: [
                    { 
                        label: 'Aceptar', onClick: async () => {
                        const mano = await initializeDeck(setDeck, setHand, setDeckInitialized);
                        handRef.current = mano["initialHand"];
                        deckRef.current = mano["remainingDeck"];

                        syncHand();
                        syncDeck();
                        setShowModalAcciones(false);

                        actualizarMulligan();
                        setShowModal(true)
                        setModalConfig(cfg => ({ ...cfg, title: 'Esperando mulligan del rival' }));

                        }, 
                        style: 'bg-green-500 text-white' 
                    },
                    { 
                        label: 'Cancelar', onClick: () => {
                        setShowModalAcciones(false);
                        actualizarMulligan();
                        setShowModal(true)
                        setModalConfig(cfg => ({ ...cfg, title: 'Esperando mulligan del rival' }));
                        
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
        DRAW_PHASE: async () => {
            if(currentPlayer === localStorage.getItem('user')) {
                const datos = await drawCard(deck, setDeck, setHand, 1,handRef)
                deckRef.current = datos["remainingDeck"];

            syncHand(); // Sincroniza la mano con el rival
            syncDeck(); // Sincroniza el mazo con el rival
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

    // — Use efects para sincronizar —
    // Dentro de GameProvider:
    useEffect(() => {
        // Cada vez que cambie `hand`, sincroniza
        syncHand();
    }, [hand]);
    
    useEffect(() => {
        // Cada vez que cambie `deck`, sincroniza
        syncDeck();
    }, [deck]);

    useEffect(() => {
        syncShields();
    }, [shields]);

    useEffect(() => {
        syncResources();
    }, [myResources]);

    useEffect(() => {
        syncBaseArea();
    }, [baseArea]);

    useEffect(() => {
        syncBattleCards()
    }, [battleCards]);

    useEffect(() => {
        syncTrash()
    }, [trash]);

    useEffect(() => {
        if (hasConfirmedMulligan && !opponentConfirmedMulligan) {
            setModalConfig({ title: "Esperando mulligan del rival" });
            setShowModal(true);
        } else if (hasConfirmedMulligan && opponentConfirmedMulligan) {
            setShowModal(false);
            setSetupPhaseIndex(i => i + 1); 
        }
    }, [hasConfirmedMulligan, opponentConfirmedMulligan]);

    useEffect(() => {
        socket.on('startTurn', ({ currentPlayer }) => {
            setCurrentPlayer(currentPlayer);

            // Si ya se ha hecho el setup, comienza desde la fase de robo
            if (hasRunSetup) {
                setTurnPhaseIndex(PHASES.indexOf('DRAW_PHASE'));
            } else {
                // Si no, aún estás en las fases de setup
                setTurnPhaseIndex(0); // O la que corresponda en PHASES_SETUP
            }

            // También puedes gestionar si el turno es tuyo
            if (currentPlayer === localStorage.getItem('user')) {
                setIsMyTurn(true);
            } else {
                setIsMyTurn(false);
            }
            // Incrementa el contador de turnos
            setTurnCount(tc => tc + 1);
            console.log(`Nuevo turno de: ${currentPlayer}`);
        });

        return () => {
            socket.off('startTurn');
        };
    }, [hasRunSetup, currentPlayer]);

    // — Funciones para sincronizar datos al rival —
    function syncHand() {
        socket.emit('syncHand', {
            roomId: roomIdRef.current,
            playerId: localStorage.getItem('user'),
            hand: hand,
        });
    }
    function syncDeck() {
        socket.emit('syncDeck', {
            roomId: roomIdRef.current,
            playerId: localStorage.getItem('user'),
            deck: deckRef.current,
        });
    }
    function syncBattleCards() {
        socket.emit('syncBattleCards', {
            roomId: roomIdRef.current,
            playerId: localStorage.getItem('user'),
            battleCards: battleCards,
        });
    }
    function syncShields() {
        socket.emit('syncShields', {
            roomId: roomIdRef.current,
            playerId: localStorage.getItem('user'),
            shields: shields,
        });
    }
    function syncBaseArea() {
        socket.emit('syncBaseArea', {
            roomId: roomIdRef.current,
            playerId: localStorage.getItem('user'),
            baseArea: baseArea,
        });
    }
    function syncResources() {
        socket.emit('syncResources', {
            roomId: roomIdRef.current,
            playerId: localStorage.getItem('user'),
            resources: myResources,
        });
    }
    function syncTrash() {
        socket.emit('syncTrash', {
            roomId: roomIdRef.current,
            playerId: localStorage.getItem('user'),
            trash: trash,
        });
    }
    function actualizarMulligan() {
        socket.emit("confirmarMulligan", { 
            roomId: roomIdRef.current,
            playerId: localStorage.getItem('user'),});
        setHasConfirmedMulligan(true);
    }
    // — Otras acciones (draw, play, etc.) …
    // function drawOne() {
    //     const { drawnCards, remainingDeck } = drawCard(deckRef.current, 1);
    //     setHand(h => [...h, ...drawnCards]);
    //     deckRef.current = remainingDeck;
    // }
    function flipCard(idx) {
        setRotated(prev => {
            const next = { ...prev, [idx]: !prev[idx] };
            // sincronizamos por socket con todos en la sala
            socket.emit('syncRotated', {
            roomId: roomIdRef.current,
            playerId: localStorage.getItem('user'),
            rotated: next,
            });
            return next;
        });
    }

    return (
        <GameContext.Provider value={{
                // state
                deck,
                setDeck,
                deckRival,
                setDeckRival,
                hand,
                setHand,
                handRival,
                setHandRival,
                handRef,
                handRivalRef,
                battleCards,
                setBattleCards,
                battleCardsRival,
                setBattleCardsRival,
                trash,
                setTrash,
                trashRival,
                setTrashRival,
                shields,
                setShields,
                shieldsRival,
                setShieldsRival,
                baseArea,
                setBaseArea,
                baseAreaRival,
                setBaseAreaRival,
                rotated,
                setRotated,
                rotatedRival,
                setRotatedRival,
                myResources,
                setMyResources,
                rivalResources,
                setRivalResources,
                turn,
                isMyTurn,
                gameTurn,
                currentPlayer,
                turnCount,
                showModal,
                setShowModal,
                isLoading, 
                setIsLoading,
                modalConfig, 
                setModalConfig,
                showModalAcciones,
                setShowModalAcciones,
                configModalModalAcciones,
                setConfigModalModalAcciones,
                showCartaModal,
                setShowCartaModal,
                selectedCarta,
                setSelectedCarta,
                showConfirm,
                confirmConfig,
                showPilotModal,
                selectedPilot,
                buscarSala,
                endTurn,
                syncDeck, 
                syncHand,
                flipCard
        }}>
        {children}
        </GameContext.Provider>
    );
}
