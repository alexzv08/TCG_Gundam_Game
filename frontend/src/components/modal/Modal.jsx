
const ConfirmModal = ({ show, onConfirm, onCancel, message }) => {
    if (!show) return null; // Si show es false, no renderizamos nada

    return (
        <div className="absolute inset-0 top-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="p-5 bg-white rounded shadow-md">
                <p>{message}</p>
                <div className="flex justify-end mt-4">
                    <button
                        onClick={onConfirm}
                        className="px-4 py-2 mr-2 text-white bg-blue-500 rounded"
                    >
                        Confirmar
                    </button>
                    <button
                        onClick={onCancel}
                        className="px-4 py-2 text-white bg-gray-500 rounded"
                    >
                        Cancelar
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmModal;
