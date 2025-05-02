import ModalAccionesJuego from './ModalAccionesJuego';
import { useModalAcciones } from '../../context/ModalAccionesContext';

export default function ModalAccionesJuegoContainer() {
    const {
        show,
        title,
        content,
        actions,
        cartas,
        closeModal,
    } = useModalAcciones();

    return (
        <ModalAccionesJuego
            show={show}
            title={title}
            content={content}
            actions={actions}
            cartas={cartas}
            onClose={closeModal}
        />
    );
}
