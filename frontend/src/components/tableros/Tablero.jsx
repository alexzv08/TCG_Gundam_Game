import { useState } from 'react';

import ShieldArea from "./zonasDeJuego/ShieldArea";
import DeckArea from "./zonasDeJuego/DeckArea";
import BattleArea from "./zonasDeJuego/BattleArea";
import GraveyardArea from "./zonasDeJuego/GraveyardZone"
import Hand from "./zonasDeJuego/Hand"
import PropTypes from "prop-types";



const Tablero = ({ deck, 
    deckRival, 
    hand, 
    setHand, 
    setShowModalCarta = false, 
    setModalCarta = false,
    emitirBattleAreaActualizada
}) => {

    const [draggedCard, setDraggedCard] = useState(null); // Estado para almacenar la carta arrastrada
    const [battleCards, setBattleCards] = useState([]); // Estado inicial como array vacío

    const handleDragStart = (e,carta) => {
        console.log("Carta arrastrada:", carta);
        setDraggedCard(carta); // Guardamos la carta que se está arrastrando
        e.dataTransfer.setData("text/plain", JSON.stringify(carta));
    };

    const handleDrop = (card) => {
        console.log("Carta soltada:", card);
        if (card) {
            setBattleCards((prevCards) => {
                const updatedCards = [...prevCards, draggedCard]; // Agregar la carta nueva
                // Emitir la actualización después de actualizar el estado
                emitirBattleAreaActualizada(updatedCards);
                return updatedCards; // Devolver el nuevo estado
            });
            setHand((prevHand) => prevHand.filter((carta) => carta !== draggedCard));
        }
    };


    return (
        <div className="grid w-full h-full grid-cols-12">
            <ShieldArea />
            <BattleArea 
                battleCards={battleCards} 
                onDrop={handleDrop}
                hand={hand} // Pasa la mano actual
                setHand={setHand} // Pasa la función para actualizar la mano
                emitirBattleAreaActualizada={emitirBattleAreaActualizada}
            />
            <DeckArea deck= {deck} deckRival= {deckRival} />
            <GraveyardArea />
            <GraveyardArea />
            <Hand  
                hand= {hand}
                setShowModalCarta={setShowModalCarta}
                setModalCarta={setModalCarta}
                onDragStart={(e, card) => handleDragStart(e, card)}
            />    
        </div>
    )
    };
    

    Tablero.propTypes = {
        deck: PropTypes.array,
        hand: PropTypes.array,
        rivalHand: PropTypes.string,
        deckRival: PropTypes.string,
        setHand: PropTypes.func,
        battleArea: PropTypes.array,
        setBattleArea: PropTypes.func,
        setShowModalCarta: PropTypes.bool,
        setModalCarta: PropTypes.array,
        emitirBattleAreaActualizada: PropTypes.func

    };
    export default Tablero;