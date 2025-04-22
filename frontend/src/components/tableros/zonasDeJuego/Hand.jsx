import PropTypes from 'prop-types';

const Hand = ({ hand, rivalHand, setShowModalCarta, setModalCarta, onDragStart   }) => {


    const abrirModal = (carta) => {
        console.log("Carta seleccionada:", carta);
        setModalCarta(carta); // Pasamos el objeto de la carta seleccionada
        setShowModalCarta(true); // Mostramos el modal
    };

    return (
        <div className="bg-opacity-25 absolute left-0 right-0 mx-auto -bottom-0 h-[140px] w-[67%] flex items-center justify-center bg-black gap-5">
            {Array.isArray(hand) && hand.length > 0 ? (
                hand.map((card, index) => (
                    <div key={`${card.id_carta}-${index}`} className="card" draggable>
                        <div className="relative"
                        draggable
                        onDragStart={(e) => onDragStart(e, card)}
                        onClick={() => abrirModal(card)}>
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
            ) : rivalHand ? (
                <div className="relative">
                    <p className="absolute inset-0 z-10 flex items-center justify-center text-[50px] rotate-180 text-black-500">
                        {rivalHand}
                    </p>
                </div>
            ) : (
                <p>No cards in deck</p>
            )}
        </div>
    );
};

Hand.propTypes = {
    hand: PropTypes.array,
    rivalHand: PropTypes.string,
    setShowModalCarta: PropTypes.bool, 
    setModalCarta: PropTypes.array,
    onDragStart: PropTypes.func
};

export default Hand;
