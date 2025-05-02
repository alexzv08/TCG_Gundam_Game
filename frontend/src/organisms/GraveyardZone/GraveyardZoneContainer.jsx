import TrashArea from './GraveyardZone';
import { useGame } from '../../context/GameContext';


export default function TrashAreaContainer() {
    const { trash } = useGame();
    return <TrashArea trash={trash} />;
}
