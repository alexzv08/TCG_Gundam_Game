const express = require('express');
const router = express.Router();
const db = require('../db/db'); // Suponiendo que tienes un archivo para la configuración de DB
const { verificarToken } = require('./authMiddleware'); // Importas el middleware para verificar el token


router.get('/games', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM game_rooms'); // Realizas la consulta a la DB
        res.json(rows); // Devuelves las cartas en formato JSON
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener las cartas' });
    }
});

router.post('/miDecks', async (req, res) => {
    try {
        console.log("peticion deks");
        const [rows] = await db.query('SELECT * FROM mazos where id_usuario = ?', [req.body.user]); // Realizas la consulta a la DB
        res.json(rows); // Devuelves las cartas en formato JSON
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener las cartas' });
    }
});


module.exports = router;