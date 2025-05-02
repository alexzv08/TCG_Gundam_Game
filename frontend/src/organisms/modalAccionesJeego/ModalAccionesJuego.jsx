import PropTypes from 'prop-types';

const ModalAccionesJuego = ({ show, title, content, actions = [], cartas = [] }) => {
    if (!show) return null; // No renderizamos nada si no está visible
    console.log("cartas", cartas)
    return (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="p-5 text-center bg-white rounded shadow-md w-[85%]">
                {title && <h2 className="mb-3 text-lg font-bold">{title}</h2>}
                {content && <div className="mb-4">{content}</div>}
                <div className="flex flex-wrap justify-center gap-2 mb-4">
                    {cartas.map((carta, index) => (
                        <img key={index} src={`/imgCards/${carta.id_coleccion}-${carta.id_carta}.webp`}  alt={`Carta ${carta.card_name}`} className="h-auto w-[18%]" />
                    ))}
                </div>
                <div className="flex justify-center space-x-2">
                    {actions.map(({ label, onClick, style }, index) => (
                        <button
                        key={index}
                        onClick={onClick}
                        className={`px-4 py-2 rounded ${style || 'bg-gray-500 text-white'}`}
                        >
                            {label}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

ModalAccionesJuego.propTypes = {
    show: PropTypes.bool,
    title: PropTypes.string, // Título opcional
    content: PropTypes.node, // Contenido del modal, puede ser texto o componentes
    actions: PropTypes.arrayOf(
        PropTypes.shape({
            label: PropTypes.string, // Texto del botón
            onClick: PropTypes.func, // Acción del botón
            style: PropTypes.string, // Clases de estilo opcionales
        })
    ),
    cartas: PropTypes.arrayOf(
        PropTypes.shape({
            src: PropTypes.string
        })
    )
};

export default ModalAccionesJuego;
