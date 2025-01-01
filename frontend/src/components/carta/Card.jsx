// import React from 'react';
import PropTypes from 'prop-types';

const Card = ({ carta, onAgregar }) => {
    return (
        <div className="p-4 transition border rounded-lg shadow-lg hover:shadow-xl">
            <img src={carta.image_url}  alt="" />
            <h3 className="text-lg font-semibold">{carta.card_name}</h3>
            <p>Tipo: {carta.card_type}</p>
            <p>Color: {carta.color}</p>
            <button
                onClick={() => onAgregar(carta)}
                className="px-4 py-1 mt-2 text-white bg-blue-500 rounded hover:bg-blue-600"
            >
                Agregar al Mazo
            </button>
        </div>
    );
};

Card.propTypes = {
    carta: PropTypes.shape({
        card_name: PropTypes.string.isRequired,
        card_type: PropTypes.string.isRequired,
        color: PropTypes.string.isRequired,
        image_url: PropTypes.string.isRequired,
    }).isRequired,
    onAgregar: PropTypes.func.isRequired,
};

export default Card;
