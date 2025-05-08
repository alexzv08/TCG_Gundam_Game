// src/templates/GameBoard.jsx
import BattleAreaContainer from '../organisms/BattlArea/BattleAreaRivalContainer';
import HandContainer from '../organisms/Hand/HandRivalContainer';
import DeckAreaContainer from '../organisms/DeckArea/DeckAreaRivalContainer';
import TrashAreaRivalContainer from '../organisms/GraveyardZone/GraveyardZoneRivalContainer';
import ShieldAreaRivalContainer from '../organisms/ShieldArea/ShieldAreaRivalContainer';
import AccionesJuegoContainer from '../organisms/AccionesJuego/AccionesJuegoContainer';
export default function GameBoardRival() {
    return (
        <div className="grid w-full h-full grid-cols-12">
            <ShieldAreaRivalContainer/>
            <BattleAreaContainer 
            />
            <DeckAreaContainer />
            <AccionesJuegoContainer />
            <TrashAreaRivalContainer />
            <HandContainer  
                
            />    
        </div>
    );
}