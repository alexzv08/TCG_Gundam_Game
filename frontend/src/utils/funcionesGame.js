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
        const response = await fetch("http://localhost:5000/api/recuperarMazo");
        const data = await response.json();

        let generatedDeck = buildDeck(data[0]);
        generatedDeck = shuffleDeck(generatedDeck);

        const { initialHand, remainingDeck } = drawInitialHand(generatedDeck);

        setDeck(remainingDeck);
        setHand(initialHand);
        setDeckInitialized(true);
    } catch (error) {
        console.error("Error al inicializar el mazo:", error);
    }
};

export const shieldAdd = async (setShieldArea,setDeck, deck) => {
    const initialShield = deck.slice(0, 6)
    const remainingDeck = deck.slice(6)

    await setShieldArea(initialShield)
    await setDeck(remainingDeck);
}

export const baseTokenAdd = async(setBaseArea) =>{
    try {
        const response = await fetch("http://localhost:5000/api/recuperarBaseToken");
        const data = await response.json();

        setBaseArea(data[0])
    } catch (error) {
        console.error("Error al recuperar el token base: ",error)
    }
}

export const resourceAdd = async(setResourceArea,setResourceDeck) =>{
    try {
        const response = await fetch("http://localhost:5000/api/recuperarResource");
        const data = await response.json();


        // buildResourceDeck()
        await setResourceDeck(buildResourceDeck(data[0]))
        await setResourceArea(placeExResourceP2(data[0]))
        console.log(data[0][1])
    } catch (error) {
        console.error("Error al recuperar el token base: ",error)
    }
}

const buildResourceDeck = (data)=> {
    console.log(data[1])
    const deckResource = [];
    for (let i = 0; i < 10; i++) {
        deckResource.push({ ...data[1] });
    }
    return deckResource;
}

const placeExResourceP2 = (data)=> {
    console.log(data[0])
    const exResource = []
    exResource.push({ ...data[0] });

    return exResource;
}