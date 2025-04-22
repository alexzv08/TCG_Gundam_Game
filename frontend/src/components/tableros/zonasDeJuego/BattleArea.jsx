import { useState } from 'react';
import PropTypes from 'prop-types';
import boltIcon from '../../../assets/svg/bolt-svgrepo-com.svg'; // Asegúrate de que la ruta sea correcta
const BattleArea = ({ battleCards = [], onDrop, myResources = [], setMyResources }) => {
    
    const [rotations, setRotations] = useState({});

    const handleDragOver = (e) => {
        e.preventDefault(); // Permitir el evento drop
    };

    const handleDrop = (e) => {
        e.preventDefault();
        const cardData = e.dataTransfer.getData("text/plain"); // Recuperar los datos de la carta
        const card = JSON.parse(cardData); // Convertir de string a objeto        
        if (card) {
            onDrop(card); // Llamar a la función `onDrop` con la carta
        }

    };

    const rotateCard = (index) => {
        setRotations(prev => ({
            ...prev,
            [index]: (prev[index] || 0) === 0 ? 30 : 0
        }));
    };

    const toggleResourceActive = (index) => {
        setMyResources(prev =>
            prev.map((res, i) =>
                i === index ? { ...res, active: !res.active } : res
            )
        );
        console.log("Recurso activado/desactivado:", myResources[index]);
    };
    return (
        <div
            className="flex flex-col items-center col-span-8 row-span-2 p-4 space-y-4 border border-gray-500"
            onDragOver={handleDragOver}
            onDrop={handleDrop}
        >
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
                        // Si hay una carta, mostrarla
                        <div className='relative w-full h-full'>
                            <div className='absolute w-24 lg:w-[120px] h-auto top-[-25px] flex justify-center gap-3'>
                                <button className='w-5 h-5 bg-white' onClick={() => rotateCard(index)}><img className='w-full h-full' src={boltIcon} alt="" /></button>
                                <button className='w-5 h-5 bg-white'><img className='w-full h-full' src={boltIcon} alt="" /></button>
                                <button className='w-5 h-5 bg-white'><img className='w-full h-full' src={boltIcon} alt="" /></button>
                            </div>
                            <img
                            src={`/imgCards/${card["unit"].id_coleccion}-${card["unit"].id_carta}.webp`}
                            alt={card.nombre}
                            className={`object-cover w-full h-full rounded-md transition-transform duration-300 ${
                                (rotations[index] || 0) === 30 ? "grayscale" : ""
                            }`}
                            style={{ transform: `rotate(${rotations[index] || 0}deg)` }}
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
};

BattleArea.propTypes = {
    battleCards: PropTypes.array,
    onDrop: PropTypes.func,
    myResources: PropTypes.array, // Añadido para el recurso
    setMyResources: PropTypes.func, // Añadido para el recurso
};

export default BattleArea;
