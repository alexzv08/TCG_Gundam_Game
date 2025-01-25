import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import CreateDeck from "./paginas/CreateDeck";
import Register from "./paginas/Register";
import Login from "./paginas/Login";
import ZonaDeJuegos from "./paginas/ZonaDeJuegos";
import Tablero from "./components/tableros/Tablero"
import Prueba from "./paginas/Prueba";

// import { useEffect, useState } from 'react';
// import { io } from 'socket.io-client';

// Conexión al servidor
// const socket = io('http://localhost:5000'); // Cambia esto si usas un dominio o puerto diferente

const App = () => {
  return (
    <Router>
      <div className="min-h-screen bg-[#141718]">
        <main className="p-0">
          <Routes>
            <Route path="/" element={<Login />} /> {/* Ruta para crear mazo */}
            <Route path="/register" element={<Register />} /> {/* Ruta para crear mazo */}
            <Route path="/home" element={<CreateDeck />} /> {/* Ruta para crear mazo */}
            <Route path="/playgame" element={<ZonaDeJuegos />} /> {/* Ruta para crear mazo */}
            <Route path="/prueba" element={<Prueba />} /> {/* Ruta para crear mazo */}
            <Route path="/tablero" element={<Tablero />} /> {/* Ruta para crear mazo */}


          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default App;
