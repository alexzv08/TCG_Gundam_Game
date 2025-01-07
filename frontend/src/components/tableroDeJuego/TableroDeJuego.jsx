
import { useEffect, useState } from "react";
import { io } from "socket.io-client";
const SOCKET_URL  = "http://localhost:5000";

const TableroDeJuego = () => {

        const [playerId,setPlayerId] = useState("");
        const [deck, setDeck] = useState([]);


    useEffect(() => {
        const socket = io(SOCKET_URL);
    
        socket.on("connect", () => {
    
            // Generar un playerId único para este jugador
            const storedPlayerId = localStorage.getItem("user");
            setPlayerId(storedPlayerId);
    
            // Emitir el evento 'playerConnected' con el playerId al servidor
            socket.emit("playerConnected", { playerId: storedPlayerId });
        });
    
        socket.on("disconnect", () => {
        });
    
        // Peticion del mazo
        const fetchDeck = async () => {
            try {
                const response = await fetch(`http://localhost:5000/api/recuperarMazo`,{
                    headers: {
                        user: localStorage.getItem("user"),
                        mazoId : "13"
                    }
                });
                const data = await response.json();
                setDeck(data[0]); // Guardamos el mazo en el estado
            } catch (error) {
                console.error("Error al obtener el mazo:", error);
            }
        };

        fetchDeck()
        return () => {
            socket.disconnect(); // Asegurarse de cerrar la conexión al desmontar el componente
        };
    }, [playerId]);
    
    // Manejamos el drag and drop de las cartas
    const handleDragStart = (e, card) => {
        e.dataTransfer.setData("card", JSON.stringify(card));
    };
    
    const handleDrop = (e, zone) => {
        // Prevenimos el comportamiento predeterminado (para permitir el drop)
        e.preventDefault();
        
        // Obtener los datos de la carta arrastrada
        const cardData = JSON.parse(e.dataTransfer.getData("card"));
        
        // Lógica para mover la carta a la zona correspondiente
        // En este caso, vamos a actualizar el estado de las cartas para reflejar el cambio de zona
        
        // Dependiendo de la zona, tenemos que actualizar los datos en el estado de las cartas
        setDeck((prevDeck) => {
            return prevDeck.map((card) => {
            if (card.id_carta === cardData.id_carta) {
                // Aquí deberías actualizar el campo que guarda la zona en la que está la carta
                // Supongamos que la carta tiene un campo `zona` para saber dónde está
                return {
                ...card,
                zona: zone, // Actualizamos la zona de la carta
                };
            }
            return card;
            });
        });
        
        // También podrías realizar más acciones dependiendo de la zona a la que se haya movido la carta
        console.log(`La carta ${cardData.nombre} ha sido movida a la zona ${zone}`);
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
                    <div className="grid w-full grid-cols-3 gap-2" onDrop={(e) => handleDrop(e, "battle")}>
                        
                    </div>
                </div>

                <div className="flex flex-col items-center col-span-1 p-4 space-y-4 border border-gray-500">
                    <h2 className="text-lg font-bold"> Deck Area</h2>
                    <div className="w-24 h-32 border border-gray-500 border-dashed">
                        {deck.map((card, index) => (
                        // Aquí usamos un ciclo para mostrar tantas instancias de la carta como su cantidad
                            [...Array(card.cantidad)].map((_, i) => (
                                <div
                                key={`${card.id_carta}-${i}`} // Asegúrate de tener una clave única
                                className="relative flex flex-col items-center justify-between"
                                draggable
                                onDragStart={(e) => handleDragStart(e, card)}
                                >
                                <img src={`../../../public/imgCards/${card.id_coleccion}-${card.id_carta}.webp`} alt={card.nombre} className="absolute object-cover w-24 h-32"/>
                                </div>
                            ))
                        ))}
                    </div>
                </div>

                <div className="flex flex-col items-center col-span-2 p-4 space-y-4 border border-gray-500">
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
                                <div className="w-24 h-32 rotate-45 border border-gray-500 border-dashed">resource rotate</div>
                                <div className="w-24 h-32 border border-gray-500 border-dashed"></div>
                                <div className="w-24 h-32 border border-gray-500 border-dashed"></div>
                                <div className="w-24 h-32 border border-gray-500 border-dashed"></div>
                                <div className="w-24 h-32 border border-gray-500 border-dashed"></div>
                                <div className="w-24 h-32 border border-gray-500 border-dashed"></div>
                                <div className="w-24 h-32 border border-gray-500 border-dashed"></div>
                                <div className="w-24 h-32 border border-gray-500 border-dashed"></div>
                                <div className="w-24 h-32 border border-gray-500 border-dashed"></div>
                                <div className="w-24 h-32 border border-gray-500 border-dashed"></div>
                                <div className="w-24 h-32 border border-gray-500 border-dashed"></div>
                            </div>
                    </div>
                </div>

                <div className="flex flex-col items-center col-span-1 p-4 space-y-4 border border-gray-500">
                    <h2 className="text-lg font-bold">Trash</h2>
                    <div className="w-24 h-32 border border-gray-500 border-dashed"></div>
                </div></div>
        </div>
        <div className="absolute left-0 right-0 mx-auto -bottom-20  h-[140px] w-screen border border-gray-500 flex items-center justify-center bg-gray-100 opacity-20 gap-5">
                                <div className="w-24 h-32 border border-black border-dashed"></div>
                                <div className="w-24 h-32 border border-black border-dashed"></div>
                                <div className="w-24 h-32 border border-black border-dashed"></div>
                                <div className="w-24 h-32 border border-black border-dashed"></div>
                                <div className="w-24 h-32 border border-black border-dashed"></div>
                                <div className="w-24 h-32 border border-black border-dashed"></div>
                                <div className="w-24 h-32 border border-black border-dashed"></div>
                                <div className="w-24 h-32 border border-black border-dashed"></div>
                                <div className="w-24 h-32 border border-black border-dashed"></div>
                                <div className="w-24 h-32 border border-black border-dashed"></div>
        </div>
</main>

    );
};

export default TableroDeJuego;
