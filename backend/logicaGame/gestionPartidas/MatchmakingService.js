// logicaGame/gestionPartidas/MatchmakingService.js

import { v4 as uuidv4 } from 'uuid';
// Asegúrate de que tienes instalado uuid (npm install uuid)

// 🔑 FIX: Declarar el estado global del servicio aquí
const activeGames = new Map();

// --- 1. LÓGICA DE CREACIÓN DE LOBBY ---
export const createLobby = (hostDetails, lobbyOptions) => {
    const matchId = uuidv4();

    const newGame = {
        matchId: matchId,
        hostId: hostDetails.userId,
        status: 'Waiting',

        isQuickMatch: lobbyOptions.isQuickMatch || false,
        isPrivate: lobbyOptions.isPrivate || false,

        password: lobbyOptions.password || null,
        players: [hostDetails], // Host es el único jugador
        maxPlayers: 2,
    };

    activeGames.set(matchId, newGame);

    return {
        matchId: matchId,
        status: 'created'
    };
};

// --- 2. LÓGICA DE BÚSQUEDA Y UNIÓN ---
export const attemptToJoinQuickMatch = (playerDetails) => {
    const userId = playerDetails.userId;

    // 🔑 FIX: La variable 'activeGames' ahora es accesible
    for (const [matchId, game] of activeGames.entries()) {

        // Criterio: Sala de Quick Match, esperando y con espacio
        const isAvailable = (
            game.status === 'Waiting' &&
            game.isQuickMatch === true &&
            game.players.length < game.maxPlayers &&
            game.players[0].userId !== userId
        );

        if (isAvailable) {
            // Unir jugador
            game.players.push(playerDetails);
            game.status = 'Ready';

            // Aquí se enviaría la notificación WS al host (P1)

            return {
                status: 'joined',
                matchId: matchId
            };
        }
    }

    return { status: 'none_available' };
};
