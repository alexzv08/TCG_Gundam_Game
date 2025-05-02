import { useState } from 'react';

import ShieldArea from "../organisms/ShieldArea/ShieldArea";
import DeckArea from "../organisms/DeckArea/DeckArea";
import BattleArea from "../organisms/BattlArea/BattleArea";
import GraveyardArea from "../organisms/GraveyardZone/GraveyardZone"
import Hand from "../organisms/Hand/Hand"
import AccionesJuego from "../organisms/AccionesJuego/AccionesJuego"
import PilotAssignModal from "../organisms/modalPilot/PilotAssingModal";
import PropTypes from "prop-types";

const Tablero = ({ 
    deck,
    setDeck, 
    deckRival, 
    hand, 
    setHand, 
    setShowModalCarta = false, 
    setModalCarta = false,
    emitirBattleAreaActualizada,
    shieldArea,
    setShieldArea,
    baseArea,
    myResources,
    setMyResources,
}) => {

    const [draggedCard, setDraggedCard] = useState(null); // Estado para almacenar la carta arrastrada
    const [battleCards, setBattleCards] = useState([]); // Estado inicial como array vacío --> estructura datos // { unit: cartaUnit1, pilots: [] }
    const [selectedPilot, setSelectedPilot]    = useState(null);


    const handleDragStart = (e,carta) => {
        console.log("Carta arrastrada:", carta);
        setDraggedCard(carta); // Guardamos la carta que se está arrastrando
        e.dataTransfer.setData("text/plain", JSON.stringify(carta));
    };

    const handleDrop = (card) => {
        // Si es unit, lo insertas como antes pero con estructura nueva:
        if (card.card_type === "unit") {
            setBattleCards(prev => {
            const updated = [...prev, { unit: card, pilots: [] }];
            emitirBattleAreaActualizada(updated);
            return updated;
        });
        setHand(h => h.filter(c => c !== card));
        }
        // Si es piloto:
        else if (card.card_type === "pilot") {
            if (battleCards.length === 0) {
            alert("No hay unidades en juego para asignar un piloto.");
            return;
        }
          // Guardas piloto y abres modal para elegir índice de unidad
        setSelectedPilot(card);
        // setShowPilotModal(true);
        }
        // Si es command:
        else if (card.card_type === "command") {
          // aquí tu lógica específica de commands
        }
    };

    // const assignPilotToUnit = (unitIndex) => {
    //     setBattleCards(prev => {
    //         const updated = [...prev];
    //         updated[unitIndex].pilots.push(selectedPilot);
    //         return updated;
    //     });
    //     setHand(h => h.filter(c => c !== selectedPilot));
    //     setSelectedPilot(null);
    //     setShowPilotModal(false);
    //     emitirBattleAreaActualizada(battleCards);
    // };




    return (
        <div className="grid w-full h-full grid-cols-12">
            <ShieldArea shieldArea={shieldArea} baseArea={baseArea}/>
            <BattleArea 
                battleCards={battleCards} 
                onDrop={handleDrop}
                hand={hand} // Pasa la mano actual
                setHand={setHand} // Pasa la función para actualizar la mano
                emitirBattleAreaActualizada={emitirBattleAreaActualizada}
                myResources={myResources}
                setMyResources={setMyResources}
            />
            <DeckArea deck= {deck} deckRival= {deckRival} />
            <AccionesJuego 
                deck= {deck} 
                setDeck = {setDeck}
                hand= {hand} 
                setHand= {setHand}
                shieldArea = {shieldArea}
                setShieldArea= {setShieldArea}
                myResources= {myResources}
                setMyResources= {setMyResources}
            />
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
        setDeck: PropTypes.func,
        hand: PropTypes.array,
        rivalHand: PropTypes.string,
        deckRival: PropTypes.string,
        setHand: PropTypes.func,
        battleArea: PropTypes.array,
        setBattleArea: PropTypes.func,
        setShowModalCarta: PropTypes.bool,
        setModalCarta: PropTypes.array,
        emitirBattleAreaActualizada: PropTypes.func,
        shieldArea: PropTypes.array,
        setShieldArea: PropTypes.func,
        baseArea: PropTypes.array,
        myResources: PropTypes.array,
        setMyResources: PropTypes.func,

    };
    export default Tablero;