const express = require('express');
const router = express.Router();
const fs = require('fs').promises;
const path = require('path');
const MatchmakingService = require('../logicaGame/gestionPartidas/MatchmakingService');

// routes/matchmaking.js (Ruta para Quick Match)

router.post('/quick_match', async (req, res) => {
    // 1. Obtener detalles del usuario (asumido desde la sesión)
    const playerDetails = { userId: req.userId, deckId: req.deckId, mmr: req.mmr || 1000 };
    // 2. Intentar buscar un lobby público de Quick Match (BUSCAR)
    const joinResult = MatchmakingService.attemptToJoinQuickMatch(playerDetails);

    if (joinResult.status === 'joined') {
        // Encontró una sala Quick Match abierta.
        // Se notifica al host existente vía WS, y se redirecciona al jugador actual.
        return res.status(200).json(joinResult);
    }

    // 3. Si no se encontró un lobby abierto, crear uno nuevo de tipo Quick Match (CREAR)
    const createResult = MatchmakingService.createLobby(playerDetails, {
        isQuickMatch: true
    });

    // 4. Se notifica al jugador que ha creado la sala y debe esperar.
    return res.status(201).json(createResult);
});

module.exports = router;