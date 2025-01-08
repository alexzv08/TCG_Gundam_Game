//Funcion para obtener las cartas desde el backend
export const obtenerCartas = async () => {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:5000/api/cartas',{

    }); // Ajusta la URL si es necesario
        const data = await response.json();
        return data; // Devuelve las cartas
    } catch (error) {
        console.error('Error al obtener las cartas:', error);
        return []; // Devuelve un array vacío en caso de error
    }
};