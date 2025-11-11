import { io } from 'socket.io-client';
import { useNavigate } from 'react-router-dom';

import { useState } from 'react';
import Sidebar from "../organisms/sidebar/Sidebar copy";
const MachMaking = () => {

    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [selectedDeckId, setSelectedDeckId] = useState('1');


    const socket = io();

    // Escucha el evento 'connect'
    socket.on('connect', function() {
    // El ID está disponible en la instancia del socket
    console.log('Tu ID de socket:', socket.id);
    });
    
    const handleQuickMatch = async () => {
        if (isLoading) return; // Prevenir doble clic

        setIsLoading(true);
        const endpoint = '/api/machmaking/quick_match'; // Asume el endpoint de tu Node.js
        
        try {
            // 1. Petición al Backend
            const response = await fetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                // Envía el deck seleccionado, MMR, etc.
                body: JSON.stringify({ 
                    deckId: selectedDeckId,
                    mmr: 1000, // Ejemplo de MMR o valor de ranking
                    id: socket.id
                })
            });
            
            if (!response.ok) {
                // Manejo de errores de HTTP (ej: 404, 500)
                const errorData = await response.json();
                // throw new Error(errorData.message || `Fallo en la búsqueda: ${response.status}`);
            }
            
            const data = await response.json();
            const matchId = data.matchId; // El backend debe devolver el ID de la partida
            
            if (matchId) {
                // 2. Redirigir a la pantalla de juego/lobby
                // El componente GameScreen debe usar este ID para conectarse vía WebSocket.
                navigate(`/game/${matchId}`); 
            } else {
                // Caso si el backend responde OK pero no encuentra matchId (ej: entra a la cola)
                alert('Entraste a la cola de espera. Esperando oponente...');
            }

        } catch (error) {
            // console.error('Error al buscar partida:', error);
            // alert(`Error: ${error.message}`);
        } finally {
            setIsLoading(false);
        }
    };



    // Función de cambio de deck (si usas el select)
    const handleDeckChange = (e) => {
        setSelectedDeckId(e.target.value);
    };
return (
    <div className="flex p-0">
    {/* Componente del filtro */}
        <Sidebar></Sidebar>
        <div className="flex flex-col flex-1 gap-4 w-[80%] ml-10 mt-10">
            <div className="flex flex-col flex-1 gap-4">
                <div className="flex flex-col gap-4">
                    <h1 className="uppercase border-b-2 border-[var(--accent-orange)] pb-2 text-white font-bold text-3xl w-fit">find battle</h1>
                    <div className="flex flex-col items-center gap-3 my-5 border-2 border-[var(--accent-orange)] py-5 rounded-lg mx-auto">
                        <h1 className="text-xl text-white uppercase ">ready for deployment?</h1>
                        <h2 className="text-gray-400">Engage in combat and prove your strategic prowess!</h2>
                        <button className="h-16 text-white bg-[var(--accent-orange)] w-40 text-xl uppercase text-bold"
                        onClick={handleQuickMatch}
                        disabled={isLoading || !selectedDeckId}
                        >
                            Find macth
                        </button>
                        <select name="" id="" className="w-60"
                        onChange={handleDeckChange}>
                            <option value="1">Deck XXXXX</option>
                        </select>
                    </div>
                </div>
            </div>


            {/* TABLA DE PARTIDAS */}
            <div className="flex flex-col flex-1 gap-4">
                <h1 className="uppercase border-b-2 border-[var(--accent-orange)] pb-2 text-white font-bold text-3xl w-fit">actives lobbies</h1>
                <div className="w-full mx-auto"> 
                    <div className="max-w-4xl mx-auto grid grid-cols-4 items-center gap-4 px-4 py-2 text-sm font-bold text-[var(--text-secondary)] uppercase tracking-wider">
                        <div>Host</div>
                        <div className="text-center">Pilots</div>
                        <div className="text-center">Status</div>
                        <div></div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    );
};

export default MachMaking;