import { useState, useEffect } from 'react';
// import FiltroCartas from '../components/filtroCartas/FiltroCartas';  // Importamos el componente FiltroCartas
import { obtenerCartas } from "../utils/cartasUtils";
import { 
    checkMaxCartas, 
    checkMaxCopias, 
    checkMaxColores 
} from "../utils/deckRules";
import Sidebar from '../components/sidebar/Sidebar';
import FiltroCartas from '../components/filtroCartas/FiltroCartas';
import ListadoCartas from '../components/listadoCartas/ListadoCartas';
import MazoActual from '../components/mazoActual/MazoActual';

const CreateDeck = () => {

    // Estado para almacenar las cartas
    const [cartas, setCartas] = useState([]);
    const [mazo, setMazo] = useState([]); // Estado para el mazo actual
    const [filteredCards, setFilteredCards] = useState(cartas);
    const types = ['Unit', 'Pilot', 'Command', 'Base','Token']; // Tipos posibles
    const colors = ['Red', 'Blue', 'Green', 'White']; // Colores posibles
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

    // Manejar la adición de cartas al mazo
    const handleAddToDeck = (carta) => {

        if (!checkMaxCartas(mazo)) {
            alert("No puedes añadir más cartas. El mazo ya tiene 40 cartas.");
            return;
        }

        if (!checkMaxColores(mazo, carta)) {
            alert(`No puedes añadir más cartas de color ${carta.color}.`);
            return;
        }
        
        if (!checkMaxCopias(mazo, carta)) {
            alert("No puedes añadir más de 4 copias de la misma carta.");
            return;
        }
        
        const cartaExistente = mazo.find((item) => 
            item.carta.id_coleccion === carta.id_coleccion && item.carta.id_carta === carta.id_carta);

        if (cartaExistente) {
            // Si la carta ya está en el mazo, solo incrementamos la cantidad
            setMazo(mazo.map((item) =>
                item.carta.id_coleccion === carta.id_coleccion && item.carta.id_carta === carta.id_carta
                    ? { ...item, cantidad: item.cantidad + 1 } // Solo aumentamos la cantidad
                    : item
            ));
        } else {
            // Si la carta no está en el mazo, la añadimos con cantidad 1
            setMazo([...mazo, { carta, cantidad: 1 }]);
        }
    };

    // Manejar la eliminación de cartas del mazo
    const handleRemoveFromDeck = (carta) => {
        setMazo(
            mazo
                .map((item) =>
                    item.carta.id_coleccion === carta.id_coleccion && item.carta.id_carta === carta.id_carta
                        ? { ...item, cantidad: item.cantidad - 1 }
                        : item
                )
                .filter((item) => item.cantidad > 0) // Eliminar cartas con cantidad 0
        );
    };

    // Función para filtrar las cartas
    const applyFilters = (filters) => {
        const filtered = cartas.filter((card) => {
            return (
            (card.name || "").toLowerCase().includes((filters.name || "").toLowerCase()) &&
            (filters.type === '' || card.type === filters.type) &&
            (filters.color === '' || card.color === filters.color) &&
            (filters.hp === '' || card.hp === parseInt(filters.hp)) &&
            (filters.ap === '' || card.ap === parseInt(filters.ap)) &&
            (filters.level === '' || card.level === parseInt(filters.level)) &&
            (filters.cost === '' || card.cost === parseInt(filters.cost))
            );
        });

        setFilteredCards(filtered);
    };

    return (
        <div className="h-screen p-0 overflow-hidden">
            <div>
                <main className='flex p-0 m-0 border-red-50'>
                    <Sidebar />
                <div className="w-screen h-screen p-5 pl-10 overflow-hidden">
                    <div className="flex flex-col mt-4">
                        <FiltroCartas cartas={cartas} setCartasFiltradas={setCartasFiltradas} onFilter={applyFilters} types={types} colors={colors} />
                        <div className='grid grid-cols-2 gap-4'>
                            <div className='h-[calc(100dvh-3%)] overflow-y-auto pb-14 pr-2 pt-2'>
                                <ListadoCartas cartas={cartas} onAddToDeck={handleAddToDeck} onRestToDeck={handleRemoveFromDeck} />
                            </div>
                            <div className='h-[calc(100dvh-3%)] overflow-y-auto pb-14 pr-2 pt-2'>
                                <MazoActual mazo={mazo} onRemoveFromDeck={setMazo} />
                            </div>
                        </div>
                    </div> 
                </div>
                </main>
            </div>
        
        
        </div>
    );
};

export default CreateDeck;
