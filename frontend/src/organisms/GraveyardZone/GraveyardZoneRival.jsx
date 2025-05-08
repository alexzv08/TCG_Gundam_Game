import PropTypes from 'prop-types';

export default function GraveyardZoneRival({ trashRival }) {
    return (
        <div className="flex flex-col items-center col-span-2 p-4 space-y-4 border border-gray-500">
            <h2 className="text-lg font-bold">Trash: {trashRival.length}</h2>
            <div className="w-24 h-32 border border-gray-500 border-dashed">
                {Array.isArray(trashRival) && trashRival.length > 0 ? (
                    trashRival.map((card, index) => (
                        <div
                            key={`${card.id_carta}-${index}`}
                            className="absolute w-24 h-32"
                        >
                            <img
                                src={`../../../public/imgCards/${card.id_coleccion}-${card.id_carta}.webp`}
                                alt={card.nombre}
                                className="absolute w-24 h-32 cursor-pointer "
                            />
                        </div>
                    ))
                ) : (
                    <p></p>
                )}
            </div>
        </div>
    );
}

GraveyardZoneRival.propTypes = {
    trashRival: PropTypes.array.isRequired,
};
