require('dotenv').config();
const express = require('express');
const bcrypt = require("bcrypt"); // Para manejar contraseñas cifradas
const jwt = require("jsonwebtoken"); // Para generar tokens JWT
const cors = require('cors');
const http = require('http'); // Necesario para usar Socket.IO con Express
const { Server } = require('socket.io');
const db = require('../db/db');

const cartasRouter = require('../api/cartas');
const authRoutes = require('../api/middlewareUser');

const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

// Crear el servidor HTTP
const server = http.createServer(app);

// Configurar Socket.IO en el servidor
const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173", // Cambia esto a la URL de tu frontend
        methods: ["GET", "POST"],
    },
});
app.use(express.json()); // Para parsear JSON en las peticiones

// Rutas get API
app.get('/', (req, res) => {
    res.send('Servidor corriendo con Socket.IO');
});
// Rutas post/get para recuperar/insertar datos

// Rutas registro/login
app.use('/api', authRoutes);

// Rutas para las cartas
app.use('/api', cartasRouter); // Ruta para las cartas

// Iniciar el servidor
server.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});


// Eventos de Socket.IO

// Evento de conexión de un cliente
io.on('connection', (socket) => {
    console.log(`Usuario conectado: ${socket.id}`);

    // Evento de desconexión de un cliente
    socket.on('disconnect', () => {
        console.log(`Usuario desconectado: ${socket.id}`);
    });



});