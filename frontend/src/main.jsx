// import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css';
import App from './App.jsx'
// import { SocketProvider } from './context/SocketContext';
import { GameProvider } from './context/GameContext.jsx';

createRoot(document.getElementById('root')).render(

    <GameProvider>
        <App />
    </GameProvider>

)
