// src/componentes/mazoActual/MazoActual.jsx
import PropTypes from "prop-types";

const MazoActual = ({ mazo, onRemoveFromDeck }) => {

    return (
        <div className="mazo-actual">
            <h2>Tu Mazo</h2>
            {mazo.map((item) => (
                <div key={`${item.carta.id_coleccion}-${item.carta.id_carta}`} className="flex justify-between p-2 m-2 text-white bg-blue-500 rounded-lg">
                    <div className="flex gap-2">
                        <h3>{item.carta.card_name}</h3>
                        <h3>{": x" + item.cantidad}</h3>
                    </div>
                    <button onClick={() => onRemoveFromDeck(item.id)}>Eliminar</button>
                </div>
            ))}
        </div>
    );
};

MazoActual.propTypes = {
    mazo: PropTypes.array.isRequired,
    onRemoveFromDeck: PropTypes.func.isRequired,
};

export default MazoActual;
