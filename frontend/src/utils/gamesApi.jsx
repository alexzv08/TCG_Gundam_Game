export const obtenerPartidas = async () => {
    try {
        const response = await fetch(import.meta.env.VITE_BACKEND_URL+'/api/infoGames/games',{

    }); // Ajusta la URL si es necesario
        const data = await response.json();
        return data; // Devuelve las cartas
    } catch (error) {
        console.error('Error al obtener las cartas:', error);
        return []; // Devuelve un array vacío en caso de error
    }
};

export const obtenerMisDecks = async () => {
    try {
        const user = localStorage.getItem('user');
        if (!user) {
            console.error('No se ha encontrado el id del usuario en el localStorage');
            return [];
        }
        const response = await fetch(import.meta.env.VITE_BACKEND_URL+'/api/infoGames/miDecks',{
            body: JSON.stringify({ user: user }),
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
    }); // Ajusta la URL si es necesario
        const data = await response.json();
        return data; // Devuelve las cartas
    } catch (error) {
        console.error('Error al obtener las cartas:', error);
        return []; // Devuelve un array vacío en caso de error
    }
};

export const handleQuickMatch = async (userId, deckId) => {
    // ...
    // 1. Envía la solicitud HTTP para crear o buscar una sala
    const response = await fetch(import.meta.env.VITE_BACKEND_URL+'/api/machmaking/quick_match', 
        { 
            method: 'POST',  
            headers: { 'Content-Type': 'application/json' }, 
            body: JSON.stringify({ userId, deckId }) 
        });
    
    // 2. Espera la respuesta que contiene el ID
    const data = await response.json();
    const matchId = data.matchId;

    // 3. Redirige, usando el ID del match de la respuesta HTTP
    return matchId
};