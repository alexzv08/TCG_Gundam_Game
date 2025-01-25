
import { useEffect, useState } from 'react';
import { io } from "socket.io-client";
import Game from "../../utils/game.js"
import ConfirmModal from '../modal/Modal.jsx';
import CartaModal from '../modalCarta/CartaModal.jsx';
import  { initializeDeck, shieldAdd, baseTokenAdd, resourceAdd }  from "../../utils/funcionesGame.js"; 
const SOCKET_URL  = "http://localhost:5000";

const TableroDeJuego = () => {  
    
    // Fase de la partida
    const [game, setGame] = useState(new Game());  // Estado para la instancia del juego

    const [deck, setDeck] = useState([]); // Mazo principal
    const [hand, setHand] = useState([]);
    const [deckInitialized, setDeckInitialized] = useState(false); // Bandera para controlar la inicialización del mazo
    const [battleZone, setBattleZone] = useState([]); // Zona de batalla
    const [discardZone, setDiscardZone] = useState([]); // Zona de descarte
    const [shieldArea, setShieldArea] = useState([])
    const [baseArea, setBaseArea] = useState([])
    const [resourceDeck, setResourceDeck] = useState([])
    const [resourceArea, setResourceArea] = useState([])

    
    const[jugadorInicial, setJugadorInicial] = useState("")
    const[esTuTurno, setEsTuTurno] = useState(Boolean)
    //Estados para mostrar el modal
    const [showModal, setShowModal] = useState(false);
    const [modalMessage, setModalMessage] = useState("");

    const [modalCarta, setModalCarta] = useState(null)
    const [showModalCarta, setShowModalCarta] = useState(false);

    const [initialized, setInitialized] = useState(false);
    useEffect(() => {
        const socket = io(SOCKET_URL);
    
        socket.on("connect", () => {
    
            // Generar un playerId único para este jugador
            const storedPlayerId = localStorage.getItem("user");
    
            // Emitir el evento 'playerConnected' con el playerId al servidor
            socket.emit("playerConnected", { playerId: storedPlayerId });
        });
        

        const idPartida = "123"; // Este ID puede ser dinámico
        socket.emit("unirseAPartida", idPartida, localStorage.getItem("user"));

        // Escuchar el evento del jugador inicial
        socket.on("jugadorInicial", (data) => {
            console.log("Jugador inicial recibido:", data);
            setJugadorInicial(data.jugadorInicial);
            setEsTuTurno(data.esTuTurno);

            // Modal de inicio
            setModalMessage(`Empieza el jugador: ${data.jugadorInicial}`);
            setShowModal(true);
        });

        socket.on("esperandoOponente", (data) => {
            console.log("espero al oponente")
            setModalMessage(data.mensaje); // "Esperando al oponente..."
            setShowModal(true);
        });

        socket.on("disconnect", () => {
        });

        return () => {
            socket.disconnect(); // Asegurarse de cerrar la conexión al desmontar el componente
        };
    }, []);

    useEffect(() =>{
        const socket = io(SOCKET_URL);
        
        socket.on("jugadorInicial", (data) => {
            console.log(data)
            setJugadorInicial(data.jugadorInicial);
        });

        socket.on("esperandoOponente", (data) => {
            console.log("espero al oponente")
            setModalMessage(data.mensaje); // "Esperando al oponente..."
            setShowModal(true);
        });
    })
    // Función para cambiar la fase
    const avanzarFase = () => {
        game.executePhase()
        game.advancePhase(); // Avanzamos a la siguiente fase
    };

    // Función para ejecutar la fase actual
    const ejecutarFase = () => {
        if (game) {
            game.executePhase();  // Ejecutar la fase actual en la clase Game
            setGame(game.currentState);  // Actualizar el estado con la fase actual
        }
    };


    // useEffect para ejecutar handleDrawCard cuando deck se haya actualizado
    // useEffect(() => {
    //     if (!deckInitialized && !initialized && !jugadorInicial) {
    //         setInitialized(true); // Marcamos que ya ejecutamos la lógica
    //         setModalMessage(`Empieza el jugador: ${jugadorInicial}`);
    //         setShowModal(true);
    //     }
    // }, [deckInitialized,initialized,jugadorInicial]);

    useEffect(() => {
        console.log(game.currentState)
        if(game.currentState == "MULLIGAN"){
            console.log("vamos bien")
            setModalMessage("¿Quieres hacer mulligan?"); // Mensaje inicial del modal
            setShowModal(true);
        }
        if(game.currentState == "SHIELD_FORCE"){
            console.log("montamos las vidas")
            shieldAdd(setShieldArea, setDeck, deck)
            game.advancePhase()
        }

        if(game.currentState == "TOKEN_BASE"){
            console.log("montamos pongo la base")
            baseTokenAdd(setBaseArea)
            console.log(baseArea)
            game.advancePhase()
        }

        if(game.currentState == "TOKEN_RESOURCE"){
            resourceAdd(setResourceArea,setResourceDeck)
            console.log(resourceArea)
            console.log(resourceDeck)
            // game.advancePhase()
        }
    },[game.currentState])


    useEffect(() => {
        // if (shieldArea.length > 0) {
        //     console.log(deck)
        //     console.log('shieldArea actualizado:', shieldArea);
        // }
    }, [shieldArea]);

    useEffect(() => {

    }, [baseArea])

    useEffect(() => {
        
    }, [resourceDeck])

    useEffect(() => {
        console.log(resourceArea)
        
    }, [resourceArea])

    const handleConfirm = () => {
        setShowModal(false); // Ocultamos el modal
        if ( game.currentState == "INITIAL_DRAW" || game.currentState == "MULLIGAN") {
            initializeDeck(setDeck, setHand, setDeckInitialized); // Lógica para inicializar el mazo
            game.advancePhase()
        }
    };

    const handleCancel = () => {
        setShowModal(false); // Ocultamos el modal
        if (game.currentState == "MULLIGAN") {
            game.advancePhase()
        }
        console.log("El usuario decidió cancelar.");
    };

    const closeModal = () => {
        setModalCarta(null); // Limpiamos la carta seleccionada
        setShowModalCarta(false); // Cerramos el modal
    };

    const abrirModal = (carta) => {
        console.log("Carta seleccionada:", carta);
        setModalCarta(carta); // Pasamos el objeto de la carta seleccionada
        setShowModalCarta(true); // Mostramos el modal
    };


    const renderResource = () =>{
        return resourceArea.map((index) =>(

            <div key={index} className="relative w-6 h-6">
            {/* Brillo externo */}
            <div className="absolute inset-0 transform rotate-45 bg-gradient-to-br from-blue-500 to-blue-800 rounded-sd shadow-[0_0_30px_10px_rgba(59,130,246,0.5)] animate-pulse"></div>
            {/* Fondo con animación */}
            <div className="absolute inset-0 transform rotate-45 rounded-lg shadow-lg bg-gradient-to-br from-blue-300 via-blue-500 to-blue-700 opacity-80"></div>
            {/* Contenido */}
            <div className="absolute inset-0 flex items-center justify-center text-2xl font-bold text-white transform rotate-45">
            
            </div>
          </div>
        ));
    }

    const renderHand = () => {
        return hand.map((card, index) => (
            <div key={`${card.id_carta}-${index}`} className="card"
            draggable
            onDragStart={(e) => handleDragStart(e, card)}
            onClick={() => abrirModal(card)}
            >
                <div className='relative'>
                    <img
                        src={`../../../public/imgCards/${card.id_coleccion}-${card.id_carta}.webp`}
                        alt={card.nombre}
                        className="w-24 h-32"
                        />
                    <div className='text-xl absolute text-red-600  bottom-0 right-6 h-[30px] w-[30px] text-center'>{card.ap}</div>
                    <div className='text-xl absolute right-0 text-red-600  bottom-0 h-[30px] w-[30px]'>{card.hp}</div>
                </div>
            </div>
        ));
    };

    // Manejamos el drag and drop de las cartas
    const handleDragStart = (e, card) => {
        console.log(card)
        e.dataTransfer.setData("card", JSON.stringify(card));
    };
    
    const handleDrop = (e, zone) => {
        e.preventDefault();
    
        const cardData = JSON.parse(e.dataTransfer.getData("card")); // Obtenemos la carta arrastrada
    
        if (zone === "battle") {
            // Mover carta desde la mano al área de batalla
            setHand((prevHand) => prevHand.filter((card) => card.id_carta !== cardData.id_carta)); // Quitamos la carta de la mano
            setBattleZone((prevZone) => [...prevZone, cardData]); // Añadimos la carta a la zona de batalla
        } else if (zone === "discard") {
            // Mover carta desde la mano al área de descarte
            setHand((prevHand) => prevHand.filter((card) => card.id_carta !== cardData.id_carta)); // Quitamos la carta de la mano
            setDiscardZone((prevZone) => [...prevZone, cardData]); // Añadimos la carta a la zona de descarte
        }
    
        console.log(`Carta ${cardData.nombre} movida a la zona ${zone}`);
    };


    return (
    <main className="relative w-full h-auto">

    {/* Renderizamos el modal */}
        <ConfirmModal
                show={showModal}
                onConfirm={handleConfirm}
                onCancel={handleCancel}
                message={modalMessage}
        />
        <CartaModal 
            show={showModalCarta}
            close={closeModal}
            carta={modalCarta}
        />

        <div className="relative flex flex-col items-center justify-center w-full h-screen gap-0 -top-10 perspective-600 z-1">
        {/* <!-- Zona del rival --> */}
            <div className="zona-rival w-[79%] h-[50%] bg-gradient-to-br from-gray-800 to-gray-600 border border-gray-700 shadow-lg rounded-lg flex justify-center items-center transform rotate-z-[180deg] rotate-x-[12deg]  ">
            <div className="grid h-auto grid-cols-12">
                    <div className="flex flex-col items-center col-span-3 p-4 space-y-4 border border-gray-500">
                        <div className="flex justify-between w-full px-4">
                            <div className="flex flex-col items-center gap-2">
                                <h2 className="text-lg font-bold">Shields</h2>
                                <div className="relative w-24 h-32 border border-gray-500 border-dashed">
                                    <div className="absolute inset-0 z-10 flex items-center justify-center text-3xl text-white ">{/*shieldArea.length*/}</div>
                                    <div>
                                        {/* {shieldArea.length > 0 ? (
                                        <img src="../../../public/imgCards/R-001.webp" alt="Imagen de escudo" 
                                        className='opacity-30'/>
                                        ) : (
                                        null // No muestra nada si shieldArea está vacío
                                        )} */}
                                    </div>
                                </div>
                            </div>
                            <div className="flex flex-col items-center gap-2" >
                                <h2 className="text-lg font-bold">Base</h2>
                                <div className="w-24 h-32 border border-gray-500 border-dashed">
                                    {/* {baseArea.map((card, index) => (
                                        <div
                                            key={`${card.id_carta}-${index}`}
                                            className="card"
                                        >
                                            <img
                                                src={`../../../public/imgCards/${card.id_coleccion}-${card.id_carta}.webp`}
                                                alt={card.nombre}
                                            />
                                        </div>
                                    ))} */}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col items-center col-span-7 p-4 space-y-4 border border-gray-500 ">
                            <h2 className="text-lg font-bold">Battle Area</h2>
                            <div
                                className="grid w-full h-full grid-cols-12 gap-2 border border-gray-500"
                                // onDrop={(e) => handleDrop(e, "battle")}
                                // onDragOver={(e) => e.preventDefault()} // Importante para habilitar el dropeo
                            >
                                {/* {battleZone.map((card, index) => (
                                    <div key={`${card.id_carta}-${index}`} className="card">
                                        <img
                                            src={`../../../public/imgCards/${card.id_coleccion}-${card.id_carta}.webp`}
                                            alt={card.nombre}
                                        />
                                    </div>
                                ))} */}
                            </div>
                        </div>

                        <div className="flex flex-col items-center col-span-2 p-4 space-y-4 border border-gray-500">
                            <h2 className="text-lg font-bold"> Deck Area</h2>
                            <div className="relative w-24 h-32 border border-gray-500 border-dashed">
                                {/* {deck.map((card, index) => (
                                    <div
                                        key={`${card.id_carta}-${index}`}
                                        className="card"
                                    >
                                        <img
                                            src={`../../../public/imgCards/${card.id_coleccion}-${card.id_carta}.webp`}
                                            alt={card.nombre}
                                            className="absolute top-0 left-0 w-full h-full cursor-pointer "
                                        />
                                    </div>
                                ))} */}
                            </div>
                        </div>

                        <div className="flex flex-col items-center col-span-3 p-4 space-y-4 border border-gray-500">
                            <button
                                // onClick={() => handleDrawCard(1)} // Este botón roba 1 carta cuando se hace clic
                                className="px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-700"
                            >
                                Draw
                            </button>
                            <div className="flex flex-col gap-2">
                            <button 
                                //onClick={avanzarFase} 
                                className="px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-700">
                                Avanzar  fase
                            </button>
                            <button 
                                // onClick={ejecutarFase} 
                                className="px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-700">
                                Ejecutar Fase Actual
                            </button>
                            </div>
                        </div>
                        

                        <div className="flex flex-col items-center col-span-7 p-4 space-y-4 border border-gray-500">
                            <h2 className="text-lg font-bold">Resource Area</h2>
                            <div className="grid w-full grid-cols-12 gap-2">
                                    <div className="flex flex-col items-center col-span-2 gap-2">
                                        <h2 className="text-lg font-bold">Resource Deck</h2>
                                        <div className="relative w-24 h-32 border border-gray-500 border-dashed">
                                            <div className="absolute inset-0 z-10 flex items-center justify-center text-3xl">5</div>
                                            {/* {resourceDeck.map((card, index) => (
                                                <div key={`${card.id_carta}-${index}`} className="card">
                                                    <img
                                                        src={`../../../public/imgCards/${card.id_coleccion}-${card.id_carta}.webp`}
                                                        alt={card.nombre}
                                                        className="absolute top-0 left-0 w-full h-full cursor-pointer "
                                                    />
                                                </div>
                                            ))} */}
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-center col-span-10 gap-5 border border-gray-500 " >
                                        {/* {Array.isArray(resourceArea) ? (
                                            resourceArea.map((card, index) => (
                                                <div key={`${card.id_carta}-${index}`} className="card">
                                                    <img
                                                        src={`../../../public/imgCards/${card.id_coleccion}-${card.id_carta}.webp`}
                                                        alt={card.nombre}
                                                        className="left-0 w-24 h-32 cursor-pointer"
                                                    />
                                                </div>
                                            ))
                                        ) : (
                                            <p></p>
                                        )} */}
                                    </div>
                            </div>
                        </div>


                        <div className="flex flex-col items-center col-span-2 p-4 space-y-4 border border-gray-500">
                            <h2 className="text-lg font-bold">Trash</h2>
                            <div className="w-24 h-32 border border-gray-500 border-dashed"></div>
                        </div>
                </div>

            </div>

            {/* <!-- Zona del jugador --> */}
            <div className="relative zona-jugador w-[92%] h-[50%] bg-gradient-to-br from-gray-800 to-gray-600 border border-gray-700 shadow-lg rounded-lg flex justify-center items-center transform rotate-x-[10deg] ">

                <div className="grid w-full h-full grid-cols-12">
                    <div className="flex flex-col items-center col-span-2 p-4 space-y-4 border border-gray-500">
                        <div className="flex justify-between w-full px-4">
                            <div className="flex flex-col items-center gap-2">
                                <h2 className="text-lg font-bold">Shields</h2>
                                <div className="relative w-24 h-32 border border-gray-500 border-dashed">
                                    <div className="absolute inset-0 z-10 flex items-center justify-center text-3xl text-white ">{/*shieldArea.length*/}</div>
                                    <div>
                                        {shieldArea.length > 0 ? (
                                        <img src="../../../public/imgCards/R-001.webp" alt="Imagen de escudo" 
                                        className='opacity-30'/>
                                        ) : (
                                        null // No muestra nada si shieldArea está vacío
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div className="flex flex-col items-center gap-2" >
                                <h2 className="text-lg font-bold">Base</h2>
                                <div className="w-24 h-32 border border-gray-500 border-dashed">
                                    {baseArea.map((card, index) => (
                                        <div
                                            key={`${card.id_carta}-${index}`}
                                            className="card"
                                        >
                                            <img
                                                src={`../../../public/imgCards/${card.id_coleccion}-${card.id_carta}.webp`}
                                                alt={card.nombre}
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col items-center col-span-8 row-span-2 p-4 space-y-4 border border-gray-500 ">
                        <h2 className="w-1/3 text-lg font-bold text-center border border-black">Resource
                            <div className='flex items-center justify-center gap-[3%]'>
                                {renderResource()}
                            </div>
                        </h2>
                        <div
                            className="grid w-full h-full grid-cols-12 gap-2 border border-gray-500"
                            onDrop={(e) => handleDrop(e, "battle")}
                            onDragOver={(e) => e.preventDefault()} // Importante para habilitar el dropeo
                        >
                            {battleZone.map((card, index) => (
                                <div key={`${card.id_carta}-${index}`} className="card">
                                    <img
                                        src={`../../../public/imgCards/${card.id_coleccion}-${card.id_carta}.webp`}
                                        alt={card.nombre}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>

                        <div className="flex flex-col items-center col-span-2 p-4 space-y-4 border border-gray-500">
                            <h2 className="text-lg font-bold"> Deck Area</h2>
                            <div className="relative w-24 h-32 border border-gray-500 border-dashed">
                                {deck.map((card, index) => (
                                    <div
                                        key={`${card.id_carta}-${index}`}
                                        className="card"
                                    >
                                        <img
                                            src={`../../../public/imgCards/${card.id_coleccion}-${card.id_carta}.webp`}
                                            alt={card.nombre}
                                            className="absolute top-0 left-0 w-full h-full cursor-pointer "
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="flex flex-col items-center col-span-2 p-4 space-y-4 border border-gray-500">
                            <button
                                // onClick={() => handleDrawCard(1)} // Este botón roba 1 carta cuando se hace clic
                                className="px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-700"
                            >
                                Draw
                            </button>
                            <div className="flex flex-col gap-2">
                            <button 
                                onClick={avanzarFase} 
                                className="px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-700">
                                Avanzar  fase
                            </button>
                            <button 
                                onClick={ejecutarFase} 
                                className="px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-700">
                                Ejecutar Fase Actual
                            </button>
                            </div>
                        </div>
                        

                        {/* <div className="flex flex-col items-center col-span-8 p-4 space-y-4 border border-gray-500">
                            <h2 className="text-lg font-bold">Resource Area</h2>
                            <div className="grid w-full grid-cols-12 gap-2">
                                    <div className="flex flex-col items-center col-span-2 gap-2">
                                        <h2 className="text-lg font-bold">Resource Deck</h2>
                                        <div className="relative w-24 h-32 border border-gray-500 border-dashed">
                                            <div className="absolute inset-0 z-10 flex items-center justify-center text-3xl">5</div>
                                            {resourceDeck.map((card, index) => (
                                                <div key={`${card.id_carta}-${index}`} className="card">
                                                    <img
                                                        src={`../../../public/imgCards/${card.id_coleccion}-${card.id_carta}.webp`}
                                                        alt={card.nombre}
                                                        className="absolute top-0 left-0 w-full h-full cursor-pointer "
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-center col-span-10 gap-5 border border-gray-500 " >
                                        {Array.isArray(resourceArea) ? (
                                            resourceArea.map((card, index) => (
                                                <div key={`${card.id_carta}-${index}`} className="card">
                                                    <img
                                                        src={`../../../public/imgCards/${card.id_coleccion}-${card.id_carta}.webp`}
                                                        alt={card.nombre}
                                                        className="left-0 w-24 h-32 cursor-pointer"
                                                    />
                                                </div>
                                            ))
                                        ) : (
                                            <p></p>
                                        )}
                                    </div>
                            </div>
                        </div> */}


                        <div className="flex flex-col items-center col-span-2 p-4 space-y-4 border border-gray-500">
                            <h2 className="text-lg font-bold">Trash</h2>
                            <div className="w-24 h-32 border border-gray-500 border-dashed"></div>
                        </div>
                </div>

            </div>
        </div>
        <div className=" bg-opacity-25 absolute left-0 right-0 mx-auto -bottom-0  h-[140px] w-dvw flex items-center justify-center bg-black gap-5">
            {renderHand()}
        </div>
    </main>

    );
};

export default TableroDeJuego;
