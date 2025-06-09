import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../style/AdminPanel.css';

function AdminPanel() {
    // Estados principales
    const [cards, setCards] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Estados para filtrado y búsqueda
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState('all');
    const [filterCollection, setFilterCollection] = useState('all');

    // Estado para nueva carta
    const [newCard, setNewCard] = useState({
        id_juego: 'GD',
        id_coleccion: '',
        id_carta: '',
        card_name: '',
        level: 0,
        cost: 0,
        card_type: 'UNIT',
        ap: 0,
        hp: 0,
        color: '',
        link: '',
        trait: '',
        zone: '',
        alt: '',
        translation: '',
        rarity: '',
        show_name: '',
        subtitle: '',
        artist: '',
        linkType: '',
        linkValue: ''
    });

    // Estado para efectos
    const [selectedCard, setSelectedCard] = useState(null);
    const [newEffect, setNewEffect] = useState({
        triggers: [],
        action: '',
        params: {}
    });

    // Opciones de triggers (multiselección)
    const triggerOptions = [
        { value: 'DEPLOY', label: 'Al Desplegar' },
        { value: 'DESTROYED', label: 'Al ser Destruido' },
        { value: 'DURING_PAIR', label: 'Durante Emparejamiento' },
        { value: 'WHEN_PAIRED', label: 'Cuando se Empareja' },
        { value: 'ACTION_STEP', label: 'Acción' },
        { value: 'END_OF_TURN', label: 'Final del Turno' },
        { value: 'OPPONENT_ATTACK', label: 'Ataque del Oponente' }
    ];
    // Opciones de Keywords
    const keywordOptions = [
        { value: 'REPAIR', label: 'REPAIR' },
        { value: 'BREACH', label: 'BREACH' },
        { value: 'SUPPORT', label: 'SUPPORT' },
        { value: 'BLOCKER', label: 'BLOCKER' },
        { value: 'FIRST_STRIKE', label: 'FIRST_STRIKE' },
        { value: 'HIGH_MANEUVER', label: 'HIGH_MANEUVER' },
    ];
    // Opciones de acciones (solo acciones ejecutables)
    const actionOptions = [
        { value: 'MULTIPLE', label: 'Múltiple', params: [] },
        { value: 'CONDITIONAL', label: 'CONDITIONAL', params: [] },
        { value: 'DRAW', label: 'Robar Cartas', params: ['amount'] },
        { value: 'ADD_EX_RESOURCE', label: 'Añadir Recursos EX', params: ['amount'] },
        { value: 'BOOST_AP', label: 'Aumentar AP', params: ['amount', 'target'] },
        { value: 'BOOST_HP', label: 'Aumentar HP', params: ['amount', 'target'] },
        { value: 'RETURN_TO_HAND', label: 'Devolver a la Mano', params: ['target', 'hpThreshold'] },
        { value: 'DEPLOY_TOKEN', label: 'Desplegar Token', params: ['tokenName', 'tokenTrait', 'tokenAP', 'tokenHP', 'rested'] },
        { value: 'LINK', label: 'Link con Piloto/Unidad', params: ['linkType', 'linkValue', 'linkEffect', 'linkBonus'] },
        { value: 'SELECT_UNIT', label: 'Elegir Unidad con Condición', params: ['target', 'hpMax', 'apMax'] },

        // Keyword Effects
        { value: 'REPAIR', label: 'Repair', params: ['amount'] },
        { value: 'BREACH', label: 'Breach', params: ['amount'] },
        { value: 'SUPPORT', label: 'Support', params: ['amount'] },
        { value: 'BLOCKER', label: 'Blocker', params: [] },
        { value: 'FIRST_STRIKE', label: 'First Strike', params: [] },
        { value: 'HIGH_MANEUVER', label: 'High Maneuver', params: [] },
        // Otros
        { value: 'ACTIVATE_MAIN', label: 'Activate · Main', params: ['condition', 'effectText'] },
        { value: 'ACTIVATE_ACTION', label: 'Activate · Action', params: ['condition', 'effectText'] },
        { value: 'BURST', label: 'Burst', params: ['effectText'] },
        { value: 'DEPLOY', label: 'Deploy', params: ['effectText'] },
        { value: 'ATTACK', label: 'Attack', params: ['effectText'] },
        { value: 'DESTROYED', label: 'Destroyed', params: ['effectText'] },
        { value: 'DURING_PAIR', label: 'During Pair', params: ['qualifications', 'effectText'] },
        { value: 'ONCE_PER_TURN', label: 'Once per Turn', params: [] }
    ];

    const cardTypes = ['UNIT', 'PILOT', 'COMMAND', 'BASE', 'RESOURCE'];
    const colorOptions = ['RED', 'BLUE', 'GREEN', 'WHITE', 'PURPLE'];

    // Extraer todos los traits de pilotos para la condición WHEN_PAIRED
    const pilotTraits = Array.isArray(cards)
        ? [...new Set(
            cards
            .filter(c => c.card_type === 'PILOT' && c.trait)
            .map(c => c.trait.trim())
            .filter(Boolean)
        )]
        : [];

    // Cargar cartas al montar el componente
    useEffect(() => {
        fetchCards();
    }, []);

    // Si la carta seleccionada ya no existe en la lista filtrada, cancelar selección
    useEffect(() => {
        if (selectedCard && !filteredCards.some(card => card.id_carta === selectedCard.id_carta)) {
        setSelectedCard(null);
        }
    }, [filterCollection, filterType, searchTerm, cards]);

    const fetchCards = async () => {
        try {
        setLoading(true);
        setError(null);

        const response = await axios.get('/api/admin/cards');
        if (Array.isArray(response.data)) {
            setCards(response.data);
        } else {
            setCards([]);
            setError('Error: La respuesta del servidor no tiene el formato esperado (debe ser un array)');
        }
        } catch (err) {
        setCards([]);
        setError(`Error cargando cartas: ${err.message}`);
        } finally {
        setLoading(false);
        }
    };

    // -----------------------
    // Añadir nueva carta
    // -----------------------
    const handleAddCard = async (e) => {
        e.preventDefault();
        try {
        setError(null);
        if (!newCard.id_juego || !newCard.id_coleccion || !newCard.id_carta || !newCard.card_name) {
            setError('Los campos ID Juego, ID Colección, ID Carta y Nombre son obligatorios');
            return;
        }
        await axios.post('/api/admin/cards', newCard);
        setNewCard({
            id_juego: '',
            id_coleccion: '',
            id_carta: '',
            card_name: '',
            level: 0,
            cost: 0,
            card_type: 'UNIT',
            ap: 0,
            hp: 0,
            color: '',
            link: '',
            trait: '',
            zone: '',
            alt: '',
            translation: '',
            rarity: '',
            show_name: '',
            subtitle: '',
            artist: '',
            linkType: '',
            linkValue: ''
        });
        await fetchCards();
        } catch (err) {
        setError('Error añadiendo carta: ' + (err.response?.data?.error || err.message));
        }
    };

    // -----------------------
    // Filtrar cartas
    // -----------------------
    const filteredCards = Array.isArray(cards)
        ? cards.filter(card => {
            const matchesSearch =
            card.card_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            card.id_carta?.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesType = filterType === 'all' || card.card_type === filterType;
            const matchesCollection = filterCollection === 'all' || card.id_coleccion === filterCollection;
            return matchesSearch && matchesType && matchesCollection;
        })
        : [];

    const uniqueCollections = Array.isArray(cards)
        ? [...new Set(cards.map(card => card.id_coleccion))].filter(Boolean).sort()
        : [];

    // -----------------------
    // Manejar inputs de nueva carta
    // -----------------------
    const handleCardInputChange = (e) => {
        const { name, value } = e.target;
        setNewCard(prev => ({
        ...prev,
        [name]:
            ['ap', 'hp', 'cost', 'level'].includes(name)
            ? (value === '' ? null : parseInt(value) || 0)
            : value
        }));
    };

    // -----------------------
    // Añadir efecto a una carta seleccionada
    // -----------------------
    const handleAddEffect = async (e) => {
        e.preventDefault();
        if (!selectedCard) return;
        try {
        setError(null);
        await axios.post(`/api/admin/cards/${selectedCard.id_coleccion}-${selectedCard.id_carta}/effects`, newEffect);
        setNewEffect({ triggers: [], action: '', params: {} });
        await fetchCards();
        } catch (err) {
        setError('Error añadiendo efecto: ' + (err.response?.data?.error || err.message));
        }
    };

    // -----------------------
    // Eliminar efecto de una carta
    // -----------------------
    const handleDeleteEffect = async (cardId, effectId) => {
        if (!window.confirm('¿Estás seguro de eliminar este efecto?')) return;
        try {
        setError(null);
        await axios.delete(`/api/admin/cards/${cardId}/effects/${effectId}`);
        await fetchCards();
        } catch (err) {
        setError('Error eliminando efecto: ' + (err.response?.data?.error || err.message));
        }
    };

    // -----------------------
    // Al cambiar la acción, inicializar params
    // -----------------------
    const handleActionChange = (action) => {
        const selectedAction = actionOptions.find(a => a.value === action);
        let defaultParams = {};
        if (selectedAction) {
        selectedAction.params.forEach(param => {
            if (param === 'amount') defaultParams[param] = 1;
            else defaultParams[param] = '';
        });
        }
        setNewEffect(prev => ({
        ...prev,
        action,
        params: defaultParams
        }));
    };

    // -----------------------
    // Actualizar parámetro de efecto
    // -----------------------
    function updateNestedParam(path, key, value) {
        setNewEffect(prev => {
            const updated = { ...prev };
            let target = updated;
            for (const part of path) {
            target[part] = target[part] || {};
            target = target[part];
            }
            target[key] = value;
            return updated;
        });
    }

    // ------------------------------------------
    // Actualizar parámetros de subacción
    // ------------------------------------------
    const updateSubParam = (idx, key, value) => {
        const updated = [...newEffect.subactions];
        updated[idx].params = {
            ...updated[idx].params,
            [key]: value
        };
        setNewEffect({ ...newEffect, subactions: updated });
    };
    // ------------------------------------------
    // Renderizar campos dinámicos según la acción
    // ------------------------------------------
    const renderParamFields = () => {
        if (!newEffect.action) return null;
        const selectedAction = actionOptions.find(a => a.value === newEffect.action);
        if (!selectedAction) return null;

        // Si el trigger incluye WHEN_PAIRED, permitimos añadir condición
        const isWhenPaired = newEffect.triggers.includes('WHEN_PAIRED');

        // Manejo especial para LINK
        if (newEffect.action === 'LINK') {
        const isUnit = selectedCard?.card_type === 'UNIT';
        const targetType = isUnit ? 'PILOT' : 'UNIT';
        return (
            <div className="params-fields">
            <h4>Parámetros de Link</h4>
            <div className="form-group">
                <label>Tipo de Link:</label>
                <select
                value={newEffect.params.linkType || ''}
                onChange={e =>
                    setNewEffect({
                    ...newEffect,
                    params: {
                        ...newEffect.params,
                        linkType: e.target.value,
                        linkValue: ''
                    }
                    })
                }
                >
                <option value="">-- Seleccionar Tipo de Link --</option>
                <option value="SPECIFIC_CARD">Carta Específica</option>
                <option value="TRAIT">Por Trait</option>
                <option value="ZONE">Por Zona</option>
                <option value="ANY">Cualquier {targetType}</option>
                </select>
            </div>

            {newEffect.params.linkType === 'SPECIFIC_CARD' && (
                <div className="form-group">
                <label>Carta para Link:</label>
                <select
                    value={newEffect.params.linkValue || ''}
                    onChange={e =>
                    setNewEffect({
                        ...newEffect,
                        params: {
                        ...newEffect.params,
                        linkValue: e.target.value
                        }
                    })
                    }
                >
                    <option value="">-- Seleccionar Carta --</option>
                    {cards
                    .filter(c => c.card_type === targetType)
                    .map(card => (
                        <option key={`${card.id_coleccion}-${card.id_carta}`} value={`${card.id_coleccion}-${card.id_carta}`}>
                        {card.card_name}({card.id_coleccion}{card.id_carta})
                        </option>
                    ))}
                </select>
                </div>
            )}

            {newEffect.params.linkType === 'TRAIT' && (
                <div className="form-group">
                <label>Trait requerido:</label>
                <input
                    type="text"
                    value={newEffect.params.linkValue || ''}
                    onChange={e =>
                    setNewEffect({
                        ...newEffect,
                        params: {
                        ...newEffect.params,
                        linkValue: e.target.value
                        }
                    })
                    }
                    placeholder={`Trait del ${targetType}`}
                />
                </div>
            )}

            {newEffect.params.linkType === 'ZONE' && (
                <div className="form-group">
                <label>Zona requerida:</label>
                <input
                    type="text"
                    value={newEffect.params.linkValue || ''}
                    onChange={e =>
                    setNewEffect({
                        ...newEffect,
                        params: {
                        ...newEffect.params,
                        linkValue: e.target.value
                        }
                    })
                    }
                    placeholder={`Zona del ${targetType}`}
                />
                </div>
            )}

            <div className="form-group">
                <label>Efecto de Link:</label>
                <select
                value={newEffect.params.linkEffect || ''}
                onChange={e =>
                    setNewEffect({
                    ...newEffect,
                    params: {
                        ...newEffect.params,
                        linkEffect: e.target.value
                    }
                    })
                }
                disabled={!newEffect.params.linkType}
                >
                <option value="">-- Seleccionar Efecto --</option>
                <option value="BOOST_STATS">Incrementar Stats</option>
                <option value="EXTRA_ABILITY">Habilidad Extra</option>
                <option value="DRAW_CARD">Robar Carta</option>
                <option value="COST_REDUCTION">Reducción de Coste</option>
                </select>
            </div>

            {newEffect.params.linkEffect === 'BOOST_STATS' && (
                <>
                <div className="form-group">
                    <label>Bonus AP:</label>
                    <input
                    type="number"
                    value={newEffect.params.bonusAP || 0}
                    onChange={e =>
                        setNewEffect({
                        ...newEffect,
                        params: {
                            ...newEffect.params,
                            bonusAP: parseInt(e.target.value) || 0
                        }
                        })
                    }
                    />
                </div>
                <div className="form-group">
                    <label>Bonus HP:</label>
                    <input
                    type="number"
                    value={newEffect.params.bonusHP || 0}
                    onChange={e =>
                        setNewEffect({
                        ...newEffect,
                        params: {
                            ...newEffect.params,
                            bonusHP: parseInt(e.target.value) || 0
                        }
                        })
                    }
                    />
                </div>
                </>
            )}

            {newEffect.params.linkEffect === 'EXTRA_ABILITY' && (
                <div className="form-group">
                <label>Descripción de la Habilidad:</label>
                <textarea
                    value={newEffect.params.abilityDesc || ''}
                    onChange={e =>
                    setNewEffect({
                        ...newEffect,
                        params: {
                        ...newEffect.params,
                        abilityDesc: e.target.value
                        }
                    })
                    }
                    rows="3"
                />
                </div>
            )}

            {newEffect.params.linkEffect === 'DRAW_CARD' && (
                <div className="form-group">
                <label>Número de Cartas:</label>
                <input
                    type="number"
                    value={newEffect.params.drawAmount || 1}
                    onChange={e =>
                    setNewEffect({
                        ...newEffect,
                        params: {
                        ...newEffect.params,
                        drawAmount: parseInt(e.target.value) || 1
                        }
                    })
                    }
                />
                </div>
            )}

            {newEffect.params.linkEffect === 'COST_REDUCTION' && (
                <div className="form-group">
                <label>Reducción de Coste:</label>
                <input
                    type="number"
                    value={newEffect.params.costReduction || 1}
                    onChange={e =>
                    setNewEffect({
                        ...newEffect,
                        params: {
                        ...newEffect.params,
                        costReduction: parseInt(e.target.value) || 1
                        }
                    })
                    }
                />
                </div>
            )}
            </div>
        );
        }
        // Manejo especial para MULTIPLE (efectos compuestos)
        if (newEffect.action === 'MULTIPLE') {
        return (
            <div className="subactions-container">
            <h5>Subacciones:</h5>
            {(newEffect.subactions || []).map((sub, idx) => (
                <div key={idx} className="subaction-item">
                <select
                    value={sub.action}
                    onChange={e => {
                    const updated = [...newEffect.subactions];
                    updated[idx].action = e.target.value;
                    updated[idx].params = {}; // Reiniciar parámetros
                    setNewEffect({ ...newEffect, subactions: updated });
                    }}
                >
                    <option value="">-- Acción --</option>
                    {actionOptions
                    .filter(opt => opt.value !== 'MULTIPLE') // Evitar recursividad
                    .map(opt => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                </select>

                {/* Render de parámetros de cada subacción */}
                {sub.action && (
                    <>
                    {sub.action === 'SELECT_UNIT' && (
                        <div className="select-unit-options">
                            <label>Tipo de unidad objetivo:</label>
                            <select
                            value={sub.params?.targetType || ''}
                            onChange={e => updateSubParam(idx, 'targetType', e.target.value)}
                            >
                            <option value="">-- Selecciona tipo --</option>
                            <option value="ANY">Cualquiera</option>
                            <option value="ALLY">Aliada</option>
                            <option value="ENEMY">Enemiga</option>
                            <option value="ALL_ALLY">Todas las aliadas</option>
                            <option value="ALL_ENEMY">Todas las enemigas</option>
                            <option value="ALL">Todas las unidades</option>
                            </select>

                            <label>Filtro por Trait:</label>
                            <input
                            type="text"
                            value={sub.params?.trait || ''}
                            onChange={e => updateSubParam(idx, 'trait', e.target.value)}
                            />

                            <label>Filtro HP (ej: {'<=2'}):</label>
                            <input
                            type="text"
                            value={sub.params?.hpFilter || ''}
                            onChange={e => updateSubParam(idx, 'hpFilter', e.target.value)}
                            />

                            <label>Filtro AP (ej: {'>=3'}):</label>
                            <input
                            type="text"
                            value={sub.params?.apFilter || ''}
                            onChange={e => updateSubParam(idx, 'apFilter', e.target.value)}
                            />

                            <label>Estado de la unidad:</label>
                            <select
                            value={sub.params?.state || ''}
                            onChange={e => updateSubParam(idx, 'state', e.target.value)}
                            >
                            <option value="">-- Cualquiera --</option>
                            <option value="RESTED">Descansada</option>
                            <option value="ACTIVE">Activa</option>
                            </select>

                            <label>Acción sobre la unidad:</label>
                            <select
                                value={sub.params?.subeffect || ''}
                                onChange={e => updateSubParam(idx, 'subeffect', e.target.value)}
                                >
                                <option value="">-- Acción --</option>
                                <option value="REST">Restar</option>
                                <option value="UNREST">Despertar</option>
                                <option value="RETURN_TO_HAND">Devolver a la Mano</option>
                                <option value="BOOST_AP">+AP</option>
                                <option value="BOOST_HP">+HP</option>
                                <option value="REDUCE_AP">-AP</option>
                                <option value="REDUCE_HP">-HP</option>
                                <option value="ADD_KEYWORD">Añadir Keyword</option>
                            </select>
                            {sub.params?.subeffect === 'ADD_KEYWORD' && (
                                <>
                                    <label>Keyword a añadir:</label>
                                    <select
                                    value={sub.params?.keyword || ''}
                                    onChange={e => updateSubParam(idx, 'keyword', e.target.value)}
                                    >
                                    <option value="">-- Selecciona un keyword --</option>
                                    {keywordOptions.map(opt => (
                                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                                    ))}
                                    </select>
                                </>
                            )}
                        </div>
                        )}

                    </>
                )}

                <button type="button" onClick={() => {
                    const updated = [...newEffect.subactions];
                    updated.splice(idx, 1);
                    setNewEffect({ ...newEffect, subactions: updated });
                }}>
                    Eliminar subacción
                </button>
                </div>
            ))}

            <button type="button" onClick={() => {
                const updated = [...(newEffect.subactions || []), { action: '', params: {} }];
                setNewEffect({ ...newEffect, subactions: updated });
            }}>
                + Añadir subacción
            </button>
            </div>
        );
        }
        if (newEffect.action === 'SELECT_UNIT') {
        return (
            <div className="form-group">
            <label>Tipo de unidad a elegir:</label>
            <select
                value={newEffect.params?.targetType || ''}
                onChange={(e) =>
                setNewEffect({
                    ...newEffect,
                    params: {
                    ...newEffect.params,
                    targetType: e.target.value
                    }
                })
                }
            >
                <option value="">-- Selecciona --</option>
                <option value="any">Cualquiera</option>
                <option value="enemy">Enemiga</option>
                <option value="ally">Aliada</option>
            </select>

            <label>Estado de la unidad:</label>
            <select
                value={newEffect.params?.status || ''}
                onChange={(e) =>
                setNewEffect({
                    ...newEffect,
                    params: {
                    ...newEffect.params,
                    status: e.target.value
                    }
                })
                }
            >
                <option value="">-- Cualquiera --</option>
                <option value="rested">Rested</option>
                <option value="unrested">Unrested</option>
            </select>

            <label>Filtro por AP (opcional):</label>
            <input
                type="text"
                placeholder="Ej: <=2, >=4"
                value={newEffect.params?.apFilter || ''}
                onChange={(e) =>
                setNewEffect({
                    ...newEffect,
                    params: {
                    ...newEffect.params,
                    apFilter: e.target.value
                    }
                })
                }
            />

            <label>Filtro por HP (opcional):</label>
            <input
                type="text"
                placeholder="Ej: <=3, >5"
                value={newEffect.params?.hpFilter || ''}
                onChange={(e) =>
                setNewEffect({
                    ...newEffect,
                    params: {
                    ...newEffect.params,
                    hpFilter: e.target.value
                    }
                })
                }
            />
            </div>
        );
        }

        if (newEffect.action === 'CONDITIONAL') {
            return (
                <div className="conditional-container">
                <h5>Condición:</h5>

                <label>Tipo de condición:</label>
                <select
                    value={newEffect.params?.condition?.type || ''}
                    onChange={e =>
                    setNewEffect({
                        ...newEffect,
                        params: {
                        ...newEffect.params,
                        condition: {
                            ...(newEffect.params?.condition || {}),
                            type: e.target.value
                        }
                        }
                    })
                    }
                >
                    <option value="">-- Selecciona condición --</option>
                    <option value="HAS_UNIT_IN_PLAY">Tener una unidad en juego</option>
                    {/* Puedes añadir más condiciones aquí */}
                </select>

                {newEffect.params?.condition?.type === 'HAS_UNIT_IN_PLAY' && (
                    <>
                    <label>Propietario de la unidad:</label>
                    <select
                        value={newEffect.params?.condition?.filters?.owner || ''}
                        onChange={e =>
                        setNewEffect({
                            ...newEffect,
                            params: {
                            ...newEffect.params,
                            condition: {
                                ...newEffect.params.condition,
                                filters: {
                                ...(newEffect.params.condition.filters || {}),
                                owner: e.target.value
                                }
                            }
                            }
                        })
                        }
                    >
                        <option value="">-- Selecciona --</option>
                        <option value="self">Aliado</option>
                        <option value="opponent">Enemigo</option>
                    </select>

                    <label>Trait requerido:</label>
                    <input
                        type="text"
                        value={newEffect.params?.condition?.filters?.trait || ''}
                        onChange={e =>
                        setNewEffect({
                            ...newEffect,
                            params: {
                            ...newEffect.params,
                            condition: {
                                ...newEffect.params.condition,
                                filters: {
                                ...(newEffect.params.condition.filters || {}),
                                trait: e.target.value
                                }
                            }
                            }
                        })
                        }
                    />
                    </>
                )}

                <h5>Subefecto si se cumple la condición:</h5>
                <label>Acción:</label>
                <select
                    value={newEffect.params?.subeffect?.action || ''}
                    onChange={e =>
                    setNewEffect({
                        ...newEffect,
                        params: {
                        ...newEffect.params,
                        subeffect: {
                            action: e.target.value,
                            params: {}
                        }
                        }
                    })
                    }
                >
                    <option value="">-- Selecciona acción --</option>
                    <option value="DRAW">Robar cartas</option>
                    {/* Añade más subacciones aquí si lo deseas */}
                </select>

                {newEffect.params?.subeffect?.action === 'DRAW' && (
                    <>
                    <label>Cantidad:</label>
                    <input
                        type="number"
                        value={newEffect.params?.subeffect?.params?.amount || 1}
                        onChange={e =>
                        setNewEffect({
                            ...newEffect,
                            params: {
                            ...newEffect.params,
                            subeffect: {
                                ...newEffect.params.subeffect,
                                params: {
                                amount: parseInt(e.target.value)
                                }
                            }
                            }
                        })
                        }
                    />
                    </>
                )}
                </div>
            );
        }



        // Para el resto de acciones
        return (
        <div className="params-fields">
            <h4>Parámetros</h4>
            {selectedAction.params.map(param => {
            // 1) Parámetro numérico 'amount'
            if (param === 'amount') {
                return (
                <div key={param} className="form-group">
                    <label>{param}:</label>
                    <input
                    type="number"
                    value={newEffect.params[param] || 0}
                    onChange={e =>
                        setNewEffect({
                        ...newEffect,
                        params: {
                            ...newEffect.params,
                            [param]: parseInt(e.target.value) || 0
                        }
                        })
                    }
                    />
                </div>
                );
            }

            // 2) Parámetro de texto largo 'effectText'
            if (param === 'effectText') {
                return (
                <div key={param} className="form-group">
                    <label>Texto de Efecto:</label>
                    <textarea
                    value={newEffect.params[param] || ''}
                    onChange={e =>
                        setNewEffect({
                        ...newEffect,
                        params: {
                            ...newEffect.params,
                            [param]: e.target.value
                        }
                        })
                    }
                    rows="3"
                    />
                </div>
                );
            }

            // 3) Parámetro 'target'
            if (param === 'target') {
                return (
                <div key={param} className="form-group">
                    <label>Objetivo:</label>
                    <select
                    value={newEffect.params[param] || ''}
                    onChange={e =>
                        setNewEffect({
                        ...newEffect,
                        params: {
                            ...newEffect.params,
                            [param]: e.target.value
                        }
                        })
                    }
                    >
                    <option value="SELF">Esta carta</option>
                    <option value="ALL_FRIENDLY_UNITS">Todas mis unidades</option>
                    <option value="ALL_ENEMY_UNITS">Todas las unidades enemigas</option>
                    <option value="ENEMY_UNIT">Una unidad enemiga</option>
                    <option value="FRIENDLY_UNIT">Una unidad amiga</option>
                    </select>
                </div>
                );
            }

            // 4) Parámetro 'hpThreshold'
            if (param === 'hpThreshold') {
                return (
                <div key={param} className="form-group">
                    <label>{param}:</label>
                    <input
                    type="number"
                    value={newEffect.params[param] || 0}
                    onChange={e =>
                        setNewEffect({
                        ...newEffect,
                        params: {
                            ...newEffect.params,
                            [param]: parseInt(e.target.value) || 0
                        }
                        })
                    }
                    />
                </div>
                );
            }

            // 5) Parámetro 'rested'
            if (param === 'rested') {
                return (
                <div key={param} className="form-check">
                    <input
                    type="checkbox"
                    id="param-rested"
                    checked={!!newEffect.params[param]}
                    onChange={e =>
                        setNewEffect({
                        ...newEffect,
                        params: {
                            ...newEffect.params,
                            [param]: e.target.checked
                        }
                        })
                    }
                    />
                    <label htmlFor="param-rested">¿Agotado?</label>
                </div>
                );
            }

            // 6) Parámetro 'condition' para Activate · Main / Activate · Action
            if (param === 'condition') {
                return (
                <div key={param} className="form-group">
                    <label>Condición:</label>
                    <input
                    type="text"
                    value={newEffect.params[param] || ''}
                    onChange={e =>
                        setNewEffect({
                        ...newEffect,
                        params: {
                            ...newEffect.params,
                            [param]: e.target.value
                        }
                        })
                    }
                    />
                </div>
                );
            }

            // 7) Si está WHEN_PAIRED como trigger, y el parámetro es 'qualifications', mostramos select de pilotTraits
            if (param === 'pairing' && isWhenPaired) {
            return (
                <div key={param} className="form-group">
                <label>Tipo de emparejamiento:</label>
                <select
                    value={newEffect.params.pairType || ''}
                    onChange={e =>
                    setNewEffect({
                        ...newEffect,
                        params: {
                        ...newEffect.params,
                        pairType: e.target.value,
                        pairValue: '' // resetear valor al cambiar tipo
                        }
                    })
                    }
                >
                    <option value="">-- Selecciona tipo --</option>
                    <option value="NAME">Nombre</option>
                    <option value="TRAIT">Trait</option>
                    <option value="ZONE">Zona</option>
                </select>

                {/* Condicional según tipo para mostrar input adecuado */}
                {newEffect.params.pairType === 'TRAIT' && (
                    <>
                    <label>Trait de piloto:</label>
                    <select
                        value={newEffect.params.pairValue || ''}
                        onChange={e =>
                        setNewEffect({
                            ...newEffect,
                            params: {
                            ...newEffect.params,
                            pairValue: e.target.value
                            }
                        })
                        }
                    >
                        <option value="">-- Selecciona un trait de piloto --</option>
                        {pilotTraits.map(tr => (
                        <option key={tr} value={tr}>
                            {tr} Pilot
                        </option>
                        ))}
                    </select>
                    <small className="help-text" style={{ display: 'block', marginTop: '4px' }}>
                        Si no encuentras el trait, escríbelo aquí:
                    </small>
                    <input
                        type="text"
                        placeholder="Otro trait de piloto"
                        value={
                        newEffect.params.pairValue &&
                        !pilotTraits.includes(newEffect.params.pairValue)
                            ? newEffect.params.pairValue
                            : ''
                        }
                        onChange={e =>
                        setNewEffect({
                            ...newEffect,
                            params: {
                            ...newEffect.params,
                            pairValue: e.target.value
                            }
                        })
                        }
                        style={{ marginTop: '4px', width: '100%' }}
                    />
                    </>
                )}

                {newEffect.params.pairType === 'NAME' && (
                    <>
                    <label>Nombre del piloto:</label>
                    <input
                        type="text"
                        placeholder="Nombre exacto del piloto"
                        value={newEffect.params.pairValue || ''}
                        onChange={e =>
                        setNewEffect({
                            ...newEffect,
                            params: {
                            ...newEffect.params,
                            pairValue: e.target.value
                            }
                        })
                        }
                        style={{ marginTop: '4px', width: '100%' }}
                    />
                    </>
                )}

                {newEffect.params.pairType === 'ZONE' && (
                    <>
                    <label>Zona del piloto:</label>
                    <input
                        type="text"
                        placeholder="Zona del piloto"
                        value={newEffect.params.pairValue || ''}
                        onChange={e =>
                        setNewEffect({
                            ...newEffect,
                            params: {
                            ...newEffect.params,
                            pairValue: e.target.value
                            }
                        })
                        }
                        style={{ marginTop: '4px', width: '100%' }}
                    />
                    </>
                )}

                {/* Aquí puedes añadir más inputs para configurar el efecto que se activa */}
                <label>Efecto al emparejar:</label>
                <select
                    value={newEffect.params.pairEffect || ''}
                    onChange={e =>
                    setNewEffect({
                        ...newEffect,
                        params: {
                        ...newEffect.params,
                        pairEffect: e.target.value
                        }
                    })
                    }
                >
                    <option value="">-- Selecciona un efecto --</option>
                    <option value="DRAW">Robar carta</option>
                    <option value="BOOST_STATS">Incrementar Stats</option>
                    {/* Añade más efectos aquí */}
                </select>

                {newEffect.params.pairEffect === 'DRAW' && (
                    <>
                    <label>Número de cartas a robar:</label>
                    <input
                        type="number"
                        min={1}
                        value={newEffect.params.pairDrawAmount || 1}
                        onChange={e =>
                        setNewEffect({
                            ...newEffect,
                            params: {
                            ...newEffect.params,
                            pairDrawAmount: parseInt(e.target.value, 10) || 1
                            }
                        })
                        }
                        style={{ marginTop: '4px', width: '100%' }}
                    />
                    </>
                )}
                </div>
            );
            }


            // 8) Para cualquier otro parámetro (ej. tokenName, tokenTrait, tokenAP, tokenHP, linkType, linkValue, etc.)
            return (
                <div key={param} className="form-group">
                <label>{param}:</label>
                <input
                    type="text"
                    value={newEffect.params[param] || ''}
                    onChange={e =>
                    setNewEffect({
                        ...newEffect,
                        params: {
                        ...newEffect.params,
                        [param]: e.target.value
                        }
                    })
                    }
                />
                </div>
            );
            })}

            {/* Si WHEN_PAIRED es trigger, mostrar también 'amount' si la acción es DRAW */}
            {isWhenPaired && newEffect.action === 'DRAW' && (
            <div className="form-group">
                <label>Amount (cartas a robar):</label>
                <input
                type="number"
                value={newEffect.params.amount || 1}
                onChange={e =>
                    setNewEffect({
                    ...newEffect,
                    params: {
                        ...newEffect.params,
                        amount: parseInt(e.target.value) || 0
                    }
                    })
                }
                />
            </div>
            )}
        </div>
        );
    };

    return (
        <div className="admin-panel">
        <h1>Panel de Administración de Cartas</h1>

        {error && <div className="error-message">{error}</div>}

        {/* Filtros y búsqueda */}
        <div className="filters">
            <input
            type="text"
            placeholder="Buscar por nombre o ID..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            />
            <select value={filterType} onChange={e => setFilterType(e.target.value)}>
            <option value="all">Todos los tipos</option>
            {cardTypes.map(type => (
                <option key={type} value={type}>
                {type}
                </option>
            ))}
            </select>
            <select value={filterCollection} onChange={e => setFilterCollection(e.target.value)}>
            <option value="all">Todas las colecciones</option>
            {uniqueCollections.map(collection => (
                <option key={collection} value={collection}>
                {collection}
                </option>
            ))}
            </select>
        </div>

        <div className="admin-content">
            {/* Sección para añadir nuevas cartas */}
            <section className="add-card-section">
            <h2>Añadir Nueva Carta</h2>
            <form onSubmit={handleAddCard}>
                <div className="form-row">
                <div className="form-group">
                    <label>ID Juego:</label>
                    <input
                    type="text"
                    name="id_juego"
                    value={newCard.id_juego}
                    onChange={handleCardInputChange}
                    required
                    />
                </div>
                <div className="form-group">
                    <label>ID Colección:</label>
                    <input
                    type="text"
                    name="id_coleccion"
                    value={newCard.id_coleccion}
                    onChange={handleCardInputChange}
                    required
                    />
                </div>
                <div className="form-group">
                    <label>ID Carta:</label>
                    <input
                    type="text"
                    name="id_carta"
                    value={newCard.id_carta}
                    onChange={handleCardInputChange}
                    required
                    />
                </div>
                </div>
                <div className="form-row">
                <div className="form-group">
                    <label>Nombre:</label>
                    <input
                    type="text"
                    name="card_name"
                    value={newCard.card_name}
                    onChange={handleCardInputChange}
                    required
                    />
                </div>
                <div className="form-group">
                    <label>Nombre Mostrado:</label>
                    <input
                    type="text"
                    name="show_name"
                    value={newCard.show_name}
                    onChange={handleCardInputChange}
                    />
                </div>
                </div>
                <div className="form-row">
                <div className="form-group">
                    <label>Subtítulo:</label>
                    <input
                    type="text"
                    name="subtitle"
                    value={newCard.subtitle}
                    onChange={handleCardInputChange}
                    />
                </div>
                <div className="form-group">
                    <label>Artista:</label>
                    <input
                    type="text"
                    name="artist"
                    value={newCard.artist}
                    onChange={handleCardInputChange}
                    />
                </div>
                </div>
                <div className="form-row">
                <div className="form-group">
                    <label>Tipo:</label>
                    <select name="card_type" value={newCard.card_type} onChange={handleCardInputChange}>
                    {cardTypes.map(type => (
                        <option key={type} value={type}>
                        {type}
                        </option>
                    ))}
                    </select>
                </div>
                <div className="form-group">
                    <label>Color:</label>
                    <select name="color" value={newCard.color} onChange={handleCardInputChange}>
                    <option value="">-- Seleccionar Color --</option>
                    {colorOptions.map(color => (
                        <option key={color} value={color}>
                        {color}
                        </option>
                    ))}
                    </select>
                </div>
                <div className="form-group">
                    <label>Rareza:</label>
                    <select name="rarity" value={newCard.rarity} onChange={handleCardInputChange}>
                    <option value="">-- Seleccionar Rareza --</option>
                    <option value="C">Común (C)</option>
                    <option value="U">Poco común (U)</option>
                    <option value="R">Raro (R)</option>
                    <option value="SR">Super Raro (SR)</option>
                    <option value="LR">Legend (LR)</option>
                    </select>
                </div>
                </div>
                <div className="form-row">
                <div className="form-group">
                    <label>Nivel:</label>
                    <input
                    type="number"
                    name="level"
                    value={newCard.level || 0}
                    onChange={handleCardInputChange}
                    />
                </div>
                <div className="form-group">
                    <label>Coste:</label>
                    <input
                    type="number"
                    name="cost"
                    value={newCard.cost || 0}
                    onChange={handleCardInputChange}
                    />
                </div>
                <div className="form-group">
                    <label>AP:</label>
                    <input
                    type="number"
                    name="ap"
                    value={newCard.ap || 0}
                    onChange={handleCardInputChange}
                    />
                </div>
                <div className="form-group">
                    <label>HP:</label>
                    <input
                    type="number"
                    name="hp"
                    value={newCard.hp || 0}
                    onChange={handleCardInputChange}
                    />
                </div>
                </div>
                <div className="form-row">
                <div className="form-group">
                    <label>Trait:</label>
                    <input
                    type="text"
                    name="trait"
                    value={newCard.trait || ''}
                    onChange={handleCardInputChange}
                    />
                </div>
                <div className="form-group">
                    <label>Zone:</label>
                    <input
                    type="text"
                    name="zone"
                    value={newCard.zone || ''}
                    onChange={handleCardInputChange}
                    />
                </div>
                <div className="form-group">
                    <label>Alt:</label>
                    <input
                    type="text"
                    name="alt"
                    value={newCard.alt || ''}
                    onChange={handleCardInputChange}
                    />
                </div>
                </div>

                {/* Campo específico para link entre cartas */}
                {(newCard.card_type === 'UNIT' || newCard.card_type === 'PILOT') && (
                <div className="form-group link-field">
                    <label>Link de carta:</label>
                    <select
                    name="linkType"
                    value={newCard.linkType || ''}
                    onChange={handleCardInputChange}
                    >
                    <option value="">-- Sin link --</option>
                    <option value="specific">Nombre específico</option>
                    <option value="trait">Por trait</option>
                    <option value="zone">Por zona</option>
                    </select>
                    {newCard.linkType === 'specific' && (
                    <>
                        <input
                        type="text"
                        name="linkValue"
                        value={newCard.linkValue || ''}
                        onChange={handleCardInputChange}
                        placeholder={`Introduce el nombre exacto del ${
                            newCard.card_type === 'UNIT' ? 'piloto' : 'Gundam'
                        }`}
                        list="card-names-list"
                        />
                        <datalist id="card-names-list">
                        {cards
                            .filter(c =>
                            c.card_type === (newCard.card_type === 'UNIT' ? 'PILOT' : 'UNIT')
                            )
                            .filter((card, index, self) =>
                            index === self.findIndex(c => c.card_name === card.card_name)
                            )
                            .map(card => (
                            <option key={`${card.id_coleccion}-${card.id_carta}`} value={`${card.id_coleccion}-${card.id_carta}`}>
                                {card.card_name}
                            </option>
                            ))}
                        </datalist>
                    </>
                    )}
                    {newCard.linkType === 'trait' && (
                    <input
                        type="text"
                        name="linkValue"
                        value={newCard.linkValue || ''}
                        onChange={handleCardInputChange}
                        placeholder="Introduce el trait"
                        className="mt-2"
                    />
                    )}
                    {newCard.linkType === 'zone' && (
                    <input
                        type="text"
                        name="linkValue"
                        value={newCard.linkValue || ''}
                        onChange={handleCardInputChange}
                        placeholder="Introduce la zona"
                        className="mt-2"
                    />
                    )}
                </div>
                )}

                <div className="form-group">
                <label>URL Imagen:</label>
                <input
                    type="text"
                    name="link"
                    value={newCard.link}
                    onChange={handleCardInputChange}
                />
                </div>
                <div className="form-group">
                <label>Texto (translation):</label>
                <textarea
                    name="translation"
                    value={newCard.translation || ''}
                    onChange={handleCardInputChange}
                    rows="3"
                />
                </div>
                <button type="submit" className="btn-primary">
                Añadir Carta
                </button>
            </form>
            </section>

            {/* Sección para añadir efectos a cartas existentes */}
            <section className="add-effect-section">
            <h2>Añadir Efecto a Carta</h2>

            {/* Selector de carta */}
            <div className="form-group">
                <label>Selecciona una carta:</label>
                <select
                onChange={e => {
                    const selectedValue = e.target.value;
                    if (!selectedValue) {
                    setSelectedCard(null);
                    return;
                    }

                    const [col, id] = selectedValue.split('-');
                    const card = cards.find(c => c.id_coleccion === col && c.id_carta === id);
                    setSelectedCard(card);
                }}
                value={
                    selectedCard
                    ? `${selectedCard.id_coleccion}-${selectedCard.id_carta}`
                    : ''
                }
                >
                <option value="">-- Selecciona una carta --</option>
                {filteredCards.map(card => (
                    <option
                    key={`${card.id_coleccion}-${card.id_carta}`}
                    value={`${card.id_coleccion}-${card.id_carta}`}
                    >
                    {card.card_name} ({card.id_coleccion}-{card.id_carta})
                    </option>
                ))}
                </select>
            </div>

            {selectedCard && (
                <form onSubmit={handleAddEffect}>
                {/* Información de la carta seleccionada */}
                <div className="selected-card-info">
                    <h3>{selectedCard.card_name}</h3>
                    <p>
                    <strong>ID:</strong> {selectedCard.id_juego}-
                    {selectedCard.id_coleccion}-{selectedCard.id_carta}
                    </p>
                    <p>
                    <strong>Tipo:</strong> {selectedCard.card_type}
                    </p>
                    {selectedCard.translation && (
                    <p>
                        <strong>Texto:</strong> {selectedCard.translation}
                    </p>
                    )}
                </div>

                {/* Selector de triggers (multiselección) */}
                <div className="form-group">
                    <fieldset>
                    <legend>Triggers:</legend>
                    {triggerOptions.map(option => (
                        <label key={option.value} className="checkbox-label">
                        <input
                            type="checkbox"
                            value={option.value}
                            checked={newEffect.triggers.includes(option.value)}
                            onChange={e => {
                            const isChecked = e.target.checked;
                            setNewEffect(prev => ({
                                ...prev,
                                triggers: isChecked
                                ? [...prev.triggers, option.value]
                                : prev.triggers.filter(t => t !== option.value)
                            }));
                            }}
                        />
                        {option.label}
                        </label>
                    ))}
                    </fieldset>
                </div>

                {/* Selector de acción */}
                <div className="form-group">
                    <label>Acción:</label>
                    <select
                    value={newEffect.action}
                    onChange={e => handleActionChange(e.target.value)}
                    required
                    >
                    <option value="">-- Selecciona una acción --</option>
                    {actionOptions.map(option => (
                        <option key={option.value} value={option.value}>
                        {option.label}
                        </option>
                    ))}
                    </select>
                </div>

                {/* Campos para parámetros dinámicos */}
                {renderParamFields()}

                {/* Botón para añadir el efecto */}
                <button
                    type="submit"
                    className="btn-primary"
                    disabled={!newEffect.action || newEffect.triggers.length === 0}
                >
                    Añadir Efecto
                </button>
                </form>
            )}
            </section>
        </div>

        {/* Lista de cartas con sus efectos */}
        <section className="cards-list">
            <h2>Cartas {Array.isArray(filteredCards) ? `(${filteredCards.length})` : ''}</h2>

            {loading ? (
            <div className="loading">Cargando cartas...</div>
            ) : !Array.isArray(filteredCards) || filteredCards.length === 0 ? (
            <div className="no-results">No se encontraron cartas</div>
            ) : (
            <div className="cards-grid">
                {filteredCards.map(card => (
                <div key={`${card.id_coleccion}-${card.id_carta}`} className="card-item">
                    <div className="card-header">
                    <h3>{card.card_name}</h3>
                    <span className="card-id">{card.id_carta}</span>
                    </div>

                    <div className="card-details">
                    <div>
                        <strong>ID Completo:</strong> {card.id_juego}-{card.id_coleccion}-{card.id_carta}
                    </div>
                    <div>
                        <strong>Tipo:</strong> {card.card_type}
                    </div>
                    <div>
                        <strong>Color:</strong> {card.color}
                    </div>

                    {(card.level !== undefined || card.ap !== undefined || card.hp !== undefined) && (
                        <div className="card-stats">
                        {card.level !== undefined && <span>Nivel: {card.level}</span>}
                        {card.ap !== undefined && <span>AP: {card.ap}</span>}
                        {card.hp !== undefined && <span>HP: {card.hp}</span>}
                        {card.cost !== undefined && <span>Coste: {card.cost}</span>}
                        </div>
                    )}

                    {card.trait && <div><strong>Trait:</strong> {card.trait}</div>}
                    {card.zone && <div><strong>Zone:</strong> {card.zone}</div>}
                    {card.rarity && <div><strong>Rareza:</strong> {card.rarity}</div>}
                    {card.artist && <div><strong>Artista:</strong> {card.artist}</div>}

                    {card.translation && (
                        <div className="card-text">
                        <strong>Texto:</strong>
                        <p>{card.translation}</p>
                        </div>
                    )}

                    {card.link && (
                        <div className="card-image">
                        <img
                            src={card.link}
                            alt={card.card_name}
                            style={{ maxWidth: '100%', maxHeight: '200px' }}
                        />
                        </div>
                    )}
                    </div>

                    <div className="card-effects">
                        <h4>Efectos:</h4>
                        {card.effects && card.effects.length > 0 ? (
                            <ul>
                            {card.effects.map((effect, index) => (
                                <li key={effect.effect_id || index} className="effect-item">
                                    <div>
                                        <strong>Triggers:</strong> {effect.triggers ? effect.triggers.join(', ') : 'No definido'}
                                    </div>
                                    <div>
                                        <strong>Acción:</strong> {effect.action || 'No definida'}
                                    </div>

                                    {effect.params && Object.keys(effect.params).length > 0 && (
                                        <div className="effect-params">
                                        <strong>Parámetros:</strong>
                                        <pre>{JSON.stringify(effect.params, null, 2)}</pre>
                                        </div>
                                    )}

                                    <button
                                        className="btn-delete-effect"
                                        onClick={() => handleDeleteEffect(card.id_carta, effect.effect_id)}
                                    >
                                        Eliminar
                                    </button>
                                </li>
                            ))}
                            </ul>
                        ) : (
                            <p>Sin efectos</p>
                        )}
                    </div>
                </div>
                ))}
            </div>
            )}
        </section>
        </div>
    );
}

export default AdminPanel;
