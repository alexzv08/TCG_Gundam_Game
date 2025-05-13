import PropTypes from "prop-types";
import { useState } from "react";

    const MazoActual = ({ mazo, onRemoveFromDeck, onAddToDeck, onRestToDeck, onOpenModalCarta }) => {
    // Validar que mazo sea un array
    const mazoSeguro = Array.isArray(mazo) ? mazo : [];
    // const [mazoSeguro, setMazoSeguro] = useState(Array.isArray(mazo) ? mazo : []);

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
            const response = await fetch(import.meta.env.VITE_BACKEND_URL+'/api/guardar-mazo', {
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
    }

    return (
        <div className="mazo-actual">
            <div className="flex items-center justify-between px-2 mb-2">
                <h2 className="text-xl text-white">Total {mazoSeguro.reduce((total, item) => total + item.cantidad, 0)}</h2>
                <button className="px-1 text-xl text-white border rounded-md">Stats</button>
                <button className="px-1 text-xl text-white border rounded-md">Clear</button>
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
                        className="flex justify-between p-0 m-0 text-white rounded-lg cursor-default"
                    >
                        <div className="relative flex items-center w-full gap-2 group ">
                            <div className="absolute left-[25%] flex justify-center gap-2 opacity-0 group-hover:opacity-100 items-center">
                                <button className="text-center text-black bg-white border-black rounded-full cursor-pointer w-7 h-7"
                                onClick={() => onAddToDeck(item.carta)}>+</button>
                                <div className="text-center text-black bg-white border-black rounded-full cursor-pointer w-7 h-7"
                                onClick={() => onRemoveFromDeck(item.carta)}>-</div>
                                <div className="px-2 text-center text-black bg-white border-black rounded-md cursor-pointer w-15 h-7"
                                onClick={() => onOpenModalCarta(item.carta)}>VIEW</div>
                            </div>
                            <div className={`bg-${item.carta.color}-500 h-10 w-10 text-[10px] group-hover:opacity-55`}>
                                <p>{"Level "+item.carta.level}  </p>
                                <p>{"Cost "+item.carta.cost}    </p>
                            </div> {/* Color de la Carta */}
                            <div className="w-1/2">
                                <h3>{item.carta.card_name}</h3> {/* Nombre de la Carta */}
                                <h4 className="text-sm text-gray-500">{item.carta.id_coleccion + "-" + item.carta.id_carta}</h4> {/* ID de la Carta */}
                            </div>
                            <div className="h-10 bg-white-500 w-14">
                                <div
                                className={`h-full w-full bg-no-repeat bg-[length:175%] bg-[position:40%_15%]`}    
                                style={{
                                    backgroundImage: `url('/imgCards/${item.carta.id_coleccion}-${item.carta.id_carta}.webp')`,
                                }}
                                >
                                </div>
                            </div> {/* Placeholder img de la carta */}
                            <h3 className="px-2">{item.cantidad}</h3>
                        </div>
                        {/* <button
                            onClick={() => {
                                onRemoveFromDeck({
                                    id_coleccion: item.carta.id_coleccion,
                                    id_carta: item.carta.id_carta,
                                });
                            }}
                        >
                            Eliminar
                        </button> */}
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
    onAddToDeck: PropTypes.func,
    onRestToDeck: PropTypes.func,
    onOpenModalCarta: PropTypes.func,
};

export default MazoActual;
