import PropTypes from "prop-types";
import Carta from "../carta/Card";

const ListadoCartas = ({ cartas, onAddToDeck, onRestToDeck, onOpenModalCarta }) => {


    return (
        <div className="grid grid-cols-5 gap-4 mt-2 listado-cartas">
            {cartas.length > 0 ? (
                cartas.map((carta) => (
                    <Carta key={`${carta.id_coleccion}-${carta.id_carta}`} carta={carta} onAddToDeck={onAddToDeck} onRestToDeck={onRestToDeck} onOpenModalCarta={onOpenModalCarta}/>
                ))
            ) : (
                <p>No hay cartas disponibles</p>
            )}
        </div>
    );
};

ListadoCartas.propTypes = {
    cartas: PropTypes.array.isRequired,
    onAddToDeck: PropTypes.func,
    onRestToDeck: PropTypes.func,
    onOpenModalCarta: PropTypes.func,
};

export default ListadoCartas;