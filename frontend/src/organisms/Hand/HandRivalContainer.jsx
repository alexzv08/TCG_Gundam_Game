import Hand from './HandRival';
import { useGame } from '../../context/GameContext';


export default function HandRivalContainer() {
    const { handRival } = useGame();

    const handleDragStart = (e, card) => {
        e.dataTransfer.setData('text/plain', JSON.stringify(card));
    };

    return <Hand handRival={handRival} onDragStart={handleDragStart} />;
}
