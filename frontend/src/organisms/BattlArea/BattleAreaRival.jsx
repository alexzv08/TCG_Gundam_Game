import PropTypes from 'prop-types';

export default function BattleAreaRival({ battleCardsRival, onDrop, rivalResources, setRivalResources }) {
    const handleDrop = e => {
        e.preventDefault();
        const card = JSON.parse(e.dataTransfer.getData('text/plain'));
        onDrop(card);
    };
    
    return (
        <div 
        className="flex flex-col items-center col-span-8 row-span-2 p-4 space-y-4 border border-gray-500" 
        onDragOver={e=>e.preventDefault()} onDrop={handleDrop}>
            <h2 className="w-1/3 text-lg font-bold text-center border border-black">
                Resource
                <div className='flex flex-wrap justify-center w-full gap-3 mt-2'>
                    {[...rivalResources]
                        .sort((a, b) => a.ex - b.ex)
                        .map((res, i) => (
                            <div
                                key={i}
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
                    const card = battleCardsRival[index];
                    return (
                        <div
                            key={index}
                            className="flex flex-wrap mt-8 items-center justify-center w-24 h-32 bg-gray-800 border border-gray-500 border-dashed rounded-md lg:w-[120px] lg:h-[178px] card"
                        >
                            {card ? (
                                <div className="relative w-full h-full">
                                <img
                                    src={`/imgCards/${card.id_coleccion}-${card.id_carta}.webp`}
                                    alt={card.card_name}
                                    className="object-cover w-full h-full rounded-md"
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

BattleAreaRival.propTypes = {
    battleCardsRival: PropTypes.array,
    onDrop: PropTypes.func.isRequired,
    rivalResources: PropTypes.array,
    setRivalResources: PropTypes.func,
};
