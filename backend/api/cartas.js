const express = require('express');
const router = express.Router();
const db = require('../db/db'); // Suponiendo que tienes un archivo para la configuración de DB
const { verificarToken } = require('./authMiddleware'); // Importas el middleware para verificar el token

// Endpoint para obtener las cartas
router.get('/cartas', verificarToken, async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM cartas'); // Realizas la consulta a la DB
        res.json(rows); // Devuelves las cartas en formato JSON
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener las cartas' });
    }
});

// Endpoint para guardar el mazo
router.post('/guardar-mazo', verificarToken, async (req, res) => {
    const { nombreMazo, usuario, cartas } = req.body; // Obtienes los datos del cuerpo de la solicitud

    if (!nombreMazo || !usuario || !cartas) {
        return res.status(400).json({ error: 'Faltan datos' });
    }

    try {
        // Insertar el mazo en la tabla `mazos` y obtener el ID del mazo
        const [resultadoMazo] = await db.query(
            "INSERT INTO mazos (id_usuario, nombre_mazo) VALUES (?, ?)",
            [usuario, nombreMazo]
        );
        const idMazo = resultadoMazo.insertId;
        console.log(cartas);

        // Insertar las cartas del mazo en la tabla `mazo_cartas`
        const valoresCartas = cartas.map((entry) => [
            idMazo,
            entry.id_juego,
            entry.id_coleccion,
            entry.id_carta,
            entry.cantidad,
        ]);

        await db.query(
            `INSERT INTO mazo_cartas (id_mazo, id_juego, id_coleccion, id_carta, cantidad) VALUES ?`,
            [valoresCartas]
        );

        res.status(200).json({ message: "Mazo guardado correctamente." });

    } catch (error) {
        res.status(500).json({ error: 'Error al guardar el mazo' });
    }
});

module.exports = router;