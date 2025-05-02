import ShieldArea from "../organisms/ShieldArea/ShieldArea";
import DeckArea from "../organisms/DeckArea/DeckArea";
import BattleArea from "../organisms/BattlArea/BattleArea";
import GraveyardArea from "../organisms/GraveyardZone/GraveyardZone"
import Hand from "../organisms/Hand/Hand"

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