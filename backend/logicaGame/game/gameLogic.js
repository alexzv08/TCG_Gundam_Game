const db = require('../../db/db'); // conexión a la base de datos

const { gameState, drawCard } = require("./gameState");

function initializeGame(players) {
    return initializeGameState(players);
}

function handlePlayerAction(action) {
    const { playerId, type, payload } = action;

    switch (type) {
        case "DRAW_CARD":
            drawCard(playerId);
            break;

        case "PLAY_CARD":
            playCard(playerId, payload.cardId);
            break;

        case "END_TURN":
            endTurn();
            break;

        default:
            console.log(`Acción no reconocida: ${type}`);
    }

    return gameState;
}

function playCard(playerId, cardId) {
    const player = gameState.players[playerId];
    const cardIndex = player.hand.findIndex((card) => card.id === cardId);

    if (cardIndex > -1) {
        const card = player.hand.splice(cardIndex, 1)[0];
        player.field.push(card);
    }
}

function endTurn() {
    const players = Object.keys(gameState.players);
    const currentIndex = players.indexOf(gameState.currentTurn);
    const nextIndex = (currentIndex + 1) % players.length;
    gameState.currentTurn = players[nextIndex];
}

module.exports = { initializeGame, handlePlayerAction };
