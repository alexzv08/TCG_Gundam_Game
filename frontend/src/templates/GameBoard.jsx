// src/templates/GameBoard.jsx
import BattleAreaContainer from '../organisms/BattlArea/BattleAreaContainer';
import HandContainer from '../organisms/Hand/HandContainer';
import DeckAreaContainer from '../organisms/DeckArea/DeckAreaContainer';
import TrashAreaContainer from '../organisms/GraveyardZone/GraveyardZoneContainer';
import ShieldAreaContainer from '../organisms/ShieldArea/ShieldAreaContainer';
import AccionesJuegoContainer from '../organisms/AccionesJuego/AccionesJuegoContainer';
export default function GameBoard() {
    return (
        <div className="grid w-full h-full grid-cols-12">
            <ShieldAreaContainer/>
            <BattleAreaContainer 
                
            />
            <DeckAreaContainer />
            <AccionesJuegoContainer />
            <TrashAreaContainer />
            <HandContainer  
                
            />    
        </div>
    );
}

