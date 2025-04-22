import { useEffect, useState, useRef } from 'react';
import { io } from "socket.io-client";

import Tablero from "../components/tableros/Tablero";
import TableroRival from "../components/tableros/TableroRival";
import CartaModal from '../components/modalCarta/CartaModal.jsx';
import ConfirmModal from '../components/modal/Modal';
import ModalAccionesJuego from '../components/modalAccionesJeego/ModalAccionesJuego.jsx';
import PilotAssignModal from '../components/modalPilot/PilotAssingModal.jsx';
import  { initializeDeck, shieldAdd, baseTokenAdd, addResource, addResourceEx, drawCard}  from "../utils/funcionesGame.js"; 

const socket = io('http://192.168.1.136:5000');

const Prueba = () => {
    //Estados para mostrar el modal
    const [showModal, setShowModal] = useState(false);
    const [modalConfig, setModalConfig] = useState({});
    const [isLoading, setIsLoading] = useState(false);

    //Estados para mostrar la carta
    const [modalCarta, setModalCarta] = useState(null)
    const [showModalCarta, setShowModalCarta] = useState(false);
    
    //Estado para modal de acciones que muestren cartas
    const [showModalAcciones, setShowModalAcciones] = useState(false);
    const [configModalModalAcciones, setConfigModalModalAcciones] = useState({});

    //Modal para asignar piloto a unidad
    const [showPilotModal, setShowPilotModal]  = useState(false);

    //Estados para el juego y datos para guardar

    //info turnos
    const [turn, setTurn] = useState(""); // Turno del jugador 
    const turnRef = useRef(turn); // Referencia para el turno
    let countTurn = 0; // Contador de turnos
    //info del mazo j1/j2
    const [deck, setDeck] = useState([]); // Mazo principal
    const deckRef = useRef(deck);
    const [deckInitialized, setDeckInitialized] = useState(false);
    const [deckRival, setDeckRival] = useState("")
    
    //info mano j1/j2
    const [hand, setHand] = useState([]);
    const [rivalHand, setRivalHand] = useState("");

    //info del campo de batalla
    const [battleArea, setBattleArea] = useState([]);
    const [battleCards, setBattleCards] = useState([]);
    const [selectedPilot, setSelectedPilot] = useState(null);
    
    //info del zona escudo y base
    const [shieldArea, setShieldArea] = useState([]);
    const [baseArea, setBaseArea] = useState([]);

    //info de recursos j1/j2
    const [myResources, setMyResources] = useState([]);
    const [rivalResources, setRivalResources] = useState([]);



    //Estado sala para jugar una partida
    const [roomId, setRoomId] = useState(""); // ID de la sala
    let roomIdRef = useRef(roomId); // Referencia para el roomId
    const [players, setPlayers] = useState(new Set()); // Jugadores en la sala

    const [rival, setRival] = useState("")
    //Estados de la partida
        //Decsion del oponente si a echo mulligan o no
    const opponentHasDecidedRef = useRef(false);


    // const [gameStatus, setGameStatus] = useState('buscando'); // Estado del juego: buscando, esperando, empezar
    // const [waitingForOpponent, setWaitingForOpponent] = useState(false);

    const [gameTurn, setGameTurn] = useState(0); // Turno de la partida

    useEffect(() => {

        modalBsucarPartida()

        socket.on('salaCreada', (roomData) => {
            console.log("Sala creadaaa:", roomData);
            roomIdRef = roomData.id;
            setIsLoading(true)
            setShowModal(true);
        });
        socket.on('salaEncontrada', (roomData, startPlayer) => {
            console.log("Sala encontrada:", roomData);
            roomIdRef=roomData.id;
            setTurn(startPlayer);
            setModalConfig({
                title: `Rival encontrado
                Empieza el jugador ${startPlayer}`,
            });
            setIsLoading(true)
            setShowModal(true);
            setTimeout(() => {
                setShowModal(false);
                setIsLoading(false);
            }, 3000);
            setTimeout(async () => {
                const manoInicial = await initializeDeck(setDeck, setHand, setDeckInitialized);
                setConfigModalModalAcciones({
                    title: "Quieres hacer mulligan?",
                    content: "",
                    cartas: manoInicial,
                    actions: [
                        { label: 'Aceptar', onClick:  handleMulligan , style: 'bg-green-500 text-white' },
                        { label: 'Cancelar', onClick: handleCancelModalAcciones, style: 'bg-red-500 text-white' },
                    ]
                });
            
                setShowModalAcciones(true);
            }, 3300);
            
            
        });

        socket.on("mulliganFinalizado", (decisions) => {
            console.log("Decisiones de mulligan:", decisions);
            opponentHasDecidedRef.current = true;
            setShowModal(false);
            console.log("deck actual desde ref", deckRef.current);
            shieldAdd(setShieldArea, setDeck, deckRef.current);
            baseTokenAdd(setBaseArea);
            console.log("Turno actual:", turnRef.current);
            if(localStorage.getItem("user") !== turnRef.current){
                addResourceEx(setMyResources);
            }
            console.log("startTurn", turnRef.current, roomIdRef);
            socket.emit("startTurn", {
                roomId: roomIdRef,
                currentPlayer: turnRef.current
            });
        });

        socket.on("turnoComenzado", handleTurnStart);
        // Limpia los listeners al desmontar el componente
        return () => {
            socket.off("mulliganFinalizado");
            socket.off("turnoComenzado", handleTurnStart);

        };
    
    }, []);

    useEffect(() => {
        deckRef.current = deck;
        console.log("Deck actualizado:", deckRef.current);
    }, [deck]);

    useEffect(() => {
        turnRef.current = turn;
    }, [turn]);

    const emitirBattleAreaActualizada = (battleCards) => {
        console.log("Emitiendo actualización de BattleArea...");
        console.log(battleCards);
        socket.emit("battleAreaUpdated", battleCards); // Emitir el evento
        // alert("BattleArea ha sido actualizada");
    };


    const modalBsucarPartida = () =>{
        setModalConfig({
            title: `Esperando rival`,
            actions: [
                {label: 'Aceptar', onClick: buscarPartida, style: 'bg-blue-500 text-white'},
                {label: 'Cancelar', onClick: handleCancelModal, style: 'bg-gray-500 text-white'},
            ]
        });
        setIsLoading(false)
        setShowModal(true);
    }

    const buscarPartida = () =>{
        console.log("buscando partida")
        socket.emit('buscarSala', localStorage.getItem('user'));
        setShowModal(false)
    }
    //Funcion para realizar el mulligan
    const handleMulligan = () => {
        initializeDeck(setDeck, setHand, setDeckInitialized);
        setShowModalAcciones(false); // Cerrar el modal de acciones
        socket.emit("decidirMulligan", {
            roomId: roomIdRef,
            playerId: localStorage.getItem("user"),
            decision: "mulligan"
        });
        
        if (!opponentHasDecidedRef.current) {
            setIsLoading(true)
            setModalConfig({
                title: "Esperando al otro jugador...",
            });
            setShowModal(true);
        }
    };

    const handleTurnStart = (playerId) => {
        console.log("Turno comenzado para el jugador:", playerId);
        setGameTurn(prev => prev + 1);
        if (playerId === localStorage.getItem("user")) {
            addResource(setMyResources);
            drawCard(deckRef.current, setDeck, setHand, 1);
        }
    };
    //Fnciones para cerrar los modales
    const handleCancelModal = () => setShowModal(false);
    const handleCancelModalAcciones = () => {
        setShowModalAcciones(false)
        socket.emit("decidirMulligan", {
            roomId: roomIdRef,
            playerId: localStorage.getItem("user"),
            decision: "mulligan"
        });
        if (!opponentHasDecidedRef.current) {
            setIsLoading(true)
            setModalConfig({
                title: "Esperando al otro jugador...",
            });
            setShowModal(true);
        }
    };
    const closeModalCarta = () => {
        setModalCarta(null); // Limpiamos la carta seleccionada
        setShowModalCarta(false); // Cerramos el modal
    };
return (
    <main className="relative w-full h-screen">

        <ConfirmModal
            show={showModal}
            title={modalConfig.title}
            content={modalConfig.content}
            actions={modalConfig.actions}
            isLoading={isLoading}
        />
        <CartaModal 
            show={showModalCarta}
            close={closeModalCarta}
            carta={modalCarta}
        />
        <ModalAccionesJuego 
            show={showModalAcciones}
            title={configModalModalAcciones.title}
            content={configModalModalAcciones.content}
            actions={configModalModalAcciones.actions}
            cartas={configModalModalAcciones.cartas} // <-- añade esto
            isLoading={isLoading}
        />
        <PilotAssignModal
            show={showPilotModal}
            units={battleCards}
            pilotCard={selectedPilot}
            onAssign={assignPilotToUnit}
            onClose={() => setShowPilotModal(false)}
        />
        <div className="absolute z-0 flex flex-col items-center justify-center w-full h-screen gap-0 perspective-00">
            <div className="w-[90%] h-[50%] bg-gradient-to-br from-gray-800 to-gray-600 border border-gray-700 shadow-lg rounded-lg flex justify-center items-center transform rotate-z-[180deg] rotate-x-[20deg]  ">
                <TableroRival deckRival={deckRival} rivalHand={rivalHand}/>
            </div>
            <div className="relative zona-jugador w-[90%] h-[50%] bg-gradient-to-br from-gray-800 to-gray-600 border border-gray-700 shadow-lg rounded-lg flex justify-center items-center transform rotate-x-[20deg]">
                <Tablero 
                    deck={deck} 
                    setDeck={setDeck}
                    hand={hand}
                    setHand={setHand}
                    battleArea={battleArea}
                    setBattleArea={setBattleArea}
                    setShowModalCarta={setShowModalCarta} 
                    setModalCarta={setModalCarta}
                    emitirBattleAreaActualizada={emitirBattleAreaActualizada}
                    shieldArea={shieldArea}
                    setShieldArea={setShieldArea}
                    baseArea={baseArea}
                    myResources={myResources}
                    setMyResources={setMyResources}
                    rivalResources={rivalResources}
                />
            </div>
        </div>
    </main>
)
};

export default Prueba;