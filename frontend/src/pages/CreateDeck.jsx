import { useState, useEffect } from 'react';
// import FiltroCartas from '../components/filtroCartas/FiltroCartas';  // Importamos el componente FiltroCartas
import { obtenerCartas } from "../utils/cartasUtils.js";
import { 
    checkMaxCartas, 
    checkMaxCopias, 
    checkMaxColores 
} from "../utils/deckRules.js";
import Sidebar from '../organisms/sidebar/Sidebar.jsx';
import SideBar2 from '../organisms/sidebar/Sidebar copy.jsx';
import FiltroCartas from '../organisms/filtroCartas/FiltroCartas.jsx';
import ListadoCartas from '../organisms/listadoCartas/ListadoCartas.jsx';
import MazoActual from '../organisms/mazoActual/MazoActual.jsx';
import CartaModal from '../organisms/modalCarta/CartaModal.jsx';

const CreateDeck = () => {

    // Estado para almacenar las cartas
    const [cartas, setCartas] = useState([]);
    const [mazo, setMazo] = useState([]); // Estado para el mazo actual


    const [cartasFiltradas, setCartasFiltradas] = useState(cartas); 
    const types = ['Unit', 'Pilot', 'Command', 'Base','Token']; // Tipos posibles
    const colors = ['Red', 'Blue', 'Green', 'White']; // Colores posibles

    const [showModalCarta, setShowModalCarta] = useState(false);
    const [modalCarta, setModalCarta] = useState(null)

    // useEffect para cargar las cartas desde el backend
    useEffect(() => {
        // Llamamos a la función de obtener cartas
        obtenerCartas().then((data) => {
            console.log("Cartas obtenidas:", data);
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
            alert(`No puedes añadir mas de 2 colores en el mazo.`);
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
    const handleRemoveFromDeck = ({ id_coleccion, id_carta }) => {
        
        setMazo((prevMazo) => {
            const nuevoMazo = prevMazo
                .map((item) => {
                    if (item.carta.id_coleccion === id_coleccion && item.carta.id_carta === id_carta) {
                        return { ...item, cantidad: item.cantidad - 1 };
                    }
                    return item;
                })
                .filter((item) => item.cantidad > 0);
    
            return nuevoMazo;
        });
    };
    
    

    // Función para filtrar las cartas
    const applyFilters = (filters) => {
        const cartasFiltradas = cartas.filter((carta) => {
            // console.log("Carta:", carta);
    
            // Si un campo es null o vacío, la carta no se muestra
            if (!carta.card_name || !carta.card_type || !carta.color) {
                return false;
            }
    
            if (filters.name && !carta.card_name.toLowerCase().includes(filters.name.toLowerCase())) {
                return false;
            }
            if (filters.type && !carta.card_type.toLowerCase().includes(filters.type.toLowerCase())) {
                return false;
            }
            if (filters.color && !carta.color.toLowerCase().includes(filters.color.toLowerCase())) {
                return false;
            }
            if (filters.hp && (!carta.hp || carta.hp < Number(filters.hp))) {
                return false;
            }
            if (filters.ap && (!carta.ap || carta.ap < Number(filters.ap))) {
                return false;
            }
            if (filters.level && (!carta.level || carta.level < Number(filters.level))) {
                return false;
            }
            if (filters.cost && (!carta.cost || carta.cost < Number(filters.cost))) {
                return false;
            }
    
            return true;
        });
    
        setCartasFiltradas(cartasFiltradas);
    };
    

    // Función para abrir el modal de la carta
    const abrirModal = (carta) => {
        console.log("Carta seleccionada:", carta);
        setModalCarta(carta); // Pasamos el objeto de la carta seleccionada
        setShowModalCarta(true); // Mostramos el modal
    };

    const closeModalCarta = () => {
        setModalCarta(null); // Limpiamos la carta seleccionada
        setShowModalCarta(false); // Cerramos el modal
    };
    return (
        <div className="h-screen p-0 overflow-hidden">
            <CartaModal 
                        show={showModalCarta}
                        close={closeModalCarta}
                        carta={modalCarta}
                    />
            <div>
                <main className='flex p-0 m-0 border-red-50'>
                    {/* <Sidebar /> */}
                    <SideBar2 />
                <div className="w-screen h-screen p-5 pl-10 overflow-hidden">
                    <div className="flex flex-col mt-4">
                        <FiltroCartas cartas={cartas} onFilter={applyFilters} types={types} colors={colors} />
                        <div className='grid grid-cols-4 gap-4'>
                            <div className='h-[calc(100dvh-2%)] overflow-y-auto pb-14 pr-2 pt-2 col-span-3'>
                                <ListadoCartas cartas={cartasFiltradas} onAddToDeck={handleAddToDeck} onRestToDeck={handleRemoveFromDeck} onOpenModalCarta={abrirModal} />
                            </div>
                            <div className='h-[calc(100dvh-2%)] overflow-y-auto pb-14 pr-2 pt-2'>
                                <MazoActual mazo={mazo} onRemoveFromDeck={handleRemoveFromDeck} onAddToDeck={handleAddToDeck} onRestToDeck={handleRemoveFromDeck} onOpenModalCarta={abrirModal}/>
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
