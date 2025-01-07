let gameState = {
    players: {}, // Contendrá información de los jugadores
    currentTurn: null, // El jugador que tiene el turno actual
};

// Función para inicializar el estado del juego
function initializeGameState(players) {
    gameState = {
        players: {
            [players[0]]: {
                life: 6,
                deck: generateDeck(), // Genera un mazo aleatorio
                hand: [],
                field: [],
                graveyard: [],
            },
            [players[1]]: {
                life: 6,
                deck: generateDeck(),
                hand: [],
                field: [],
                graveyard: [],
            },
        },
        currentTurn: players[0],
    };

    // Reparte cartas iniciales
    for (const player of players) {
        for (let i = 0; i < 5; i++) {
            drawCard(player);
        }
    }

    return gameState;
}

// Función para robar una carta
function drawCard(playerId) {
    const player = gameState.players[playerId];
    if (player.deck.length > 0) {
        const card = player.deck.shift();
        player.hand.push(card);
    }
}

// Generar un mazo aleatorio (simulado por ahora)
function generateDeck() {
    return Array.from({ length: 30 }, (_, i) => ({ id: i, name: `Card ${i + 1}` }));
}

module.exports = { gameState, initializeGameState, drawCard };
