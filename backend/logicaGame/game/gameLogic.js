const db = require('../../db/db'); // conexión a la base de datos

let games = [];

const createGame = (socket, user, roomId) => {
    console.log("Creando juego...");

    games.push({
        game: {
            roomId: roomId,
            players: {
                player1: {
                    idPlayer1: user,
                    socketPlayer1: socket,
                    tablero: {
                        deck: [],
                        hand: [],
                        shieldArea: [],
                        baseArea: [],
                        resourceArea: [],
                        battleArea: [],
                        trash: [],
                        space: [],
                    }
                },
                player2: {
                    idPlayer2: "",
                    socketPlayer2: "",
                    tablero: {
                        deck: [],
                        hand: [],
                        shieldArea: [],
                        baseArea: [],
                        resourceArea: [],
                        battleArea: [],
                        trash: [],
                        space: [],
                    }
                }
            },
            gameStatus: "Waiting Opponent",
        }
    });
    console.log(games.length);
}
const añadirJugador = (socket, user, roomId) => {
    console.log("Añadiendo jugador...");

    let game = games.find(game => game.game.roomId === roomId);

    if (game) {
        game.game.players.player2.idPlayer2 = user;
        game.game.players.player2.socketPlayer2 = socket;
        game.game.gameStatus = "Game Started";
    }
    console.log(game);
}
module.exports = { createGame, añadirJugador };
