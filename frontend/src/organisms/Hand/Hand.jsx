import PropTypes from 'prop-types';
import a from '../../assets/svg/bolt-svgrepo-com.svg';
import b from '../../assets/svg/tash.svg';
import c from '../../assets/svg/magnifying-glass-svgrepo-com.svg';


export default function Hand({ hand, onDragStart, onPlay, sendTrash, setSelectedCarta, setShowCartaModal }) {

    const handleOpen = (carta) => {
        setSelectedCarta(carta);
        setShowCartaModal(true);
    };

    return (
        <div className="bg-opacity-25 absolute left-0 right-0 mx-auto -bottom-0 h-[140px] w-[67%] flex items-center justify-center bg-black gap-2">
            {Array.isArray(hand) && hand.length > 0 ? (
                hand.map((card, index) => (
                    <div key={`${card.id_carta}-${index}`} className="card" draggable>
                        <div className="relative group border-2 border-[#fff0] hover:border-red-500 w-24"
                        draggable
                        onDragStart={(e) => onDragStart(e, card)}
                        // onClick={() => abrirModal(card)}
                        >
                            <div className='absolute w-24 top-[-20px] flex justify-center gap-2 opacity-0 group-hover:opacity-100'>
                                <button className='w-8 h-8 bg-white rounded-xl' onClick={() => onPlay(card)}><img src={a} alt="play" className=''/></button>  {/* Jugar la carta */}
                                <button className='w-8 h-8 bg-white rounded-xl' onClick={() => sendTrash(card)}><img src={b} alt="discart" className=''/></button>  {/* Descartar */}
                                <button className='w-8 h-8 bg-white rounded-xl' onClick={() => handleOpen(card)}><img src={c} alt="show" className=''/></button>  {/* Mostrar en grande */}
                            </div>
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
    onPlay: PropTypes.func.isRequired,
    sendTrash: PropTypes.func.isRequired,
    setSelectedCarta: PropTypes.func,
    setShowCartaModal: PropTypes.func,
    currentPlayer: PropTypes.string,
};
