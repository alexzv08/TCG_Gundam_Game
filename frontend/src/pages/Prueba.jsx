import { useEffect, useState } from 'react';
// import { useGameLogic } from '../hooks/useGameLogic';
import { useGame } from '../context/GameContext';
import Tablero from '../templates/GameBoard';
import TableroRival from '../templates/GameBoardRival';

import Modal from '../organisms/modal/Modal';
import ModalAccionesJuego from '../organisms/modalAccionesJeego/ModalAccionesJuego';
import CartaModal from '../organisms/modalCarta/CartaModal';

export default function Prueba() {
  // 1) Define el estado del modal primero
    // const { buscarSala } = useGameLogic(setShowModal);
    const { buscarSala, showModal, setShowModal, isLoading, setIsLoading, modalConfig, setModalConfig, showModalAcciones, configModalModalAcciones, currentPlayer, turnCount,   
        showCartaModal,
        setShowCartaModal,
        selectedCarta,
        setSelectedCarta,} = useGame();

    useEffect(() => {
        
        setModalConfig({
            title:   '¿Quieres buscar partida?',
            content: '',
            actions: [
            {
                label:   'Aceptar',
                onClick: () => onBuscar(),
                style:   'bg-green-500',
            },
            {
                label:   'Cancelar',
                onClick: () => setShowModal(false),
                style:   'bg-red-500',
            },
            ],
        });
    }, []);
    // 2) Llama al hook *una sola vez*, pasándole setShowModal

    // 3) Handler de búsqueda
    const onBuscar = () => {
        setIsLoading(true);
        setModalConfig(cfg => ({ ...cfg, title: 'Buscando partida...' }));
        buscarSala(localStorage.getItem('user'));
    };

    return (
        <main className="relative w-full h-screen">
            <div className={`absolute inset-0 flex items-center justify-center w-1/6 h-12 gap-2 m-auto text-white ${currentPlayer === localStorage.getItem("user") ? 'bg-blue-500' : 'bg-red-500'}`}>
                <div>Turno de: <b>{currentPlayer}</b> //</div>
                <div>Turno: <b>{turnCount}</b></div>
            </div>

            <Modal
                show={showModal}
                title={modalConfig.title}
                content={modalConfig.content}
                actions={modalConfig.actions}
                isLoading={isLoading}
            ></Modal>
            <CartaModal
                showCartaModal={showCartaModal}
                setShowCartaModal={setShowCartaModal}
                selectedCarta={selectedCarta}
                setSelectedCarta={setSelectedCarta}
            />
            <ModalAccionesJuego 
                show={showModalAcciones}
                title={configModalModalAcciones.title}
                content={configModalModalAcciones.content}
                actions={configModalModalAcciones.actions}
                cartas={configModalModalAcciones.cartas}
                isLoading={isLoading}
            />
            <div className="w-full h-[50%] bg-gradient-to-br from-gray-800 to-gray-600 border border-gray-700 shadow-lg rounded-lg flex justify-center items-center transform rotate-z-[180deg] rotate-x-[20deg]  ">
                <TableroRival />
            </div>
            <div className="relative zona-jugador w-[100%] h-[50%] bg-gradient-to-br from-gray-800 to-gray-600 border border-gray-700 shadow-lg rounded-lg flex justify-center items-center transform rotate-x-[20deg]">
                <Tablero />
            </div>
        </main>
    );
}
