import BattleArea from './BattleArea';
import { useGame } from '../../context/GameContext';

export default function BattleAreaContainer() {
    const { battleCards, addUnit, requestPilot, myResources, setMyResources, setSelectedCarta, setShowCartaModal,  flipCard, rotated } = useGame();

    const handleDrop = card => {
        if (card.card_type === 'unit') addUnit(card);
        else if (card.card_type === 'pilot') {
        if (!requestPilot(card)) alert('No hay unidades en juego');
        }
    };

    return <BattleArea battleCards={battleCards} onDrop={handleDrop} myResources={myResources} setMyResources={setMyResources} setSelectedCarta={setSelectedCarta} setShowCartaModal={setShowCartaModal} flipCard={flipCard} rotated={rotated}/>;
}
