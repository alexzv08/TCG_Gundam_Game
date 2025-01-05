// src/componentes/mazoActual/MazoActual.jsx
import PropTypes from "prop-types";

const MazoActual = ({ mazo, onRemoveFromDeck }) => {
    // Validar que mazo sea un array
    const mazoSeguro = Array.isArray(mazo) ? mazo : [];

    return (
        <div className="mazo-actual">
            <h2 className="text-xl text-white">Tu Mazo</h2>
            {mazoSeguro.length > 0 ? (
                mazoSeguro.map((item) => (
                    <div
                        key={`${item.carta.id_coleccion}-${item.carta.id_carta}`}
                        className="flex justify-between p-2 m-2 text-white bg-blue-500 rounded-lg"
                    >
                        <div className="flex gap-2">
                            <h3>{item.carta.card_name}</h3>
                            <h3>{": x" + item.cantidad}</h3>
                        </div>
                        <button
                            onClick={() => {
                                onRemoveFromDeck({
                                    id_coleccion: item.carta.id_coleccion,
                                    id_carta: item.carta.id_carta,
                                });
                            }}
                        >
                            Eliminar
                        </button>
                    </div>
                ))
            ) : (
                <p></p>
            )}
        </div>
    );
};

MazoActual.propTypes = {
    mazo: PropTypes.oneOfType([PropTypes.array, PropTypes.object]).isRequired,
    onRemoveFromDeck: PropTypes.func.isRequired,
};

export default MazoActual;
