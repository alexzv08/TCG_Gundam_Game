import PropTypes from 'prop-types';

export default function DeckAreaRival({ deckRival = [] }) {
    return (
        <div className="flex flex-col items-center col-span-2 p-4 space-y-4 border border-gray-500">
            <h2 className="text-lg font-bold"> Deck AreaR</h2>
            <div className="relative w-24 h-32 border border-gray-500 border-dashed">
            {Array.isArray(deckRival) && deckRival.length > 0 ? (
                
                    <div
                        className=" card"
                    >
                        <div className="absolute inset-0 z-10 flex items-center justify-center text-3xl rotate-180">{deckRival.length}</div>
                        <img
                            src={`../../../public/imgCards/EXB-001.webp`}
                            alt={"dorso carta"}
                            className="absolute top-0 left-0 w-full h-full cursor-pointer "
                        />
                    </div>
            ) : (
                <p>0 cartas en el mazo</p>
            )}
            </div>
        </div>
    );
    }

DeckAreaRival.propTypes = {
    deckRival: PropTypes.array,
};