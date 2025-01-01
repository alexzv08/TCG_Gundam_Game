// Validar mazo según las reglas
function validarMazo(mazoPrincipal, mazoRecursos, tokens) {
    const errores = [];

    // Validar número de cartas
    if (mazoPrincipal.length !== 50) {
        errores.push("El mazo principal debe contener exactamente 50 cartas.");
    }

    if (mazoRecursos.length !== 10) {
        errores.push("El mazo de recursos debe contener exactamente 10 cartas.");
    }

    // Validar colores de las cartas
    const coloresMazo = [...new Set(mazoPrincipal.map(carta => carta.color))];
    if (coloresMazo.length > 2) {
        errores.push("El mazo debe contener cartas de uno o dos colores solamente.");
    }

    // Validar cantidad máxima por carta
    const conteoCartas = {};
    mazoPrincipal.forEach(carta => {
        conteoCartas[carta.numero] = (conteoCartas[carta.numero] || 0) + 1;
    });

    Object.keys(conteoCartas).forEach(numero => {
        if (conteoCartas[numero] > 4) {
            errores.push(`La carta con número ${numero} excede el límite de 4 copias.`);
        }
    });

    // Validar tokens
    const exBase = tokens.find(token => token.tipo === "EX Base");
    const exResource = tokens.find(token => token.tipo === "EX Resource");
    if (!exBase) {
        errores.push("Falta el token EX Base.");
    }
    if (!exResource) {
        errores.push("Falta el token EX Resource.");
    }

    return errores.length > 0 ? { valido: false, errores } : { valido: true };
}


