// src/utils/socket.js
import { io } from 'socket.io-client';
const socket = io('http://192.168.1.136:5000', {
    autoConnect: false,
});
export default socket;