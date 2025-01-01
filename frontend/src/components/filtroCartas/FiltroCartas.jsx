import React, { useState, useEffect } from "react";

const FiltroCartas = () => {
    // Estado para las cartas
    const [cards, setCards] = useState([]);
    const [searchFilters, setSearchFilters] = useState({
        cardName: "",
        color: "",
        type: "",
    });

    // Simula la carga de cartas (esto luego se conectará al backend)
    useEffect(() => {
        fetch("/api/cards") // Cambia esto con tu endpoint real
        .then((res) => res.json())
        .then((data) => setCards(data))
        .catch((error) => console.error("Error fetching cards:", error));
    }, []);

    // Maneja el cambio en los filtros
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setSearchFilters((prev) => ({ ...prev, [name]: value }));
    };

    // Filtrar las cartas según los filtros
    const filteredCards = cards.filter((card) => {
        return (
        card.card_name.toLowerCase().includes(searchFilters.cardName.toLowerCase()) &&
        (searchFilters.color === "" || card.color === searchFilters.color) &&
        (searchFilters.type === "" || card.card_type === searchFilters.type)
        );
    });

    return (
        <div className="p-6">
        {/* Formulario de filtros */}
        <div className="p-4 mb-6 bg-white rounded-lg shadow">
            <h2 className="mb-4 text-xl font-bold">Filtrar cartas</h2>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {/* Filtro por nombre */}
            <div>
                <label htmlFor="cardName" className="block text-sm font-medium text-gray-700">
                Nombre de la carta
                </label>
                <input
                type="text"
                id="cardName"
                name="cardName"
                value={searchFilters.cardName}
                onChange={handleInputChange}
                className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Buscar por nombre"
                />
            </div>

            {/* Filtro por color */}
            <div>
                <label htmlFor="color" className="block text-sm font-medium text-gray-700">
                Color
                </label>
                <select
                id="color"
                name="color"
                value={searchFilters.color}
                onChange={handleInputChange}
                className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                >
                <option value="">Todos</option>
                <option value="red">Rojo</option>
                <option value="green">Verde</option>
                <option value="white">Blanco</option>
                <option value="blue">Azul</option>
                </select>
            </div>

            {/* Filtro por tipo */}
            <div>
                <label htmlFor="type" className="block text-sm font-medium text-gray-700">
                Tipo
                </label>
                <select
                id="type"
                name="type"
                value={searchFilters.type}
                onChange={handleInputChange}
                className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                >
                <option value="">Todos</option>
                <option value="unit">Unidad</option>
                <option value="pilot">Piloto</option>
                <option value="command">Comando</option>
                <option value="base">Base</option>
                </select>
            </div>
            </div>
        </div>

        {/* Lista de cartas */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredCards.map((card) => (
            <div
                key={card.id_carta}
                className="flex flex-col items-center p-4 bg-white rounded-lg shadow"
            >
                <img src={card.image_url} alt={card.card_name} className="object-cover w-32 h-40" />
                <h3 className="mt-2 text-lg font-bold">{card.card_name}</h3>
                <p className="text-sm text-gray-500">{card.card_type}</p>
                <p className="text-sm text-gray-500">{card.color}</p>
            </div>
            ))}
        </div>
        </div>
    );
};

export default FiltroCartas;
