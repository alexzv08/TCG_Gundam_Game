const express = require('express');
const router = express.Router();
const db = require('../db/db'); // Suponiendo que tienes un archivo para la configuración de DB
const { verificarToken } = require('./authMiddleware'); // Importas el middleware para verificar el token

// Endpoint para obtener todas las cartas
router.get('/cartas', async (req, res) => {
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
            "INSERT INTO mazos (id_usuario, nombre_mazo, fecha) VALUES (?, ?, NOW())",
            [usuario, nombreMazo]
        );
        const idMazo = resultadoMazo.insertId;

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
        console.error('Error al guardar el mazo:', error);
        res.status(500).json({ error: 'Error al guardar el mazo' });
    }
});

// Enpoint para recuperar el mazo seleccionado del jugador al entrar en partida
router.get('/recuperarMazo', async (req, res) => {
    const playerId = req.body.user;
    const mazoId = "15" //req.params.mazoId; --> @todo hay que modificar el id de mazo al buscar y crear pamtall apara seleccionar el mazo con el que se va a jugar

    try {
        const mazo = await db.query(`SELECT c.* , m.cantidad
                                    FROM cartas c
                                    JOIN mazo_cartas m ON c.id_carta = m.id_carta AND c.id_coleccion = m.id_coleccion
                                    WHERE m.id_mazo = ?; `, [mazoId])
        res.json(mazo);
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: `Error al obtener el mazo del jugador ${playerId} con el mazo ${idMazo}` })
    }

})

router.get('/recuperarBaseToken', async (req, res) => {
    try {
        const mazo = await db.query(`select * from cartas where id_coleccion = "EXB" and id_carta = "001"; `)
        res.json(mazo);
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: `Error al obtener base ex` })
    }

})

router.get('/recuperarResource', async (req, res) => {
    try {
        const mazo = await db.query(`select * from cartas where (id_coleccion = "EXR" and id_carta = "001") or (id_coleccion = "R" and id_carta = "001") `)
        res.json(mazo);
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: `Error al obtener resource` })
    }

})

module.exports = router;