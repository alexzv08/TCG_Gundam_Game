import DeckArea from './DeckAreaRival';
import { useGame } from '../../context/GameContext';


export default function DeckAreaRivalContainer() {
    const { deckRival , drawOneCard } = useGame();
    return <DeckArea deckRival={deckRival} onDraw={drawOneCard} />;
}
