import DeckArea from './DeckArea';
import { useGame } from '../../context/GameContext';


export default function DeckAreaContainer() {
    const { deck = [], drawOneCard } = useGame();
    return <DeckArea deck={deck} onDraw={drawOneCard} />;
}
