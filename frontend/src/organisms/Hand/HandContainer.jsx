import Hand from './Hand';
import { useGame } from '../../context/GameContext';
import { onPlay, sendTrash } from '../../utils/funcionesGame';

export default function HandContainer() {
    const { hand,
        battleCards,
        setHand,
        setBattleCards,
        currentPlayer,
        roomId,
        playerId,
        trash,
        setTrash,
        myResources,
        setMyResources,
        setSelectedCarta, 
        setShowCartaModal } = useGame();

    const handleDragStart = (e, card) => {
        e.dataTransfer.setData('text/plain', JSON.stringify(card));
    };
    const handlePlay = card => {
        console.log("ID de la carta:", currentPlayer);
        onPlay(
            card,
            hand,
            setHand,
            battleCards,
            setBattleCards,
            currentPlayer,
            setMyResources,
            myResources
        );
    };
    const handleTrash = card => {
        console.log("ID de la carta enviada a la basura:", card.id_carta);
        sendTrash(
            card,
            hand,
            setHand,
            trash,
            setTrash,
            roomId,
            playerId
        );
    }

    return <Hand hand={hand} onPlay={handlePlay} sendTrash={handleTrash} onDragStart={handleDragStart} setSelectedCarta={setSelectedCarta} setShowCartaModal={setShowCartaModal} myResources={myResources} setMyResources={setMyResources} />;
}
