// SocketContext.js
import React, { createContext, useContext, useEffect } from 'react';
import socket from "../utils/socket";

const SocketContext = createContext();
export const useSocket = () => useContext(SocketContext);

export function SocketProvider({ children }) {
    useEffect(() => {
        // Registrar globalmente una sola vez
        return () => {
        socket.removeAllListeners(); // limpia todo al desmontar proveedor
        };
    }, []);
    return (
        <SocketContext.Provider value={socket}>
        {children}
        </SocketContext.Provider>
    );
}
