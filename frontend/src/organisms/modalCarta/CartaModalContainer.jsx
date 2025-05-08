// src/organisms/modalCarta/CartaModalContainer.jsx
import { useGame } from '../../context/GameContext';
import CartaModal from './CartaModal';

export default function CartaModalContainer() {
    const {
        showCartaModal,
        setShowCartaModal,
        selectedCarta
    } = useGame();

    const handleClose = () => {
        setShowCartaModal(false);
    };

  // Solo renderizar el modal si hay carta
    return (
        <CartaModal
            showCartaModal={showCartaModal && !!selectedCarta}
            close={handleClose}
            selectedCarta={selectedCarta}
        />
    );
}
