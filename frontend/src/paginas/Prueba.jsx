import { useEffect, useState } from 'react';
import { io } from "socket.io-client";

import Tablero from "../components/tableros/Tablero";
import TableroRival from "../components/tableros/TableroRival";
import CartaModal from '../components/modalCarta/CartaModal.jsx';
import ConfirmModal from '../components/modal/Modal';
import  { initializeDeck, shieldAdd}  from "../utils/funcionesGame.js"; 

const socket = io('http://localhost:5000');

const Prueba = () => {
    //Estados para mostrar el modal
    const [showModal, setShowModal] = useState(false);
    const [modalConfig, setModalConfig] = useState({});
    const [isLoading, setIsLoading] = useState(false);


    const [deck, setDeck] = useState([]); // Mazo principal
    const [hand, setHand] = useState([]);
    const [rivalHand, setRivalHand] = useState("");

    const [deckInitialized, setDeckInitialized] = useState(false);

    const [modalCarta, setModalCarta] = useState(null)
    const [showModalCarta, setShowModalCarta] = useState(false);

    const [battleArea, setBattleArea] = useState([]);

    const [deckRival, setDeckRival] = useState("")

    const [shieldArea, setShieldArea] = useState([]);
    //Estado sala para jugar una partida
    const [roomId, setRoomId] = useState(""); // ID de la sala
    const [players, setPlayers] = useState(new Set()); // Jugadores en la sala
    const [turnPlayers, setTurnPlayer] = useState("");

    const [rival, setRival] = useState("")
    //Estados de la partida
    // const [gameStatus, setGameStatus] = useState('buscando'); // Estado del juego: buscando, esperando, empezar
    // const [waitingForOpponent, setWaitingForOpponent] = useState(false);

    const [gameTurn, setGameTurn] = useState(0); // Turno de la partida

    useEffect(() => {
        const user = localStorage.getItem('user');
        
        console.log('Player connected:', localStorage.getItem("idSocket"));
        

        modalBsucarPartida()

        socket.on('salaCreada', (roomData) => {
            setIsLoading(true)
            setShowModal(true)
            console.log(roomData.id)
            setRoomId(roomData.id)
            localStorage.setItem("roomId", roomData.id);
        });
        socket.on('salaEncontrada', (roomData, startPlayer) => {
            console.log("te uniste a la sala", roomData.players)
            setRoomId(roomData.id)
            localStorage.setItem("roomId", roomData.id);
            setRival(roomData.players.find(player => player !== localStorage.getItem(user)))
            const playersSet = new Set (roomData.players)
            setPlayers(playersSet)
            setTurnPlayer(startPlayer)
            console.log("los jugadores son", players)
            empezarPartida(startPlayer)
            setDeckRival("40")
            setRivalHand("5")
        });

        socket.on('mulliganFinalizado', () => {
            setShowModal(false);
        
            setDeck(prevDeck => shieldAdd(setShieldArea, setDeck, prevDeck));

        });

        // Limpia los listeners al desmontar el componente
        return () => {

        };
    
    }, []);
        
    useEffect(() => {
        console.log(deck)
        console.log(shieldArea); // Ahora se ejecutará después de que el estado se haya actualizado
    }, [shieldArea]);

    
    const buscarPartida = () =>{
        console.log("buscando partida")
        socket.emit('buscarSala', localStorage.getItem('user'));
        setShowModal(false)
    }

    const handleCancel = () => setShowModal(false);

    const hacerMulligan = () => {
        initializeDeck(setDeck, setHand, setDeckInitialized)

        socket.emit("decidirMulligan", {roomId: localStorage.getItem("roomId"), playerId: localStorage.getItem('user'), decision: true});
        setModalConfig(
            {
                title: `Esperando a que el rival decida hacer mulligan`,
            }
        )
        setIsLoading(true)
    }

    const modalBsucarPartida = () =>{
        setModalConfig({
            title: `Esperando rival`,
            actions: [
                {label: 'Aceptar', onClick: buscarPartida, style: 'bg-blue-500 text-white'},
                {label: 'Cancelar', onClick: handleCancel, style: 'bg-gray-500 text-white'},
            ]
        });
        setIsLoading(false)
        setShowModal(true);
    }

    const empezarPartida = ( startPlayer) =>{
        setGameTurn(startPlayer);
        setModalConfig(
            {
                title: `Rival encontrado.\n Empieza el jugador ${startPlayer}`,
            }
        )
        setIsLoading(true)
        setShowModal(true)

        setTimeout(() => {
            setShowModal(false); // Cerrar el modal
            // Aquí puedes redirigir a la pantalla de partida,
        }, 2000); // Espera 2 segundos antes de cerrar el moda
        console.log("Empezamos la partida")
        initializeDeck(setDeck, setHand, setDeckInitialized);
        console.log(deck)
        setTimeout(() => {
            setModalConfig(
                {
                    title: `Quieres realizar mulligan?`,
                    actions: [
                        {label: 'Aceptar', onClick: hacerMulligan , style: 'bg-blue-500 text-white'},
                        {label: 'Cancelar', onClick: handleCancellMulligan, style: 'bg-gray-500 text-white'},
                    ]
                }
            )
            setIsLoading(false)
            setShowModal(true);
        }, 3000);
    }

    const closeModal = () => {
        setModalCarta(null); // Limpiamos la carta seleccionada
        setShowModalCarta(false); // Cerramos el modal
    };
    
    const handleCancellMulligan = () => {

        socket.emit("decidirMulligan", {roomId: localStorage.getItem("roomId"), playerId: localStorage.getItem('user'), decision: false});

        setModalConfig(
            {
                title: `Esperando a que el rival decida hacer mulligan`,
            }
        )
        setIsLoading(true)
    }

    const emitirBattleAreaActualizada = (battleCards) => {
        console.log("Emitiendo actualización de BattleArea...");
        console.log(battleCards);
        socket.emit("battleAreaUpdated", battleCards); // Emitir el evento
        // alert("BattleArea ha sido actualizada");
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
            close={closeModal}
            carta={modalCarta}
        />

        <div className="absolute z-0 flex flex-col items-center justify-center w-full h-screen gap-0 perspective-00">
            <div className="w-[90%] h-[50%] bg-gradient-to-br from-gray-800 to-gray-600 border border-gray-700 shadow-lg rounded-lg flex justify-center items-center transform rotate-z-[180deg] rotate-x-[20deg]  ">
                <TableroRival deckRival={deckRival} rivalHand={rivalHand}/>
            </div>
            <div className="relative zona-jugador w-[90%] h-[50%] bg-gradient-to-br from-gray-800 to-gray-600 border border-gray-700 shadow-lg rounded-lg flex justify-center items-center transform rotate-x-[20deg]">
                <Tablero 
                    deck={deck} 
                    hand={hand}
                    setHand={setHand}
                    battleArea={battleArea}
                    setBattleArea={setBattleArea}
                    setShowModalCarta={setShowModalCarta} 
                    setModalCarta={setModalCarta}
                    emitirBattleAreaActualizada={emitirBattleAreaActualizada}
                    shieldArea={shieldArea}
                />
            </div>
        </div>
    </main>
)
};

export default Prueba;