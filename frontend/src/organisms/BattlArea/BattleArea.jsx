import PropTypes from 'prop-types';
import flip from '../../assets/svg/flip-forward-svgrepo-com.svg';
import lupa from '../../assets/svg/magnifying-glass-svgrepo-com.svg';
import { useState } from 'react';
export default function BattleArea({ battleCards, onDrop, myResources, setMyResources, setSelectedCarta, setShowCartaModal, flipCard, rotated }) {
    const handleDrop = e => {
        e.preventDefault();
        const card = JSON.parse(e.dataTransfer.getData('text/plain'));
        onDrop(card);
    };
    const toggleResourceActive = (index) => {
        setMyResources(prev =>
            prev.map((res, i) =>
                i === index ? { ...res, active: !res.active } : res
            )
        );
        console.log("Recurso activado/desactivado:", myResources[index]);
    };
    const handleOpen = (carta) => {
        setSelectedCarta(carta);
        setShowCartaModal(true);
    };

    const handleFlip = (index) => {
        flipCard(index);
    };

    return (
        <div 
        className="flex flex-col items-center col-span-8 row-span-2 p-4 space-y-4 border border-gray-500" 
        onDragOver={e=>e.preventDefault()} onDrop={handleDrop}>
            <h2 className="w-1/3 text-lg font-bold text-center border border-black">
                Resource
                <div className='flex flex-wrap justify-center w-full gap-3 mt-2'>
                    {[...myResources]
                        .sort((a, b) => a.ex - b.ex)
                        .map((res, i) => (
                            <div
                                key={i}
                                onClick={() => toggleResourceActive(i)}
                                className={`w-5 h-5 rotate-45 cursor-pointer border ${
                                res.ex ? "bg-yellow-300" : "bg-blue-400"
                                } ${res.active ? "" : "!bg-gray-400"}`}
                                title={res.ex ? "EX" : "Normal"}
                            ></div>
                    ))}
                </div>

            </h2>
            <div className="grid grid-cols-3 m-auto lg:gap-8 lg:grid-cols-6">
                {Array.from({ length: 6 }).map((_, index) => {
                    const card = battleCards[index];
                    return (
                        <div
                            key={index}
                            className="flex flex-wrap mt-8 items-center justify-center w-24 h-32 bg-gray-800 border border-gray-500 border-dashed rounded-md lg:w-[120px] lg:h-[178px] card"
                        >
                            {card ? (
                                <div className="relative w-full h-full border-[#fff0] border-2 group hover:border-red-600">
                                    <div className='absolute w-full top-[-25px] flex justify-center gap-2 opacity-0  group-hover:opacity-100 group-hover:border-red-600'>
                                        <button className='w-6 h-6 bg-white rounded-full' onClick={() => handleFlip(index)}><img src={flip} alt="" /></button>
                                        <button className='w-6 h-6 bg-white rounded-full' onClick={() => handleOpen(card)}><img src={lupa} alt="" /></button>

                                    </div>
                                    <img
                                        src={`/imgCards/${card.id_coleccion}-${card.id_carta}.webp`}
                                        alt={card.card_name}
                                        className={`
                                        object-cover w-full h-full rounded-md
                                        transform transition-transform duration-300
                                        ${rotated[index] ? 'rotate-45 grayscale' : ''}
                                        `}
                                    />
                                </div>
                            ) : (
                                <span className="text-sm text-gray-400">Vacío</span>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

BattleArea.propTypes = {
    battleCards: PropTypes.array.isRequired,
    onDrop: PropTypes.func.isRequired,
    myResources: PropTypes.array,
    setMyResources: PropTypes.func,
    setSelectedCarta: PropTypes.func,
    setShowCartaModal: PropTypes.func,
    flipCard: PropTypes.func,
    rotated: PropTypes.object, 
};
