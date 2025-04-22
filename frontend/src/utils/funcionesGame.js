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
        console.log("Deck restante ",remainingDeck.length,":", remainingDeck);

        return initialHand; // <-- Devuelve la mano directamente
    } catch (error) {
        console.error("Error al inicializar el mazo:", error);
        return []; // Por si falla, que no pete
    }
};


export const shieldAdd = (setShieldArea, setDeck, currentDeck) => {
    console.log("Deck actual:", currentDeck);
    const initialShield = currentDeck.slice(0, 6);      // las primeras 6 cartas para el escudo
    const remainingDeck = currentDeck.slice(6);         // el resto se queda en el deck

    setShieldArea(() => {
        console.log("Cartas en los escudos:", initialShield);
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

export const addResourceEx = (setResources)=> {
    setResources(prev => [...prev, { active: true, ex: true }]);
}

export const drawCard = (deck, setDeck, setHand, cuantiti) => {
    const drawnCards = deck.slice(0, cuantiti); 
    const remainingDeck = deck.slice(cuantiti);
    setDeck(remainingDeck);
    setHand((prevHand) => [...prevHand, ...drawnCards]); 
    console.log("Cartas en la mano:", drawnCards);
    return { drawnCards, remainingDeck };
}