import ConfirmModal from './Modal';
import { useGameLogic } from '../../hooks/useGameLogic';

export default function ModalContainer() {
    const { showConfirm, confirmConfig, handleConfirm } = useGameLogic();
    return (
        <ConfirmModal
            show={showConfirm}
            title={confirmConfig.title}
            content={confirmConfig.content}
            actions={[
                { label: 'Sí', onClick: () => handleConfirm(true), style: 'btn-green' },
                { label: 'No', onClick: () => handleConfirm(false), style: 'btn-red' },
            ]}
            isLoading={confirmConfig.isLoading}
        />
    );
}
