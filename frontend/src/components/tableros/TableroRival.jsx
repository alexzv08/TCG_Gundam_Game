import ShieldArea from "./zonasDeJuego/ShieldArea";
import DeckArea from "./zonasDeJuego/DeckArea";
import BattleArea from "./zonasDeJuego/BattleArea";
import GraveyardArea from "./zonasDeJuego/GraveyardZone"
import Hand from "./zonasDeJuego/Hand"

import PropTypes from "prop-types";


const Tablero = ({ deckRival, rivalHand }) => {
    return (
        <div className="grid w-full h-full grid-cols-12">
            <ShieldArea />
            <BattleArea />
            <DeckArea deckRival= {deckRival} />
            <GraveyardArea />
            <GraveyardArea />
            <Hand  rivalHand= {rivalHand}/>
        </div>
    )
    };
    

    Tablero.propTypes = {
        deck: PropTypes.array,
        deckRival: PropTypes.string,
        rivalHand: PropTypes.string,


    };
    export default Tablero;