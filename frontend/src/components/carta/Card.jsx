// import React from 'react';
import PropTypes from 'prop-types';

const Card = ({ carta, onAddToDeck, onRestToDeck, onOpenModalCarta }) => {
    return (
        <div className="relative transition shadow-lg hover:shadow-xl">
            <img src={`/imgCards/${carta.id_coleccion}-${carta.id_carta}.webp`} alt={carta.card_name} 
            onClick={() => onOpenModalCarta(carta)}/>
            <div className='absolute z-10 flex flex-col justify-between gap-5 top-5 right-3'>
                <button
                    onClick={() => onAddToDeck(carta)}
                    className="w-[30px] h-[30px] text-black bg-white border border-black rounded-full hover:bg-blue-600"
                    >
                    +
                </button>
                <button
                    onClick={() => onRestToDeck(carta)}
                    className="w-[30px] h-[30px] text-black bg-white border border-black rounded-full hover:bg-blue-600"
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
    onRestToDeck: PropTypes.func,
    onOpenModalCarta: PropTypes.func,

};

export default Card;
