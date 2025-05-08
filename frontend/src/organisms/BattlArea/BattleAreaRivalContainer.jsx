import BattleArea from './BattleAreaRival';
import { useGame } from '../../context/GameContext';

export default function BattleAreaRivalContainer() {
    const { battleCardsRival = [], addUnit, requestPilot, rivalResources, setRivalResources } = useGame();

    const handleDrop = card => {
        if (card.card_type === 'unit') addUnit(card);
        else if (card.card_type === 'pilot') {
        if (!requestPilot(card)) alert('No hay unidades en juego');
        }
    };

    return <BattleArea battleCardsRival={battleCardsRival} onDrop={handleDrop} rivalResources={rivalResources} setRivalResources={setRivalResources}/>;
}
