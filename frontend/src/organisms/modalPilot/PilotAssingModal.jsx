import PropTypes from 'prop-types';

export default function PilotAssignModal({ show, units, onAssign, onClose }) {
    if (!show) return null;
    return (
        <div className="modal-backdrop">
            <div className="modal">
            <h2>Selecciona unidad para piloto</h2>
            <ul>
                {units.map((slot, i) => (
                <li key={i} onClick={() => onAssign(i)}>
                    <img src={`/imgCards/${slot.unit.id_coleccion}-${slot.unit.id_carta}.webp`} alt="" />
                </li>
                ))}
            </ul>
            <button onClick={onClose}>Cancelar</button>
            </div>
        </div>
    );
}

PilotAssignModal.propTypes = {
    show: PropTypes.bool.isRequired,
    units: PropTypes.arrayOf(
        PropTypes.shape({
            unit: PropTypes.object.isRequired,
            pilots: PropTypes.array.isRequired,
        })
    ).isRequired,
    onAssign: PropTypes.func.isRequired,
    onClose: PropTypes.func.isRequired,
};