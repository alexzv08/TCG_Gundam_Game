import PropTypes from 'prop-types';

// --- Componente GameRow ---
const GameRow = ({ game }) => {
    
    // Determina el color y estilo del estado
    const statusClasses = game.status === 'Waiting' 
        ? 'bg-green-500/20 text-green-300' 
        : 'bg-yellow-500/20 text-yellow-300';

    // Determina si el botón debe estar deshabilitado
    const isJoinDisabled = game.status !== 'Waiting' || game.players >= game.maxPlayers;

    return (
        <div className="grid grid-cols-4 items-center gap-4 p-4 bg-[var(--bg-secondary)] rounded-lg border border-[var(--border-color)] hover:border-[var(--accent-orange)] transition-colors">
            {/* Columna 1: Host */}
            <div className="font-semibold text-[var(--text-primary)] truncate">
                {game.host}
            </div>

            {/* Columna 2: Pilotos (X/Y) */}
            <div className="text-[var(--text-secondary)] font-mono text-center">
                {game.players}/{game.maxPlayers}
            </div>

            {/* Columna 3: Estado (Chip Visual) */}
            <div className="text-center">
                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${statusClasses}`}>
                    {game.status}
                </span>
            </div>

            {/* Columna 4: Botón Join */}
            <div className="text-right">
                <button 
                    disabled={isJoinDisabled} 
                    className="mecha-button py-2 px-4 text-sm"
                >
                    Join
                </button>
            </div>
        </div>
    );
};

// --- Definición de PropTypes ---
GameRow.propTypes = {
    game: PropTypes.shape({
        id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
        host: PropTypes.string.isRequired,
        players: PropTypes.number.isRequired,
        maxPlayers: PropTypes.number.isRequired,
        status: PropTypes.string.isRequired,
        // Puedes añadir más validaciones aquí si es necesario
    }).isRequired,
};

export default GameRow;