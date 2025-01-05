
/**
 * Verifica si el mazo cumple con el límite máximo de cartas.
 * @param {Array} mazo - Array de cartas en el mazo.
 * @param {number} maxCartas - Límite máximo de cartas permitido.
 * @returns {boolean} - `true` si cumple la regla, `false` en caso contrario.
 */
export const checkMaxCartas = (mazo, maxCartas = 50) => {
    return mazo.length < maxCartas;
};

/**
 * Verifica si una carta puede ser añadida al mazo según el límite de copias.
 * @param {Array} mazo - Array de cartas en el mazo.
 * @param {Object} carta - Carta que se intenta añadir.
 * @param {number} maxCopias - Máximo número de copias permitidas.
 * @returns {boolean} - `true` si cumple la regla, `false` en caso contrario.
 */
export const checkMaxCopias = (mazo, carta, maxCopias = 4) => {
    // Buscamos si la carta ya está en el mazo
    const cartasIguales = mazo.find((item) =>
        item.carta.id_coleccion === carta.id_coleccion && item.carta.id_carta === carta.id_carta);

    // Si no se encuentra la carta, significa que no hay copias, por lo que se puede añadir la carta
    if (!cartasIguales) {
        return true;
    }
    
    // Si la carta ya existe, verificamos si la cantidad de copias es menor al máximo permitido
    if (cartasIguales.cantidad < maxCopias) {
        return true;
    }
    // Si la cantidad de copias es igual o superior al máximo permitido, no se puede añadir más
    return false;
};

/**
 * Verifica si no hay más de 2 colores diferentes en el mazo.
 * @param {Array} mazo - Array de cartas en el mazo.
 * @param {Object} carta - Carta que se intenta añadir.
 * @returns {boolean} - `true` si cumple la regla, `false` en caso contrario.
 */
export const checkMaxColores = (mazo, carta) => {
    // Obtener los colores únicos presentes en el mazo
    const coloresUnicos = new Set(mazo.map((c) => c.carta.color));
        // Si el color de la carta ya está en los colores únicos, es válido
    console.log(coloresUnicos)
    if (coloresUnicos.has(carta.color)) {
        return true;
    }
    // Si aún no está y ya hay 2 colores, no se permite
    return coloresUnicos.size < 2;
};
