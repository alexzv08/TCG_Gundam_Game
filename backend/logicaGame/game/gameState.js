// const phases = [
//     "start_phase", "active_step", "start_step",
//     "draw_phase", "resource_phase", "main_phase",
//     "attack_step", "block_step", "action_step_battle",
//     "damage_step", "battle_end_step",
//     "end_phase", "action_step_end", "end_step", "hand_step", "cleanup_step"
// ];
function nextPhase(gameState) {
    gameState.currentPhaseIndex = (gameState.currentPhaseIndex + 1) % gameState.phases.length;
    if (gameState.currentPhaseIndex === 0) {
        // Cambiar de jugador al final del turno
        gameState.currentPlayer = gameState.currentPlayer === gameState.players.player1 ? gameState.players.player2 : gameState.players.player1;
    }
    return gameState.phases[gameState.currentPhaseIndex];
}

function handlePhase(phase, gameState) {
    switch (phase) {
        case "Start":
            handleStartPhase(gameState);
            break;
        case "Draw":
            handleDrawPhase(gameState);
            break;
        case "Resource":
            handleResourcePhase(gameState);
            break;
        case "Main":
            handleMainPhase(gameState);
            break;
        case "End":
            handleEndPhase(gameState);
            break;
        default:
            console.log("Unknown phase");
    }
}

function handleStartPhase(gameState) {
    // Activar todas las cartas en estado "rested"
    // Activar efectos de "Start Step"
    console.log("Start Phase");
}

function handleDrawPhase(gameState) {
    // El jugador activo roba una carta
    console.log("Draw Phase");
}

function handleResourcePhase(gameState) {
    // El jugador activo coloca una carta de recurso
    console.log("Resource Phase");
}

function handleMainPhase(gameState) {
    // El jugador activo puede jugar cartas, activar efectos, atacar, etc.
    console.log("Main Phase");
}

function handleEndPhase(gameState) {
    // Action Step, End Step, Hand Step, Cleanup Step
    console.log("End Phase");
}

module.exports = { handlePhase, nextPhase };
