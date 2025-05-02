import PropTypes from 'prop-types';

export default function DeckArea({ deck = [] }) {
    return (
        <div className="flex flex-col items-center col-span-2 p-4 space-y-4 border border-gray-500">
            <h2 className="text-lg font-bold"> Deck Area</h2>
            <div className="relative w-24 h-32 border border-gray-500 border-dashed">
            {Array.isArray(deck) && deck.length > 0 ? (
                deck.map((card, index) => (
                    <div
                        key={`${card.id_carta}-${index}`}
                        className="card"
                    >
                        <img
                            src={`../../../public/imgCards/${card.id_coleccion}-${card.id_carta}.webp`}
                            alt={card.nombre}
                            className="absolute top-0 left-0 w-full h-full cursor-pointer "
                        />
                    </div>
                ))
            ) : (
                <p>0 cartas en el mazo</p>
            )}
            </div>
        </div>
    );
    }

DeckArea.propTypes = {
    deck: PropTypes.array.isRequired,
};
