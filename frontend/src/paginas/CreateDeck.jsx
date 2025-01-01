import { useState, useEffect } from 'react';
// import FiltroCartas from '../components/filtroCartas/FiltroCartas';  // Importamos el componente FiltroCartas
import Card from '../components/carta/Card';  // Componente para mostrar cada carta individualmente
import { obtenerCartas } from "../utils/cartasUtils";
import Sidebar from '../components/sidebar/Sidebar';

const CreateDeck = () => {

    // Estado para almacenar las cartas
    const [cartas, setCartas] = useState([]);
    const [mazo, setMazo] = useState([]); // Estado para el mazo actual

    // Estado para las cartas filtradas
    const [cartasFiltradas, setCartasFiltradas] = useState([]);

    // useEffect para cargar las cartas desde el backend
    useEffect(() => {
        // Llamamos a la función de obtener cartas
        obtenerCartas().then((data) => {
            setCartas(data); // Guardamos las cartas en el estado
            setCartasFiltradas(data); // Inicialmente mostramos todas las cartas
        });
    }, []); 

    // Función para agregar una carta al mazo
    const agregarCarta = (carta) => {
        
        if (carta.card_type === 'exbase-token' || carta.card_type === 'resource') {
            console.log('Carta excluida:', carta);
            return;
        }

        console.log('Agregando carta:', carta);
        setMazo((prevMazo) => {

            // Calcula la cantidad total de cartas en el mazo
            const totalCartas = prevMazo.reduce((sum, entry) => sum + entry.cantidad, 0);

            // Verifica si se puede agregar más cartas al mazo
            if (totalCartas >= 50) {
                console.log('No se pueden agregar más de 50 cartas al mazo');
                return prevMazo;
            }

            // Busca si la carta ya está en el mazo
            const cartaExistente = prevMazo.find((entry) => 
                entry.id_coleccion === carta.id_coleccion && entry.id_carta === carta.id_carta
            );

            if (cartaExistente) {
                // Si la carta ya está en el mazo, incrementa la cantidad
                return prevMazo.map((entry) => {
                    if (entry.id_coleccion === carta.id_coleccion && entry.id_carta === carta.id_carta) {
                        if (entry.cantidad < 4) {
                            return { ...entry, cantidad: entry.cantidad + 1 };
                        } else {
                            return entry;
                        }
                    } else {
                        return entry;
                    }
                });
            } else {
                // Si la carta no está en el mazo, agrégala con cantidad 1
                return [...prevMazo, { ...carta, cantidad: 1 }];
            }
        });
    }
    
    // Función para guardar el mazo
    const guardarMazo = async () => {
        const nombreMazo = "Mi Mazo"; // Puedes usar un estado para que el usuario defina el nombre
        const usuario = "user"; // Cambiar por el usuario real que inició sesión
    
        if (mazo.length === 0) {
            alert("El mazo está vacío.");
            return;
        }
    
        try {
            const response = await fetch("http://localhost:5000/api/guardar-mazo", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    nombreMazo,
                    usuario,
                    cartas: mazo,
                }),
            });
    
            const data = await response.json();
    
            if (response.ok) {
                alert("Mazo guardado correctamente.");
            } else {
                console.error(data.message);
                alert("Error al guardar el mazo: " + data.message);
            }
        } catch (error) {
            console.error("Error al realizar la solicitud:", error);
            alert("Error al guardar el mazo.");
        }
    };

    // Función para eliminar una carta del mazo
    const eliminarCarta = (carta) => {
        console.log('Eliminando carta:', carta);
        setMazo(mazo.filter((item) => item.id_carta !== carta.id_carta));
    }

    return (
        <div className="h-screen p-0 overflow-hidden">
            <div>
                <main className='flex p-0 m-0 border-red-50'>
                    <Sidebar />
                <div className="w-screen h-screen p-5 pl-10 overflow-auto">
                    <h2 className="mt-6 text-xl font-semibold">Cartas Disponibles</h2>
                    <div className="grid gap-4 mt-4">
                        {/* Mostrar las cartas filtradas */}
                        <div className="grid grid-cols-5 gap-4 mt-4">
                            {cartasFiltradas.map(carta => (
                                <Card key={`${carta.id_coleccion}_${carta.id_carta}`} carta={carta} onAgregar={agregarCarta}/> // Aquí se usa el componente Carta para mostrar cada carta
                            ))}
                        </div>
                    </div>
                    <div className="mt-8">
                        <h2 className="text-xl font-bold">Mazo Actual</h2>
                        <button
                            onClick={guardarMazo}
                            className="px-4 py-2 mt-4 text-white bg-green-500 rounded hover:bg-green-700"
                        >
                            Guardar Mazo
                        </button>
                        <ul>
                            {mazo.map((carta, index) => (
                                <li key={index} className="py-1">
                                    {/* Accede a las propiedades de la carta */}
                                    {carta.card_name} - {carta.color} - Nivel: {carta.level}
                                    <p>Cantidad: {carta.cantidad}</p>
                                    {/* Botón para eliminar carta */}
                                    <button 
                                        onClick={() => eliminarCarta(carta)}
                                        className="ml-4 text-red-500 hover:text-red-700"
                                    >
                                        Eliminar
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>       
                </div>
                </main>
            </div>
        
        
        </div>
    );
};

export default CreateDeck;
