const express = require('express');
const router = express.Router();
const db = require('../db/db'); // Suponiendo que tienes un archivo para la configuración de DB
const { verificarToken } = require('./authMiddleware'); // Importas el middleware para verificar el token


router.get('/games', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM cartas'); // Realizas la consulta a la DB
        console.log(rows);
        res.json(rows); // Devuelves las cartas en formato JSON
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener las cartas' });
    }
});