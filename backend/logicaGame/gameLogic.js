const db = require('./db'); // conexión a la base de datos

// Estructura inicial de la partida
const initializeGame = (player1_id, player2_id) => {
    // Inicializa la partida con los jugadores
    return {
        player1_id,
        player2_id,
        player1_life: 6, // Cada jugador empieza con 20 puntos de vida
        player2_life: 6,
        player1_hand: [], // Cartas que tiene en mano el jugador 1
        player2_hand: [],
        player1_deck: [], // Mazo de cartas del jugador 1
        player2_deck: [], // Mazo de cartas del jugador 2
        current_turn: player1_id, // El jugador 1 comienza
        game_status: 'waiting', // El estado de la partida (en waiting, en progres, ended)
    };
};