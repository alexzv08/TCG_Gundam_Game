import PropTypes from 'prop-types';

export default function Modal({ show, title, content , actions , isLoading  }) {
    if (!show) return null;
    return (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="p-5 text-center bg-white rounded shadow-md">
            {isLoading ? (
                    <div className="flex flex-col items-center w-full mx-auto">
                    <div className="w-8 h-8 border-4 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
                    <span className="mt-2 whitespace-pre-line" >{title}</span>
                </div>
                ) : (
                <>
                {title && <h2 className="mb-3 text-lg font-bold">{title}</h2>}
                {content && <div className="mb-4">{content}</div>}
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
                </>
                )}
            </div>
        </div>
    );
}

Modal.propTypes = {
    show: PropTypes.bool,
    title: PropTypes.string,
    content:   PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.arrayOf(PropTypes.string)
    ]),
    actions: PropTypes.arrayOf(
        PropTypes.shape({
        label: PropTypes.string,
        onClick: PropTypes.func,
        style: PropTypes.string,
    })
    ),
    isLoading: PropTypes.bool,
};