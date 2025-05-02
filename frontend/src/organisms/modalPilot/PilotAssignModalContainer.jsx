import PilotAssignModal from './PilotAssingModal';
import { useGameLogic } from '../../hooks/useGameLogic';

export default function PilotAssignModalContainer() {
    const { showPilotModal, battleCards, assignPilot, setShowPilotModal } = useGameLogic();
    return (
    <PilotAssignModal
        show={showPilotModal}
        units={battleCards}
        onAssign={assignPilot}
        onClose={() => setShowPilotModal(false)}
    />
    );
}
