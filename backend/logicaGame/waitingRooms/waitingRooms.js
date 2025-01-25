// roomManager.js

let waitingRooms = []; // Lista de salas disponibles

const createRoom = (playerId) => {
    const roomId = `room-${Date.now()}`; // ID único
    const room = { roomId, players: [playerId] }; // Crea la sala con un jugador
    waitingRooms.push(room);
    return room;
};

const joinRoom = (playerId) => {
    const room = waitingRooms.find((room) => room.players.length === 1);
    if (room) {
        room.players.push(playerId); // Añade al segundo jugador
        waitingRooms = waitingRooms.filter((r) => r.roomId !== room.roomId); // Sala ya no está vacía
        return room;
    }
    return createRoom(playerId); // Si no hay sala disponible, crea una nueva
};

const getWaitingRooms = () => waitingRooms; // Opcional: Para depuración

module.exports = { createRoom, joinRoom, getWaitingRooms };
