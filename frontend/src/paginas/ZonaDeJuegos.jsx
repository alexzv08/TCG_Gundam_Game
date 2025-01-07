import TableroDeJuego from '../components/tableroDeJuego/TableroDeJuego';  // Importamos el componente FiltroCartas';

const ZonaDeJuegos = () => {

return (
    <div className="flex-col h-screen p-0">
    {/* Componente del filtro */}
        <TableroDeJuego />
    </div>
    );
};

export default ZonaDeJuegos;