import ShieldArea from './ShieldArea';
import { useGame } from '../../context/GameContext';
export default function ShieldAreaContainer() {
    const { shields, removeShield, baseArea } = useGame();
    return (
        <ShieldArea
            shields={shields}
            baseArea={baseArea}
            onRemoveShield={removeShield}
        />
    );
}
