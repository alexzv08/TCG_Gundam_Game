import PropTypes from "prop-types";
import { addResource, removeExResource, addResourceEx, drawCard } from '../../utils/funcionesGame';
const AccionesJuego = ({deck, setDeck, hand, setHand,shield, setShieldArea, myResources, setMyResources, endTurn, handRef}) =>{

    const handleAddResourceEX = () => {
        addResourceEx(setMyResources); // Llama a la función para agregar un recurso
    }
    const handleRemoveResourceEX = () => {
        removeExResource(setMyResources); // Llama a la función para agregar un recurso
    }
    const handleDrawCard = () => {
        drawCard(deck, setDeck, setHand, 1, handRef); // Llama a la función para agregar un recurso
    }
    const handleEndTurn = () => {
        endTurn();
    }
    return (
        <div className="grid items-center grid-cols-2 col-span-2 p-4 space-y-4 border border-gray-500">
            <button className="col-span-2 border-2 rounded-md bg-slate-300" onClick={handleEndTurn}>End Turn</button>
            <button className="border-2 rounded-md bg-slate-300">+1 Shield</button>
            <button className="border-2 rounded-md bg-slate-300">-1 Shield</button>
            <button className="border-2 rounded-md bg-slate-300" onClick={handleAddResourceEX}>+1 Resource</button>
            <button className="border-2 rounded-md bg-slate-300" onClick={handleRemoveResourceEX}>-1 Resource</button>
            <button className="border-2 rounded-md bg-slate-300" onClick={handleDrawCard}>+1 Draw</button>
            <button className="border-2 rounded-md bg-slate-300">-1 Draw</button>

        </div>
    )
    };

    AccionesJuego.propTypes = {
        deck: PropTypes.array,
        setDeck: PropTypes.func,
        hand: PropTypes.array,
        setHand: PropTypes.func,
        shield: PropTypes.array,
        setShieldArea: PropTypes.func,
        myResources: PropTypes.array,
        setMyResources: PropTypes.func,
        endTurn: PropTypes.func,
        handRef: PropTypes.object,
    };
    export default AccionesJuego;