// import React from 'react';
import PropTypes from 'prop-types';

const Card = ({ carta, onAddToDeck, onRestToDeck }) => {
    return (
        <div className="relative transition shadow-lg hover:shadow-xl">
            <img src={`../../../public/imgCards/${carta.id_coleccion}-${carta.id_carta}.webp`} alt={carta.card_name} />
            <div className='absolute bottom-2 z-10 flex justify-between w-[80%] gap-10 transform -translate-x-1/2  h-[20%] left-1/2'>
                <button
                    onClick={() => onAddToDeck(carta)}
                    className="w-[50px] h-[50px] text-white bg-blue-500 rounded hover:bg-blue-600"
                    >
                    +
                </button>
                <button
                    onClick={() => onRestToDeck(carta)}
                    className="w-[50px] h-[50px] text-white bg-blue-500 rounded hover:bg-blue-600"
                    >
                    -
                </button>
            </div>
        </div>
    );
};

Card.propTypes = {
    carta: PropTypes.shape({
        card_name: PropTypes.string.isRequired,
        card_type: PropTypes.string,
        color: PropTypes.string.isRequired,
        image_url: PropTypes.string.isRequired,
        id_coleccion: PropTypes.string.isRequired,
        id_carta: PropTypes.string.isRequired,
    }).isRequired,
    onAddToDeck: PropTypes.func,
    onRestToDeck: PropTypes.func

};

export default Card;
