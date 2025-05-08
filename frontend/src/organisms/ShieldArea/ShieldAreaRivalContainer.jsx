import ShieldArea from './ShieldAreaRival';
import { useGame } from '../../context/GameContext';
export default function ShieldAreaContainer() {
    const { shieldsRival, baseAreaRival } = useGame();
    return (
        <ShieldArea
            shieldsRival={shieldsRival}
            baseAreaRival={baseAreaRival}
        />
    );
}
