import PropTypes from "prop-types";
import { addResource } from "../../../utils/funcionesGame";
const AccionesJuego = ({deck, setDeck, hand, setHand,shield, setShieldArea, myResources, setMyResources}) =>{

    const handleAddResource = () => {
        addResource(setMyResources); // Llama a la función para agregar un recurso
    }

    return (
        <div className="grid items-center grid-cols-2 col-span-2 p-4 space-y-4 border border-gray-500">
            <button className="col-span-2 border-2 rounded-md bg-slate-300">End Turn</button>
            <button className="border-2 rounded-md bg-slate-300">+1 Shield</button>
            <button className="border-2 rounded-md bg-slate-300">-1 Shield</button>
            <button className="border-2 rounded-md bg-slate-300" onClick={handleAddResource}>+1 Resource</button>
            <button className="border-2 rounded-md bg-slate-300">-1 Resource</button>
            <button className="border-2 rounded-md bg-slate-300">+1 Draw</button>
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

    };
    export default AccionesJuego;