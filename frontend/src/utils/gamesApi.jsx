export const obtenerPartidas = async () => {
    try {
        const response = await fetch(import.meta.env.VITE_BACKEND_URL+'/api/games',{

    }); // Ajusta la URL si es necesario
        const data = await response.json();
        return data; // Devuelve las cartas
    } catch (error) {
        console.error('Error al obtener las cartas:', error);
        return []; // Devuelve un array vacío en caso de error
    }
};