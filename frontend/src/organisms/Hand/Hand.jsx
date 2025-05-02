import PropTypes from 'prop-types';

export default function Hand({ hand, onDragStart }) {
    return (
        <div className="bg-opacity-25 absolute left-0 right-0 mx-auto -bottom-0 h-[140px] w-[67%] flex items-center justify-center bg-black gap-5">
            {Array.isArray(hand) && hand.length > 0 ? (
                hand.map((card, index) => (
                    <div key={`${card.id_carta}-${index}`} className="card" draggable>
                        <div className="relative"
                        draggable
                        onDragStart={(e) => onDragStart(e, card)}
                        // onClick={() => abrirModal(card)}
                        >
                            <img
                                src={`../../../public/imgCards/${card.id_coleccion}-${card.id_carta}.webp`}
                                alt={card.nombre}
                                className="w-24 h-32"
                            />
                            <div className="text-xl absolute text-red-600 bottom-0 right-6 h-[30px] w-[30px] text-center">
                                {card.ap}
                            </div>
                            <div className="text-xl absolute right-0 text-red-600 bottom-0 h-[30px] w-[30px]">
                                {card.hp}
                            </div>
                        </div>
                    </div>
                ))
            ) : (
                <p>0 Cartas en mano</p>
            )}
        </div>
    );
}

Hand.propTypes = {
    hand: PropTypes.array.isRequired,
    onDragStart: PropTypes.func.isRequired,
};
