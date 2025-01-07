import PropTypes from "prop-types";

    const MazoActual = ({ mazo, onRemoveFromDeck }) => {
    // Validar que mazo sea un array
    const mazoSeguro = Array.isArray(mazo) ? mazo : [];
    
    const guardarMazo = async () => {
        const cartas = mazoSeguro.map((item) => ({
            id_juego: item.carta.id_juego,
            id_coleccion: item.carta.id_coleccion,
            id_carta: item.carta.id_carta,
            cantidad: item.cantidad,
        }));
        const totalCartas = mazo.reduce((total, carta) => total + carta.cantidad, 0);
        if (totalCartas < 50) {
            const confirmacion = window.confirm(
                `Tu mazo tiene menos de 50 cartas (${totalCartas} cartas). ¿Estás seguro de que quieres guardarlo?`
            );
    
            // Si el usuario cancela, salir de la función
            if (!confirmacion) {
                return;
            }
        }

        try {
            const token = localStorage.getItem("token")
            const response = await fetch('http://localhost:5000/api/guardar-mazo', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    usuario: localStorage.getItem("user"),
                    nombreMazo: "Mazo Épico",
                    cartas: cartas,
                }),
            });

            const data = await response.json();
            if (response.ok) {
                console.log('Mazo guardado con éxito:', data);
            } else {
                console.error('Error al guardar el mazo:', data);
            }
        } catch (error) {
            console.error('Error en la petición:', error);
        }
    };

    return (
        <div className="mazo-actual">
            <div className="flex items-center justify-between px-2">
                <h2 className="text-xl text-white">Tu Mazo</h2>
                <button className="p-1 px-2 text-xl text-white bg-green-400 rounded-lg "
                    onClick={() => {
                        guardarMazo();
                    }}
                >Save</button>
            </div>
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
