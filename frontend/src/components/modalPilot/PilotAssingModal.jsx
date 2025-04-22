import PropTypes from 'prop-types';

const PilotAssignModal = ({ show, units, onAssign, onClose, pilotCard }) =>{
    if (!show) return null;
    return (
        <div className="modal-backdrop">
            <div className="modal">
                <h2>Elige unidad para el piloto</h2>
                <ul>
                {units.map((slot, i) => (
                    <li key={i}>
                        <img
                        src={`/imgCards/${slot.unit.id_coleccion}-${slot.unit.id_carta}.webp`}
                        alt={slot.unit.nombre}
                        onClick={() => onAssign(i)}
                        />
                    </li>
                ))}
                </ul>
                <button onClick={onClose}>Cancelar</button>
            </div>
        </div>
    );
}

PilotAssignModal.propTypes = {
    show: PropTypes.bool,
    units: PropTypes.array, // Título opcional
    onAssign: PropTypes.func, // Contenido del modal, puede ser texto o componentes
    onClose: PropTypes.func, // Acción del botón
    pilotCard: PropTypes.object, // Acción del botón
};


export default PilotAssignModal;