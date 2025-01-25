import PropTypes from 'prop-types';

const BattleArea = ({ battleCards = [], onDrop }) => {
    

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

    return (
        <div
            className="flex flex-col items-center col-span-8 row-span-2 p-4 space-y-4 border border-gray-500"
            onDragOver={handleDragOver}
            onDrop={handleDrop}
        >
            <h2 className="w-1/3 text-lg font-bold text-center border border-black">
                Resource
            </h2>
                <div className="grid grid-cols-6 gap-[3%]">
                    {battleCards.map((card, index) => (
                        <div key={`${card.id_carta}-${index}`} className="card">
                            <img
                                src={`../../../public/imgCards/${card.id_coleccion}-${card.id_carta}.webp`}
                                alt={card.nombre}
                                className="w-24 h-32"
                            />
                        </div>
                    ))}
                </div>
        </div>
    );
};

BattleArea.propTypes = {
    battleCards: PropTypes.array,
    onDrop: PropTypes.func,
};

export default BattleArea;
