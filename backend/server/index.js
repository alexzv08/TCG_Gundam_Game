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
const { initializeGame, handlePlayerAction, getGameState } = require("../logicaGame/game/gameLogic");

const partidas = {};

const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

// Crear el servidor HTTP
const server = http.createServer(app);

// Configurar Socket.IO en el servidor
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
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




// Variables para las partidas
let games = {}; // Almacenar las partidas activas

// Eventos de Socket.IO

// Evento de conexión de un cliente
io.on('connect', (socket) => {
    console.log('Un jugador se ha conectado');

    socket.on("playerConnected", (data) => {
        console.log("Datos recibidos:", data); // Aquí debería mostrar el objeto { playerId: "..." }
        const playerId = data.playerId;
        console.log(`Jugador conectado con playerId: ${playerId}`);
    });

    socket.on('disconnect', () => {
        // Buscar si el jugador desconectado pertenece a alguna partida
        for (let idPartida in games) {
            const partida = games[idPartida];
            const jugadorIndex = partida.jugadores.findIndex(player => player.socket.id === socket.id);

            if (jugadorIndex !== -1) {
                // El jugador se ha desconectado, eliminamos su socket
                partida.jugadores.splice(jugadorIndex, 1);
                console.log(`Jugador ${partida.jugadores[jugadorIndex].user} ha desconectado`);

                // Comprobamos si la partida está completa
                checkPlayersConnection(idPartida);
                break;
            }
        }
    });


    socket.on("unirseAPartida", (idPartida, user) => {
        console.log(idPartida, user)
        if (!partidas[idPartida]) {
            // Si la partida no existe, la creamos
            partidas[idPartida] = {
                jugadores: [],
                jugadorInicial: null, // Aquí decidiremos el jugador inicial más adelante
            };
        }

        const partida = partidas[idPartida];

        // Añadir al jugador a la partida
        if (!partida.jugadores.find(jugador => jugador.user === user)) {
            partida.jugadores.push({ socket, user });
        }


        console.log(partida)
        // Si hay dos jugadores, determinamos el jugador inicial
        if (partida.jugadores.length === 2) {
            const jugadorInicialIndex = Math.random() < 0.5 ? 0 : 1;
            const jugadorInicial = partida.jugadores[jugadorInicialIndex];

            partida.jugadorInicial = jugadorInicial.user;
            // Enviamos el resultado a ambos jugadores
            partida.jugadores.forEach(({ socket }, index) => {
                socket.emit("jugadorInicial", {
                    jugadorInicial: jugadorInicial.user, // Enviamos el nombre del usuario inicial
                    esTuTurno: index === jugadorInicialIndex, // Indicar si es su turno
                });
            });
        }

        // Comprobar si ambos jugadores están conectados
        checkPlayersConnection(partida);
    });

    function checkPlayersConnection(partida) {

        console.log(partida)
        if (partida && partida.jugadores.length < 2) {
            // Si falta un jugador, avisamos al otro jugador
            partida.jugadores.forEach(({ socket }) => {
                socket.emit("esperandoOponente", { mensaje: "Esperando al oponente..." });
            });
        }
    }

});

// Iniciar el servidor
server.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});