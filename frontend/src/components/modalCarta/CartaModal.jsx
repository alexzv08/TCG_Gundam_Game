import PropTypes from 'prop-types';

const CartaModal = ({ show, close, carta }) => {
    console.log(show)
    if (!show) return null;
    
    return (
        <div className="absolute inset-0 top-0 flex items-center justify-center bg-black bg-opacity-50 z-[9999]">
            <div className="flex flex-col items-center">
                <h2 className="mb-2 text-2xl font-bold text-white">{carta.card_name}</h2>
                <img
                    src={`../../../public/imgCards/${carta.id_coleccion}-${carta.id_carta}.webp`}
                    alt={carta.card_name}
                    className="w-3/4 mb-4 rounded-lg"
                />
            </div>
            <button
                className="absolute flex items-center rounded-full justify-center text-[40px] text-gray-800 bg-red-700 w-12 h-12 top-2 right-2 hover:text-gray-800 leading-none"
                onClick={close}
            >
                <div className='absolute top-0.5'>
                &times;
                </div>
            </button>
        </div>
    );
};

CartaModal.propTypes = {
    show: PropTypes.bool.isRequired,
    close: PropTypes.func,
    carta: PropTypes.shape({
        id_carta: PropTypes.string,
        id_coleccion: PropTypes.string,
        card_name: PropTypes.string,
        ap: PropTypes.string,
        hp: PropTypes.string,
    }),
};

export default CartaModal;
