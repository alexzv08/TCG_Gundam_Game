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
const { createGame, añadirJugador } = require("../logicaGame/game/gameLogic");
const { createRoom, joinRoom } = require('../logicaGame/waitingRooms/waitingRooms');

const partidas = {};

const app = express();

app.use(cors());
app.use(cors({
    origin: 'https://tcg-gundam-game-1.onrender.com',
    methods: ['GET', 'POST'],
    credentials: true
}));
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


function randomStartPlayer(players) {
    return players[Math.floor(Math.random() * players.length)];
}

// Variables para las partidas
let rooms = []; // Las salas activas
let playerRooms = {}; // Mapea socket.id -> room.id
let playersReady = {}; // Mapea room.id -> { socket.id -> decision }
// Eventos de Socket.IO

io.on('connection', (socket) => {
    console.log('Player connected:', socket.id);

    socket.on("buscarSala", (user) => {
        console.log(socket.id, "esta buscando partida")
        let roomFound = rooms.find(room => room.players.length < 2);
        console.log("roomFound", roomFound)
        if (roomFound) {
            // Sala encontrada
            roomFound.players.push(user);
            socket.join(roomFound.id);
            añadirJugador(socket, user, roomFound.id);
            console.log(`Jugador ${user} se unió a la sala ${roomFound.players}`);
            io.to(roomFound.id).emit('salaEncontrada', roomFound, randomStartPlayer(roomFound.players));
        } else {
            // Crear una nueva sala
            const newRoom = { id: `room-${Date.now()}`, players: [user] };
            createGame(socket, user, newRoom.id);
            socket.join(newRoom.id);
            console.log(`Jugador ${user} creó la sala ${newRoom.id}`);
            socket.emit('salaCreada', newRoom);
            rooms.push(newRoom);
        }
        console.log(socket.rooms)
    })

    socket.on("decidirMulligan", ({ roomId, playerId, decision }) => {
        if (!playersReady[roomId]) {
            playersReady[roomId] = {};
        }
        console.log("decidirMulligan", roomId)
        console.log("playerId", playerId)
        console.log("decision", decision)
        playersReady[roomId][playerId] = decision;

        // Si ambos jugadores han decidido, avanzar
        if (Object.keys(playersReady[roomId]).length === 2) {
            console.log("Ambos jugadores han decidido")
            io.to(roomId).emit("mulliganFinalizado", playersReady[roomId]);
            delete playersReady[roomId]; // Limpiar estado para la siguiente fase
        }
    });


    socket.on("startTurn", ({ roomId, currentPlayer }) => {
        if (!rooms[roomId]) {
            rooms[roomId] = { turnStarted: false };
        }

        if (!rooms[roomId].turnStarted) {
            rooms[roomId].turnStarted = true;
            io.in(roomId).emit("turnoComenzado", currentPlayer);
        }
    });

    socket.on('syncHand', ({ roomId, playerId, hand }) => {
        // Reenvía a todos menos al emisor
        console.log("syncHand", roomId, playerId)
        socket.to(roomId).emit('opponentHand', { playerId, hand });
    });
    socket.on('syncDeck', ({ roomId, playerId, deck }) => {
        // Reenvía a todos menos al emisor
        console.log("syncDeck", roomId, playerId, deck.length)
        socket.to(roomId).emit('opponentDeck', { playerId, deck });
    })
    socket.on('syncShields', ({ roomId, playerId, shields }) => {
        // Reenvía a todos menos al emisor
        console.log("syncShields", roomId, playerId, shields.length)
        socket.to(roomId).emit('opponentShields', { playerId, shields });
    });
    socket.on('syncResources', ({ roomId, playerId, resources }) => {
        // Reenvía a todos menos al emisor
        console.log("syncResources", roomId, playerId, resources.length)
        socket.to(roomId).emit('opponentResources', { playerId, resources });
    });

    socket.on('syncBaseArea', ({ roomId, playerId, baseArea }) => {
        // Reenvía a todos menos al emisor
        console.log("syncBaseArea", roomId, playerId, baseArea)
        socket.to(roomId).emit('opponentBaseArea', { playerId, baseArea });
    });

    socket.on("syncBattleCards", ({ roomId, playerId, battleCards }) => {
        socket.to(roomId).emit('opponentBattleArea', { playerId, battleCards });
        console.log("syncBattleCards", battleCards)
    })

    socket.on("syncTrash", ({ roomId, playerId, trash }) => {
        socket.to(roomId).emit('opponentTrash', { playerId, trash });
        console.log("syncTrash", roomId, playerId, trash.length)
    })
    socket.on('syncRotated', ({ roomId, playerId, rotated }) => {
        console.log("syncRotated", roomId, playerId, rotated)
        socket.to(roomId).emit('opponentRotated', { playerId, rotated });
    });
    // socket.on('battleAreaUpdated', (battleArea) => {
    //     console.log("battleAreaUpdated", battleArea)
    // });

    socket.on('disconnect', () => {
        console.log('Jugador desconectado', socket.id);
        // Si el jugador estaba en alguna sala, eliminarlo
        const roomId = playerRooms[socket.id];
        if (roomId) {
            const room = rooms.find(r => r.id === roomId);
            if (room) {
                room.players = room.players.filter(id => id !== socket.id);
            }
            delete playerRooms[socket.id]; // Limpiar el registro del jugador
        }
        console.log(socket.rooms)
    });
});

// Iniciar el servidor
server.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});