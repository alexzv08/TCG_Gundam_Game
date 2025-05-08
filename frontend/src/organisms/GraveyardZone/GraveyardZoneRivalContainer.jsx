import TrashArea from './GraveyardZoneRival';
import { useGame } from '../../context/GameContext';


export default function TrashAreaContainer() {
    const { trashRival } = useGame();
    return <TrashArea trashRival={trashRival} />;
}
