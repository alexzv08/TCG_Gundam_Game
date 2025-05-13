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
        const response = await fetch("http://192.168.1.136:5000/api/recuperarMazo");
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
        const response = await fetch("http://192.168.1.136:5000/api/recuperarBaseToken");
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

export const onPlay = (card, hand, setHand, battleCards, setBattleCards, currentPlayer) =>{
    console.log("ID de la carta jugada:", card.card_type);
    if (currentPlayer !== localStorage.getItem("user")) {
        alert("No es tu turno");
        return
    }; // no es tu turno
    if (battleCards.length == 6) return; // no se puede jugar más cartas en batalla

    if(card.card_type === "unit"){
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