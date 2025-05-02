import Hand from './Hand';
import { useGame } from '../../context/GameContext';


export default function HandContainer() {
    const { hand } = useGame();

    const handleDragStart = (e, card) => {
        e.dataTransfer.setData('text/plain', JSON.stringify(card));
    };

    return <Hand hand={hand} onDragStart={handleDragStart} />;
}
