// Importar dependencias necesarias
const express = require("express");
const bcrypt = require("bcrypt"); // Para manejar contraseñas cifradas
const jwt = require("jsonwebtoken"); // Para generar tokens JWT
const db = require("../db/db"); // Configuración de la base de datos

const router = express.Router();

// Ruta para el login
router.post("/login", async (req, res) => {
    const { usuario, password } = req.body;

    // Validar que los datos están presentes
    if (!usuario || !password) {
        return res.status(400).json({ message: "Por favor, rellena todos los campos." });
    }

    try {
        // Buscar al usuario en la base de datos
        const query = "SELECT * FROM usuarios WHERE usuario = ?";

        const [results] = await db.query(query, usuario);

        if (results.length === 0) {
            return res.status(401).json({ message: "Usuario o contraseña incorrectos." });
        }

        const user = results[0];

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Contraseña incorrecta." });
        }
        // Generar un token JWT
        const token = jwt.sign(
            { id: user.usuario },
            "TU_SECRETO_AQUI", // Cambia esto por una clave segura
            { expiresIn: "1h" }
        );

        // Responder con éxito y el token
        return res.status(200).json({
            message: "Login exitoso.",
            token,
            usuario: user.usuario,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error en el servidor." });
    }
});


router.post("/register", async (req, res) => {
    const { usuario, password, email } = req.body;

    if (!usuario || !password || !email) {
        return res.status(400).json({ message: 'Todos los campos son obligatorios' });
    }

    try {
        const passwordCifrada = await cifrarPassword(password);

        const query = `INSERT INTO usuarios (usuario, password, email, fechaCreacion, id_rol) VALUES (?, ?, ?, NOW(), ?)`;
        const values = [usuario, passwordCifrada, email, 4]; // 2 puede ser un rol por defecto

        const [result] = await db.query(query, values);
        console.log("Usuario guardado exitosamente.");
        return res.status(201).json({ message: "Usuario registrado exitosamente." });
    } catch (err) {
        console.error("Error al guardar el usuario:", err.message);
        throw err;
    }
});


// Función para cifrar una contraseña
const cifrarPassword = async (password) => {
    try {
        const saltRounds = 10; // Número de rondas para generar el salt
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        return hashedPassword;
    } catch (err) {
        console.error("Error al cifrar la contraseña:", err.message);
        throw err; // Lanza el error para manejarlo en otro lugar
    }
};

module.exports = router;