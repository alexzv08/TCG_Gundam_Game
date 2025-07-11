// import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css';
import App from './App.jsx'
// import { SocketProvider } from './context/SocketContext';
import { GameProvider } from './context/GameContext.jsx';

// console.log("BACKEND URL:", import.meta.env.VITE_BACKEND_URL);
createRoot(document.getElementById('root')).render(
    <GameProvider>
        <App />
    </GameProvider>

)
