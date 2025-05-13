// src/utils/socket.js
import { io } from 'socket.io-client';
const socket = io(import.meta.env.VITE_BACKEND_URL, {
    autoConnect: false,
    cors: {
        origin: 'https://tcg-gundam-game-1.onrender.com',
        methods: ['GET', 'POST'],
        credentials: true
    }
});
export default socket;