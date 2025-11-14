import { useState, useEffect } from "react";
import { obtenerPartidas, obtenerMisDecks, handleQuickMatch } from "../utils/gamesApi.jsx";
import Sidebar from "../organisms/sidebar/Sidebar copy";
import GameRow from "../organisms/GameRow/GameRow";
import { useGame } from '../context/GameContext';


const MachMaking = () => {

    const [activeGames, setActiveGames] = useState([]);
    const [myDecks, setMyDecks] = useState([]);
    const [selectedDeckId, setSelectedDeckId] = useState('');

    useEffect(() => {
        // Llamamos a la función de obtener cartas
        obtenerPartidas().then((data) => {
            setActiveGames(data);
            console.log(data);
        });
        // Llamamos a la función de obtener mis decks
        obtenerMisDecks(localStorage.getItem("user")).then((data) => {
            setMyDecks(data);
            console.log(data);
        });
    }, []);

    // MANEJAR EL CAMBIO DEL DECK
    const handleDeckChange = (event) => {
        setSelectedDeckId(event.target.value);
    };

    // FUNCION PARA BUSCAR PARTIDA
    function handleQuickMatchButon() {
        if (!selectedDeckId) {
            alert("Please select a deck before finding a match.");
            return;
        }
        console.log("Buscando partida rápida...");
        // Realizo la peticion al back para buscar sala o crear una nueva        
        handleQuickMatch(localStorage.getItem("user"),selectedDeckId);
    }


return (
    <div className="flex p-0">
    {/* Componente del filtro */}
        <Sidebar></Sidebar>
        <div className="flex flex-col flex-1 gap-4 w-[80%] mx-10 mt-10">
            <div className="flex flex-col flex-1 gap-4">
                <div className="flex flex-col gap-4">
                    <h1 className="uppercase border-b-2 border-[var(--accent-orange)] pb-2 text-white font-bold text-3xl w-fit">find battle</h1>
                    <div className="flex flex-col items-center gap-3 my-5 border-2 border-[var(--accent-orange)] py-5 rounded-lg mx-auto">
                        <h1 className="text-xl text-white uppercase ">ready for deployment?</h1>
                        <h2 className="text-gray-400">Engage in combat and prove your strategic prowess!</h2>
                        <button className="h-16 text-white bg-[var(--accent-orange)] w-40 text-xl uppercase text-bold"
                            onClick={handleQuickMatchButon}
                        >
                            Find macth
                        </button>
                        <select name="" id="" className="w-60"
                        value={selectedDeckId}
                        onChange={handleDeckChange}>
                            <option key="none" value="" disabled>Select your deck</option>
                            {myDecks.map((deck) => (
                                <option key={deck.id_mazo} value={deck.id_mazo}>{deck.nombre_mazo}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>


            {/* TABLA DE PARTIDAS */}
            <div className="flex flex-col flex-1 gap-4">
                <h1 className="uppercase border-b-2 border-[var(--accent-orange)] pb-2 text-white font-bold text-3xl w-fit">actives lobbies</h1>
                <div className="w-full mx-auto"> 
                    <div className="max-w-8xl grid grid-cols-4 items-center gap-20 py-2 text-sm font-bold text-[var(--text-secondary)] uppercase tracking-wider">
                        <div className="text-center">Room Name</div>
                        <div className="text-center">Players</div>
                        <div className="text-center">Status</div>
                        <div className="text-center">Join</div>
                    </div>
                    <div className="flex flex-col gap-2 mt-2">
                        {activeGames.map(game => (
                            <GameRow key={game.id} game={game} />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    </div>
    );
};

export default MachMaking;