import { PHASES_SETUP, PHASES } from '../constant/phases';
// Construir el mazo
export const buildDeck = (cardsData) => {
    const deck = [];
    cardsData.forEach((card) => {
        for (let i = 0; i < card.cantidad; i++) {
            deck.push({ ...card });
        }
    });
    return deck;
};

// Barajar el mazo
export const shuffleDeck = (deck) => {
    for (let i = deck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [deck[i], deck[j]] = [deck[j], deck[i]];
    }
    return deck;
};

// Repartir mano inicial
export const drawInitialHand = (deck) => {
    const initialHand = deck.slice(0, 5); // Tomar las primeras 5 cartas
    const remainingDeck = deck.slice(5); // Restante del mazo
    return { initialHand, remainingDeck };
};

// Inicializar el mazo
export const initializeDeck = async (setDeck, setHand, setDeckInitialized) => {
    try {
        const response = await fetch(import.meta.env.VITE_BACKEND_URL+"/api/recuperarMazo");
        const data = await response.json();

        let generatedDeck = buildDeck(data[0]);
        generatedDeck = shuffleDeck(generatedDeck);

        const { initialHand, remainingDeck } = drawInitialHand(generatedDeck);

        setDeck(remainingDeck);
        setHand(initialHand);
        setDeckInitialized(true);

        return {initialHand,remainingDeck}; // <-- Devuelve la mano directamente
    } catch (error) {
        console.error("Error al inicializar el mazo:", error);
        return []; // Por si falla, que no pete
    }
};


export const shieldAdd = (setShields, setDeck, deck) => {
    const initialShield = deck.slice(0, 6);      // las primeras 6 cartas para el escudo
    const remainingDeck = deck.slice(6);         // el resto se queda en el deck

    setShields(() => {
        return initialShield;
    });

    setDeck(() => {
        return remainingDeck;
    });
};

export const shieldRemove = (setShieldArea, setDeck, currentDeck) => {
    const initialShield = currentDeck.slice(0, 6);      // las primeras 6 cartas para el escudo
    const remainingDeck = currentDeck.slice(6);         // el resto se queda en el deck

    setShieldArea(() => {
        return initialShield;
    });

    setDeck(() => {
        return remainingDeck;
    });
};

export const baseTokenAdd = async(setBaseArea) =>{
    try {
        const response = await fetch(import.meta.env.VITE_BACKEND_URL+"/api/recuperarBaseToken");
        const data = await response.json();
        setBaseArea(data[0])
    } catch (error) {
        console.error("Error al recuperar el token base: ",error)
    }
}

export const addResource = (setResources) => {
    setResources(prev => [...prev, { active: true, ex: false }]);
};

export const removeExResource = (setResources) => {
    setResources(prev => {
        const idx = prev.findIndex(r => r.ex === true);
        if (idx === -1) return prev;
            return [...prev.slice(0, idx), ...prev.slice(idx + 1)];
        });
};

export const addResourceEx = (setResources)=> {
    setResources(prev => [...prev, { active: true, ex: true }]);
}

export const drawCard = (deck, setDeck, setHand, quantity, handRef) => {
    const drawnCards = deck.slice(0, quantity);
    const remainingDeck = deck.slice(quantity);

    setDeck(remainingDeck);
    setHand((prevHand) => {
        const updatedHand = [...prevHand, ...drawnCards];
        handRef.current = updatedHand;
        return updatedHand;
    });

    return { drawnCards, remainingDeck };
};

export const nextTurn = (setCurrentPlayer, players) => {
    setCurrentPlayer(prev => {
    
        const idx = players.indexOf(prev);
    
        const nextIdx = (idx + 1) % players.length;
    
        return players[nextIdx];
    });
};

export const onPlay = (card, hand, setHand, battleCards, setBattleCards, currentPlayer, setMyResources, myResources) =>{
    console.log("ID de la carta jugada:", card);

    // 1) Comprobar si es tu turno para jugar cartas
    if (currentPlayer !== localStorage.getItem("user")) {
        alert("No es tu turno");
        return
    }; // no es tu turno
    
    // 2) Comprobar si la carta es de tipo unidad, comando, base o piloto
    if(card.card_type === "unit"){
        console.log("Mis recursos: ", myResources.length);
        // 2.1) Comprobar si la carta es jugable, tanto si se dispone del nivel para jugar como de los recursos necesarios
        if(card.level > myResources.length) {
            alert("Nivel insuficiente para jugar esta carta");
            return
        }
        if(card.cost > myResources.filter(r => r.active).length) {
            alert("Recursos insuficientes para jugar esta carta");
            return
        } // no se puede jugar por falta de recursos
        // 2.2) Comprobar si hay espacio en la batalla
        if (battleCards.length == 6) return; // no se puede jugar más cartas en batalla
        const idx = hand.findIndex(c =>
            c.id_coleccion === card.id_coleccion &&
            c.id_carta    === card.id_carta
        );
        if (idx === -1) return; // no encontrada
        
        // 2) crear copia y eliminar sólo esa posición
        const newHand = [...hand];
        newHand.splice(idx, 1);
        setHand(newHand);

        const newBattle   = [...battleCards, card];
        setBattleCards(newBattle);

        // 3) Actualizar recursos
        const newResources = [...myResources];

        gastarRecursos(card.cost, newResources, setMyResources);

    }
    else if(card.card_type === "command"){}
    else if(card.card_type === "base"){}
    else if(card.card_type === "pilot"){}



}
export const sendTrash = (card, hand, setHand, trash, setTrash) => {
    console.log("ID de la carta enviada a la basura:", card);
    const idx = hand.findIndex(c =>
        c.id_coleccion === card.id_coleccion &&
        c.id_carta    === card.id_carta
    );
      if (idx === -1) return; // no encontrada
    
      // 2) crear copia y eliminar sólo esa posición
    const newHand = [...hand];
    newHand.splice(idx, 1);
    setHand(newHand);

    const newTrash   = [...trash, card];
    setTrash(newTrash);
}
export const nextPhase = (  
    hasRunSetup,
    setupPhaseIndex,
    turnPhaseIndex,
    setHasRunSetup,
    setSetupPhaseIndex,
    setTurnPhaseIndex,
    nextTurn) => {

    if (!hasRunSetup) {
      // Avanzar dentro de setup
        if (setupPhaseIndex < PHASES_SETUP.length - 1) {
            setSetupPhaseIndex(i => i + 1);
        } else {
            // Terminó setup: pasa al ciclo normal
            setHasRunSetup(true);
            setTurnPhaseIndex(0);
        }
        } else {
        // Avanzar dentro del turno normal
        if (turnPhaseIndex < PHASES.length - 1) {
            setTurnPhaseIndex(i => i + 1);
        } else {
            // terminaste END_PHASE: vuelve a DRAW_PHASE del siguiente turno
            setTurnPhaseIndex(0);
            // aquí también podrías disparar change of turn
            nextTurn();
        }
    }
}

function gastarRecursos(coste, myResources, setMyResources) {
    const result = [...myResources];

    // Paso 1: desactivar recursos normales activos
    for (let i = 0; i < result.length && coste > 0; i++) {
        if (!result[i].ex && result[i].active) {
        result[i].active = false;
        coste--;
        }
    }

    // Paso 2: eliminar recursos ex si aún queda coste
    for (let i = result.length - 1; i >= 0 && coste > 0; i--) {
        if (result[i].ex) {
        result.splice(i, 1);
        coste--;
        }
    }
    console.log("Recursos después de gastar:", result);
    setMyResources(result);
}
