const jwt = require('jsonwebtoken');

// Middleware para verificar el JWT
const verificarToken = (req, res, next) => {
    // Obtener el token de la cabecera 'Authorization'
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
        return res.status(401).json({ message: 'Acceso no autorizado. No se proporcionó el token.' });
    }

    try {
        // Verificar el token
        const decoded = jwt.verify(token, 'TU_SECRETO_AQUI'); // Aquí usamos el mismo secreto usado para generar el token
        req.usuario = decoded.id; // Guardamos el ID del usuario decodificado en la solicitud
        next(); // Continuar con la siguiente función de la ruta
    } catch (error) {
        console.error(error);
        return res.status(401).json({ message: 'Token inválido o expirado.' });
    }
};

module.exports = { verificarToken };