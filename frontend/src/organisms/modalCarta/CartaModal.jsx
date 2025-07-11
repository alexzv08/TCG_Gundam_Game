// src/organisms/modalCarta/CartaModal.jsx

import PropTypes from 'prop-types';

const CartaModal = ({ showCartaModal, setShowCartaModal, close, selectedCarta }) => {
    if (!showCartaModal || !selectedCarta) return null;  // <-- protección adicional
    const handleClose = () => {
        setShowCartaModal(false);
    };
    return (
        <div className="absolute inset-0 top-0 flex items-center justify-center bg-black bg-opacity-50 z-[9999]"
            onClick={handleClose}
        >
        <div className="flex flex-col items-center">
            <h2 className="mb-2 text-2xl font-bold text-white">{selectedCarta.card_name}</h2>
            <img
            src={`/imgCards/${selectedCarta.id_coleccion}-${selectedCarta.id_carta}.webp`}
            alt={selectedCarta.card_name}
            className="w-3/4 mb-4 rounded-lg"
            />
        </div>
        <button
            className="absolute flex items-center rounded-full justify-center text-[40px] text-gray-800 bg-red-700 w-12 h-12 top-2 right-2 hover:text-gray-800 leading-none"
            onClick={handleClose}
        >
            ×
        </button>
        </div>
    );
};

CartaModal.propTypes = {
    showCartaModal: PropTypes.bool,
    close: PropTypes.func,
    setShowCartaModal: PropTypes.func,
    selectedCarta: PropTypes.shape({
        id_carta:    PropTypes.string,
        id_coleccion:PropTypes.string,
        card_name:   PropTypes.string,
        ap:          PropTypes.string,
        hp:          PropTypes.string,
    }),
};

export default CartaModal;
