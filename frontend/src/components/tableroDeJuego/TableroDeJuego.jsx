
import { useEffect, useState } from 'react';
import { io } from "socket.io-client";
import Game from "../../utils/game.js"
const SOCKET_URL  = "http://localhost:5000";

const TableroDeJuego = () => {  
    
    // Fase de la partida
    const [game, setGame] = useState(null);  // Estado para la instancia del juego

    const [deck, setDeck] = useState([]); // Mazo principal
    const [battleZone, setBattleZone] = useState([]); // Zona de batalla
    const [discardZone, setDiscardZone] = useState([]); // Zona de descarte
    const [hand, setHand] = useState([]);
    const [deckInitialized, setDeckInitialized] = useState(false); // Bandera para controlar la inicialización del mazo


    useEffect(() => {
        const socket = io(SOCKET_URL);
    
        socket.on("connect", () => {
    
            // Generar un playerId único para este jugador
            const storedPlayerId = localStorage.getItem("user");
    
            // Emitir el evento 'playerConnected' con el playerId al servidor
            socket.emit("playerConnected", { playerId: storedPlayerId });
        });
    
        socket.on("disconnect", () => {
        });

        const newGame = new Game(); // Creamos una nueva instancia de Game
        setGame(newGame);

        return () => {
            socket.disconnect(); // Asegurarse de cerrar la conexión al desmontar el componente
        };
    }, []);


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



    const initializeDeck = async () => {
        try {
            const response = await fetch("http://localhost:5000/api/recuperarMazo");
            const data = await response.json();

            // Generamos y mezclamos el mazo
            let generatedDeck = buildDeck(data[0]);
            generatedDeck = shuffleDeck(generatedDeck);
            
            await setDeck(generatedDeck); // Guardamos el mazo en el estado

            setDeckInitialized(true);

        } catch (error) {
            console.error("Error al recuperar el mazo:", error);
        }
    };

    //Recuperamos el mazo y lo montamos
    const buildDeck = (cardsData) => {
        const deck = [];
        cardsData.forEach((card) => {
            console.log(card);  // Asegúrate de ver los datos que recibes
            for (let i = 0; i < card.cantidad; i++) {
                deck.push({ ...card });
            }
        });
        console.log(deck);  // Verifica que las cartas estén correctamente construidas
        return deck;
    };
    
    //Se baraja el deck
    const shuffleDeck = (deck) => {
        for (let i = deck.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [deck[i], deck[j]] = [deck[j], deck[i]];
        }
        return deck;
    };
    
    // Fase de draw
    const handleDrawCard = (cantidad) => {
        console.log(`Intentando robar ${cantidad} cartas`);
        // Solo roba si hay suficientes cartas en el mazo
        if (deck.length >= cantidad) {
            const cardsToDraw = deck.slice(0, cantidad);
            const updatedDeck = deck.slice(cantidad);
            setDeck(updatedDeck); // Actualizamos el mazo
            setHand((prevHand) => [...prevHand, ...cardsToDraw]); // Agregamos las cartas robadas a la mano
        } else {
            // Si hay menos cartas que la cantidad solicitada, roba todas las cartas restantes
            setHand((prevHand) => [...prevHand, ...deck]);
            setDeck([]); // El mazo se vacía
        }
    };

    // useEffect para ejecutar handleDrawCard cuando deck se haya actualizado
    useEffect(() => {
        console.log(`Mazo después de robar:`, deck);  // Verifica el mazo cada vez que se actualiza
        if (deck.length > 0) {
            handleDrawCard(5); // Roba 5 cartas cuando el deck ya está cargado
        }
    }, [deckInitialized]);

    const renderHand = () => {
        return hand.map((card, index) => (
            <div key={`${card.id_carta}-${index}`} className="card"
            draggable
            onDragStart={(e) => handleDragStart(e, card)}>
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
        <div className="p-2 m-0 text-white bg-gray-800">
            <div className="grid w-full grid-cols-12 gap-4 py-2 mx-auto">
                <div className="flex flex-col items-center col-span-2 p-4 space-y-4 border border-gray-500">
                    <h2 className="text-lg font-bold">Shield Area</h2>
                    <div className="flex justify-between w-full px-4">
                        <div className="flex flex-col items-center gap-2">
                            <h2 className="text-lg font-bold">Shields</h2>
                            <div className="relative w-24 h-32 border border-gray-500 border-dashed">
                                <div className="absolute inset-0 z-10 flex items-center justify-center text-3xl">5</div>
                            </div>
                        </div>
                        <div className="flex flex-col items-center gap-2" >
                            <h2 className="text-lg font-bold">Base</h2>
                            <div className="w-24 h-32 border border-gray-500 border-dashed"></div>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col items-center col-span-9 p-4 space-y-4 border border-gray-500">
                    <h2 className="text-lg font-bold">Battle Area</h2>
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

                <div className="flex flex-col items-center col-span-1 p-4 space-y-4 border border-gray-500">
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
                        onClick={() => handleDrawCard(1)} // Este botón roba 1 carta cuando se hace clic
                        className="px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-700"
                    >
                        Draw
                    </button>
                    <div>
                    <button onClick={avanzarFase} className="px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-700">
                        Avanzar  fase
                    </button>
                    <button onClick={ejecutarFase} className="px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-700">
                        Ejecutar Fase Actual
                    </button>
                    </div>
                </div>

                <div className="flex flex-col items-center col-span-9 p-4 space-y-4 border border-gray-500">
                    <h2 className="text-lg font-bold">Resource Area</h2>
                    <div className="grid w-full grid-cols-12 gap-2">
                            <div className="flex flex-col items-center col-span-2 gap-2">
                                <h2 className="text-lg font-bold">Resource Deck</h2>
                                <div className="relative w-24 h-32 border border-gray-500 border-dashed">
                                    <div className="absolute inset-0 z-10 flex items-center justify-center text-3xl">5</div>
                                </div>
                            </div>
                            <div className="flex items-center justify-center col-span-10 gap-5 border border-gray-500 " >
                                <div className="w-24 h-32 border border-gray-500 border-dashed"></div>
                            </div>
                    </div>
                </div>

                <div className="flex flex-col items-center col-span-1 p-4 space-y-4 border border-gray-500">
                    <h2 className="text-lg font-bold">Trash</h2>
                    <div className="w-24 h-32 border border-gray-500 border-dashed"></div>
                </div></div>
        </div>
        <div className="absolute left-0 right-0 mx-auto -bottom-20  h-[140px] w-screen border border-gray-500 flex items-center justify-center bg-gray-100 gap-5">
            {renderHand()}
        </div>
</main>

    );
};

export default TableroDeJuego;
