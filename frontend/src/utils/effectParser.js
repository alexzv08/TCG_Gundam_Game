// frontend/src/utils/effectParser.js

export const parseEffect = (text) => {
    if (!text) return null;
    
    const effect = {
        triggers: [],      // Puede tener múltiples triggers
        conditions: [],    // Condiciones adicionales
        action: null,      // La acción principal a realizar
        params: {}         // Parámetros para la acción
    };

    // Detectar todos los triggers (pueden ser múltiples)
    const triggerPatterns = [
        { regex: /【Deploy】/i, type: 'DEPLOY' },
        { regex: /【During Pair】/i, type: 'DURING_PAIR' },
        { regex: /【When Paired/i, type: 'WHEN_PAIRED' },
        { regex: /【Action】/i, type: 'ACTION' },
        { regex: /【Destroyed】/i, type: 'DESTROYED' },
        { regex: /<Repair (\d+)>/i, type: 'END_OF_TURN', extractValue: (match) => ({ healAmount: parseInt(match[1]) }) },
        { regex: /<Blocker>/i, type: 'OPPONENT_ATTACK' }
    ];

    // Buscar todos los triggers en el texto
    triggerPatterns.forEach(pattern => {
        const match = text.match(pattern.regex);
        if (match) {
        effect.triggers.push(pattern.type);
        
        // Si el patrón extrae valores, añadirlos a los parámetros
        if (pattern.extractValue) {
            Object.assign(effect.params, pattern.extractValue(match));
        }
        }
    });

    // Detectar la acción principal (lo que hace el efecto)
    const actionPatterns = [
        { 
        regex: /Draw (\d+)/i, 
        action: 'DRAW', 
        extract: (match) => ({ amount: parseInt(match[1]) }) 
        },
        { 
        regex: /Place (\d+) EX Resource/i, 
        action: 'ADD_EX_RESOURCE', 
        extract: (match) => ({ amount: parseInt(match[1]) }) 
        },
        { 
        regex: /all your Units get AP\+(\d+)/i, 
        action: 'BOOST_AP', 
        extract: (match) => ({ amount: parseInt(match[1]), target: 'ALL_FRIENDLY_UNITS' }) 
        },
        { 
        regex: /Choose 1 enemy Unit with (\d+) or less HP and return it to its owner's hand/i, 
        action: 'RETURN_TO_HAND', 
        extract: (match) => ({ hpThreshold: parseInt(match[1]), target: 'ENEMY_UNIT' }) 
        },
        { 
        regex: /Deploy 1 rested \[([^\]]+)\]\(\(([^)]+)\)･AP(\d+)･HP(\d+)\) Unit token/i, 
        action: 'DEPLOY_TOKEN', 
        extract: (match) => ({ 
            tokenName: match[1],
            tokenTrait: match[2],
            tokenAP: parseInt(match[3]),
            tokenHP: parseInt(match[4]),
            rested: true
        }) 
        },
        // Más patrones de acción aquí
    ];

    // Buscar la acción en el texto
    for (const pattern of actionPatterns) {
        const match = text.match(pattern.regex);
        if (match) {
        effect.action = pattern.action;
        if (pattern.extract) {
            Object.assign(effect.params, pattern.extract(match));
        }
        break; // Solo tomamos la primera acción que encontremos
        }
    }

    // Detectar condiciones adicionales
    if (text.includes('(White Base Team) Pilot')) {
        effect.conditions.push('PILOT_WHITE_BASE_TEAM');
    }
    if (text.includes('Lv.4 or Higher Pilot')) {
        effect.conditions.push('PILOT_LV4_PLUS');
    }

    return effect.triggers.length > 0 ? effect : null;
};
