const express = require('express');
const router = express.Router();
const fs = require('fs').promises;
const path = require('path');

// Rutas para los archivos
const cardsPath = path.join(__dirname, '../data/cards.json');
const effectsPath = path.join(__dirname, '../data/effects.json');

// Helper para leer archivos JSON
async function readJsonFile(filePath, defaultValue = []) {
    try {
        const data = await fs.readFile(filePath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error(`Error leyendo ${filePath}:`, error);
        return defaultValue;
    }
}

// Helper para escribir archivos JSON
async function writeJsonFile(filePath, data) {
    try {
        const dirPath = path.dirname(filePath);
        await fs.mkdir(dirPath, { recursive: true });
        await fs.writeFile(filePath, JSON.stringify(data, null, 2));
        return true;
    } catch (error) {
        console.error(`Error escribiendo ${filePath}:`, error);
        return false;
    }
}

// GET todas las cartas con sus efectos
router.get('/cards', async (req, res) => {
    try {
        const cards = await readJsonFile(cardsPath);
        const effects = await readJsonFile(effectsPath);

        // Crear un mapa de efectos usando la clave única: id_coleccion-id_carta
        const effectsByCardKey = {};
        effects.forEach(item => {
            // item.card_id ya es la clave única (por ejemplo: "1-1")
            effectsByCardKey[item.card_id] = item.effects;
        });

        // Añadir efectos a cada carta usando la misma clave
        const cardsWithEffects = cards.map(card => {
            const key = `${card.id_coleccion}-${card.id_carta}`;
            return {
                ...card,
                effects: effectsByCardKey[key] || []
            };
        });

        res.json(cardsWithEffects);
    } catch (error) {
        console.error('Error obteniendo cartas:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});


// POST crear nueva carta
router.post('/cards', async (req, res) => {
    try {
        const newCard = req.body;
        if (!newCard.id_carta) {
            return res.status(400).json({ error: 'ID de carta obligatorio' });
        }

        const cards = await readJsonFile(cardsPath);
        cards.push(newCard);
        await writeJsonFile(cardsPath, cards);

        res.status(201).json({ message: 'Carta creada' });
    } catch (error) {
        res.status(500).json({ error: 'Error interno' });
    }
});

// POST añadir efecto a carta
router.post('/cards/:id/effects', async (req, res) => {
    try {
        const cardId = req.params.id;
        const newEffect = req.body;

        // Validar datos
        if (!newEffect.triggers || !newEffect.action) {
            return res.status(400).json({ error: 'Datos incompletos' });
        }

        // Añadir ID único al efecto
        newEffect.effect_id = `effect_${Date.now()}`;

        // Guardar efecto
        const effects = await readJsonFile(effectsPath);
        const existingEffectIndex = effects.findIndex(e => e.card_id === cardId);

        if (existingEffectIndex >= 0) {
            effects[existingEffectIndex].effects.push(newEffect);
        } else {
            effects.push({
                card_id: cardId,
                effects: [newEffect]
            });
        }

        await writeJsonFile(effectsPath, effects);
        res.status(201).json({ message: 'Efecto añadido' });
    } catch (error) {
        res.status(500).json({ error: 'Error interno' });
    }
});

// DELETE eliminar efecto
router.delete('/cards/:cardId/effects/:effectId', async (req, res) => {
    try {
        const { cardId, effectId } = req.params;

        const effects = await readJsonFile(effectsPath);
        const cardEffectIndex = effects.findIndex(e => e.card_id === cardId);

        if (cardEffectIndex >= 0) {
            effects[cardEffectIndex].effects = effects[cardEffectIndex].effects
                .filter(e => e.effect_id !== effectId);

            // Si no quedan efectos, eliminar entrada
            if (effects[cardEffectIndex].effects.length === 0) {
                effects.splice(cardEffectIndex, 1);
            }

            await writeJsonFile(effectsPath, effects);
        }

        res.json({ message: 'Efecto eliminado' });
    } catch (error) {
        res.status(500).json({ error: 'Error interno' });
    }
});

module.exports = router;
