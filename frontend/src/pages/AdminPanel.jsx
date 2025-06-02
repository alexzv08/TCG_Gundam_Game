import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../style/AdminPanel.css'; // Asegúrate de tener un archivo CSS para estilos

function AdminPanel() {
    // Estados principales
    const [cards, setCards] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    // Estados para filtrado y búsqueda
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState('all');
    // Añade esta línea junto a los otros estados de filtrado
    const [filterCollection, setFilterCollection] = useState('all');

    // Estado para nueva carta con todos los campos
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
        linkType: '', // 'specific', 'trait', o 'zone'
        linkValue: '' // id_carta, nombre de trait, o nombre de zona
    });
    
    // Estado para efectos
    const [selectedCard, setSelectedCard] = useState(null);
    const [newEffect, setNewEffect] = useState({
        triggers: [],
        action: '',
        params: {}
    });
    
    // Opciones predefinidas
    const triggerOptions = [
        { value: 'DEPLOY', label: 'Al Desplegar' },
        { value: 'DESTROYED', label: 'Al ser Destruido' },
        { value: 'DURING_PAIR', label: 'Durante Emparejamiento' },
        { value: 'WHEN_PAIRED', label: 'Cuando se Empareja' },
        { value: 'ACTION', label: 'Acción' },
        { value: 'END_OF_TURN', label: 'Final del Turno' },
        { value: 'OPPONENT_ATTACK', label: 'Ataque del Oponente' }
    ];
    
    const actionOptions = [
        { value: 'DRAW', label: 'Robar Cartas', params: ['amount'] },
        { value: 'ADD_EX_RESOURCE', label: 'Añadir Recursos EX', params: ['amount'] },
        { value: 'BOOST_AP', label: 'Aumentar AP', params: ['amount', 'target'] },
        { value: 'BOOST_HP', label: 'Aumentar HP', params: ['amount', 'target'] },
        { value: 'RETURN_TO_HAND', label: 'Devolver a la Mano', params: ['target', 'hpThreshold'] },
        { value: 'DEPLOY_TOKEN', label: 'Desplegar Token', params: ['tokenName', 'tokenTrait', 'tokenAP', 'tokenHP', 'rested'] },
        { value: 'LINK', label: 'Link con Piloto/Unidad', params: ['linkType', 'linkValue', 'linkEffect', 'linkBonus'] },
    ];
    
    const cardTypes = ['UNIT', 'PILOT', 'COMMAND', 'BASE', 'RESOURCE'];
    const colorOptions = ['RED', 'BLUE', 'GREEN', 'WHITE', 'PURPLE'];
    
    // Cargar cartas al montar el componente
    useEffect(() => {
        fetchCards();
    }, []);
    
    // Añade esto en useEffect después de filtrar las cartas
    useEffect(() => {
    // Si la carta seleccionada ya no está en las cartas filtradas, limpia la selección
    if (selectedCard && !filteredCards.some(card => card.id_carta === selectedCard.id_carta)) {
        setSelectedCard(null);
    }
    }, [filterCollection, filterType, searchTerm, cards]);

    const fetchCards = async () => {
        try {
        setLoading(true);
        setError(null);
        
        const response = await axios.get('/api/admin/cards');
        console.log('Respuesta de la API:', response.data);
        console.log('Tipo de datos:', typeof response.data);
        console.log('¿Es un array?', Array.isArray(response.data));
        
        if (Array.isArray(response.data)) {
            setCards(response.data);
        } else {
            console.error('La respuesta no es un array:', response.data);
            setCards([]);
            setError('Error: La respuesta del servidor no tiene el formato esperado (debe ser un array)');
        }
        } catch (err) {
        console.error('Error cargando cartas:', err);
        setCards([]);
        setError(`Error cargando cartas: ${err.message}`);
        } finally {
        setLoading(false);
        }
    };
    
    // Manejar añadir nueva carta
    const handleAddCard = async (e) => {
        e.preventDefault();
        try {
        setError(null);
        
        // Verificación de campos obligatorios
        if (!newCard.id_juego || !newCard.id_coleccion || !newCard.id_carta || !newCard.card_name) {
            setError('Los campos ID Juego, ID Colección, ID Carta y Nombre son obligatorios');
            return;
        }
        
        await axios.post('/api/admin/cards', newCard);
        
        // Resetear formulario después de añadir
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
            artist: ''
        });
        
        // Recargar cartas
        await fetchCards();
        } catch (err) {
        console.error('Error añadiendo carta:', err);
        setError('Error añadiendo carta: ' + (err.response?.data?.error || err.message));
        }
    };

    // Filtrar cartas para mostrar
    const filteredCards = Array.isArray(cards) ? cards.filter(card => {
    const matchesSearch = card.card_name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                        card.id_carta?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || card.card_type === filterType;
    const matchesCollection = filterCollection === 'all' || card.id_coleccion === filterCollection;
    return matchesSearch && matchesType && matchesCollection;
    }) : [];

    // Obtener colecciones únicas para el filtro (añade esto después de filteredCards)
    const uniqueCollections = Array.isArray(cards) ? 
    [...new Set(cards.map(card => card.id_coleccion))].filter(Boolean).sort() : [];


    // Manejar cambios en formulario de carta
    const handleCardInputChange = (e) => {
        const { name, value } = e.target;
        setNewCard(prev => ({
        ...prev,
        [name]: ['ap', 'hp', 'cost', 'level'].includes(name) ? 
            (value === '' ? null : parseInt(value) || 0) : value
        }));
    };
    
    // Manejar añadir efecto
    const handleAddEffect = async (e) => {
        e.preventDefault();
        if (!selectedCard) return;
        
        try {
        setError(null);
        await axios.post(`/api/admin/cards/${selectedCard.id_carta}/effects`, newEffect);
        
        // Resetear formulario
        setNewEffect({ triggers: [], action: '', params: {} });
        
        // Recargar cartas
        await fetchCards();
        } catch (err) {
        console.error('Error añadiendo efecto:', err);
        setError('Error añadiendo efecto: ' + (err.response?.data?.error || err.message));
        }
    };
    
    // Manejar eliminar efecto
    const handleDeleteEffect = async (cardId, effectId) => {
        if (!window.confirm('¿Estás seguro de eliminar este efecto?')) return;
        
        try {
        setError(null);
        await axios.delete(`/api/admin/cards/<span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mrow><mi>c</mi><mi>a</mi><mi>r</mi><mi>d</mi><mi>I</mi><mi>d</mi></mrow><mi mathvariant="normal">/</mi><mi>e</mi><mi>f</mi><mi>f</mi><mi>e</mi><mi>c</mi><mi>t</mi><mi>s</mi><mi mathvariant="normal">/</mi></mrow><annotation encoding="application/x-tex">{cardId}/effects/</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:1em;vertical-align:-0.25em;"></span><span class="mord"><span class="mord mathnormal">c</span><span class="mord mathnormal">a</span><span class="mord mathnormal" style="margin-right:0.02778em;">r</span><span class="mord mathnormal">d</span><span class="mord mathnormal" style="margin-right:0.07847em;">I</span><span class="mord mathnormal">d</span></span><span class="mord">/</span><span class="mord mathnormal">e</span><span class="mord mathnormal" style="margin-right:0.10764em;">ff</span><span class="mord mathnormal">ec</span><span class="mord mathnormal">t</span><span class="mord mathnormal">s</span><span class="mord">/</span></span></span></span>{effectId}`);
        await fetchCards();
        } catch (err) {
        console.error('Error eliminando efecto:', err);
        setError('Error eliminando efecto: ' + (err.response?.data?.error || err.message));
        }
    };
    
    // Manejar cambio de acción para actualizar los parámetros
    const handleActionChange = (action) => {
        const selectedAction = actionOptions.find(a => a.value === action);
        let defaultParams = {};
        
        // Inicializar parámetros según la acción
        if (selectedAction) {
        selectedAction.params.forEach(param => {
            if (param === 'amount') defaultParams[param] = 1;
            else if (param === 'tokenAP' || param === 'tokenHP') defaultParams[param] = 1;
            else if (param === 'rested') defaultParams[param] = true;
            else if (param === 'target') defaultParams[param] = 'SELF';
            else defaultParams[param] = '';
        });
        }
        
        setNewEffect(prev => ({
        ...prev,
        action,
        params: defaultParams
        }));
    };
    
    // UI para parámetros dinámicos según la acción seleccionada
    const renderParamFields = () => {
    if (!newEffect.action) return null;
    
    const selectedAction = actionOptions.find(a => a.value === newEffect.action);
    if (!selectedAction) return null;
    
    // Manejo especial para la acción LINK
    if (newEffect.action === 'LINK') {
        // Determinar si la carta actual es UNIT o PILOT para mostrar opciones coherentes
        const isUnit = selectedCard?.card_type === 'UNIT';
        const targetType = isUnit ? 'PILOT' : 'UNIT';
        
        return (
        <div className="params-fields">
            <h4>Parámetros de Link</h4>
            
            <div className="form-group">
            <label>Tipo de Link:</label>
            <select
                value={newEffect.params.linkType || ''}
                onChange={e => setNewEffect({
                ...newEffect,
                params: {
                    ...newEffect.params,
                    linkType: e.target.value,
                    // Resetear el valor de link cuando cambias el tipo
                    linkValue: ''
                }
                })}
            >
                <option value="">-- Seleccionar Tipo de Link --</option>
                <option value="SPECIFIC_CARD">Carta Específica</option>
                <option value="TRAIT">Por Trait</option>
                <option value="ZONE">Por Zona</option>
                <option value="ANY">Cualquier {targetType}</option>
            </select>
            </div>
            
            {/* Campos dinámicos según el tipo de link */}
            {newEffect.params.linkType === 'SPECIFIC_CARD' && (
            <div className="form-group">
                <label>Carta para Link:</label>
                <select
                value={newEffect.params.linkValue || ''}
                onChange={e => setNewEffect({
                    ...newEffect,
                    params: {
                    ...newEffect.params,
                    linkValue: e.target.value
                    }
                })}
                >
                <option value="">-- Seleccionar Carta --</option>
                {/* Filtrar cartas compatibles */}
                {cards.filter(c => c.card_type === targetType).map(card => (
                    <option key={card.id_carta} value={card.id_carta}>
                    {card.card_name} ({card.id_carta})
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
                onChange={e => setNewEffect({
                    ...newEffect,
                    params: {
                    ...newEffect.params,
                    linkValue: e.target.value
                    }
                })}
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
                onChange={e => setNewEffect({
                    ...newEffect,
                    params: {
                    ...newEffect.params,
                    linkValue: e.target.value
                    }
                })}
                placeholder={`Zona del ${targetType}`}
                />
            </div>
            )}
            
            {/* Campo para el tipo de efecto */}
            <div className="form-group">
            <label>Efecto de Link:</label>
            <select
                value={newEffect.params.linkEffect || ''}
                onChange={e => setNewEffect({
                ...newEffect,
                params: {
                    ...newEffect.params,
                    linkEffect: e.target.value
                }
                })}
                disabled={!newEffect.params.linkType} // Deshabilitar hasta que se elija un tipo de link
            >
                <option value="">-- Seleccionar Efecto --</option>
                <option value="BOOST_STATS">Incrementar Stats</option>
                <option value="EXTRA_ABILITY">Habilidad Extra</option>
                <option value="DRAW_CARD">Robar Carta</option>
                <option value="COST_REDUCTION">Reducción de Coste</option>
            </select>
            </div>
            
            {/* Campos específicos según el efecto seleccionado */}
            {newEffect.params.linkEffect === 'BOOST_STATS' && (
            <>
                <div className="form-group">
                <label>Bonus AP:</label>
                <input 
                    type="number" 
                    value={newEffect.params.bonusAP || 0}
                    onChange={e => setNewEffect({
                    ...newEffect,
                    params: {
                        ...newEffect.params,
                        bonusAP: parseInt(e.target.value) || 0
                    }
                    })}
                />
                </div>
                
                <div className="form-group">
                <label>Bonus HP:</label>
                <input 
                    type="number" 
                    value={newEffect.params.bonusHP || 0}
                    onChange={e => setNewEffect({
                    ...newEffect,
                    params: {
                        ...newEffect.params,
                        bonusHP: parseInt(e.target.value) || 0
                    }
                    })}
                />
                </div>
            </>
            )}
            
            {newEffect.params.linkEffect === 'EXTRA_ABILITY' && (
            <div className="form-group">
                <label>Descripción de la Habilidad:</label>
                <textarea
                value={newEffect.params.abilityDesc || ''}
                onChange={e => setNewEffect({
                    ...newEffect,
                    params: {
                    ...newEffect.params,
                    abilityDesc: e.target.value
                    }
                })}
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
                onChange={e => setNewEffect({
                    ...newEffect,
                    params: {
                    ...newEffect.params,
                    drawAmount: parseInt(e.target.value) || 1
                    }
                })}
                />
            </div>
            )}
            
            {newEffect.params.linkEffect === 'COST_REDUCTION' && (
            <div className="form-group">
                <label>Reducción de Coste:</label>
                <input 
                type="number" 
                value={newEffect.params.costReduction || 1}
                onChange={e => setNewEffect({
                    ...newEffect,
                    params: {
                    ...newEffect.params,
                    costReduction: parseInt(e.target.value) || 1
                    }
                })}
                />
            </div>
            )}
        </div>
        );
    }
    
    // Para el resto de acciones que no son LINK
    return (
        <div className="params-fields">
        <h4>Parámetros</h4>
        {selectedAction.params.map(param => {
            // Rendering diferente según el tipo de parámetro
            if (param === 'amount' || param === 'tokenAP' || param === 'tokenHP' || param === 'hpThreshold') {
            return (
                <div key={param} className="form-group">
                <label>{param}:</label>
                <input 
                    type="number" 
                    value={newEffect.params[param] || 0}
                    onChange={e => setNewEffect({
                    ...newEffect,
                    params: { 
                        ...newEffect.params, 
                        [param]: parseInt(e.target.value) || 0 
                    }
                    })}
                />
                </div>
            );
            }
            
            if (param === 'rested') {
            return (
                <div key={param} className="form-check">
                <input 
                    type="checkbox" 
                    id="param-rested"
                    checked={!!newEffect.params[param]}
                    onChange={e => setNewEffect({
                    ...newEffect,
                    params: { 
                        ...newEffect.params, 
                        [param]: e.target.checked 
                    }
                    })}
                />
                <label htmlFor="param-rested">¿Agotado?</label>
                </div>
            );
            }
            
            if (param === 'target') {
            return (
                <div key={param} className="form-group">
                <label>Objetivo:</label>
                <select 
                    value={newEffect.params[param] || ''}
                    onChange={e => setNewEffect({
                    ...newEffect,
                    params: { 
                        ...newEffect.params, 
                        [param]: e.target.value 
                    }
                    })}
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
            
            // Para otros parámetros, mostrar campo de texto
            return (
            <div key={param} className="form-group">
                <label>{param}:</label>
                <input 
                type="text" 
                value={newEffect.params[param] || ''}
                onChange={e => setNewEffect({
                    ...newEffect,
                    params: { 
                    ...newEffect.params, 
                    [param]: e.target.value 
                    }
                })}
                />
            </div>
            );
        })}
        </div>
    );
    };

    
    return (
        <div className="admin-panel">
        <h1>Panel de Administración de Cartas</h1>
        
        {/* Mostrar errores */}
        {error && <div className="error-message">{error}</div>}
        
        {/* Filtros y búsqueda */}
        {/* Filtros y búsqueda */}
        <div className="filters">
        <input 
            type="text" 
            placeholder="Buscar por nombre o ID..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
        />
        
        <select 
            value={filterType}
            onChange={e => setFilterType(e.target.value)}
        >
            <option value="all">Todos los tipos</option>
            {cardTypes.map(type => (
            <option key={type} value={type}>{type}</option>
            ))}
        </select>
        
        {/* Nuevo selector de colección */}
        <select 
            value={filterCollection}
            onChange={e => setFilterCollection(e.target.value)}
        >
            <option value="all">Todas las colecciones</option>
            {uniqueCollections.map(collection => (
            <option key={collection} value={collection}>{collection}</option>
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
                        <select 
                        name="card_type"
                        value={newCard.card_type}
                        onChange={handleCardInputChange}
                        >
                        {cardTypes.map(type => (
                            <option key={type} value={type}>{type}</option>
                        ))}
                        </select>
                    </div>
                    
                    <div className="form-group">
                        <label>Color:</label>
                        <select 
                        name="color"
                        value={newCard.color}
                        onChange={handleCardInputChange}
                        >
                        <option value="">-- Seleccionar Color --</option>
                        {colorOptions.map(color => (
                            <option key={color} value={color}>{color}</option>
                        ))}
                        </select>
                    </div>
                    
                    <div className="form-group">
                        <label>Rareza:</label>
                        <select 
                        name="rarity"
                        value={newCard.rarity}
                        onChange={handleCardInputChange}
                        >
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
                
                {/* Nuevo campo específico para el link entre cartas, visible solo para UNIT y PILOT */}
                {(newCard.card_type === 'UNIT' || newCard.card_type === 'PILOT') && (
                <div className="form-group link-field">
                    <label>Link de carta:</label>
                    
                    {/* Selector del tipo de link */}
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
                    
                    {/* Campo que cambia según el tipo de link seleccionado */}
                    {newCard.linkType === 'specific' && (
                    <>
                        {/* Usando un input de texto para el nombre, no un select */}
                        <input
                        type="text"
                        name="linkValue"
                        value={newCard.linkValue || ''}
                        onChange={handleCardInputChange}
                        placeholder={`Introduce el nombre exacto del ${newCard.card_type === 'UNIT' ? 'piloto' : 'Gundam'}`}
                        className="mt-2"
                        list="card-names-list"
                        />
                        
                        {/* Datalist para sugerir nombres existentes */}
                        <datalist id="card-names-list">
                        {cards
                            .filter(c => c.card_type === (newCard.card_type === 'UNIT' ? 'PILOT' : 'UNIT'))
                            // Eliminar duplicados para mostrar solo nombres únicos
                            .filter((card, index, self) => 
                            index === self.findIndex((c) => c.card_name === card.card_name)
                            )
                            .map(card => (
                            <option key={card.id_carta} value={card.card_name}>
                                {card.card_name}
                            </option>
                            ))
                        }
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

                {/* Campo para URL de imagen */}
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
                
                <button type="submit" className="btn-primary">Añadir Carta</button>
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
                const selectedId = e.target.value;
                if (!selectedId) {
                    setSelectedCard(null);
                    return;
                }
                const card = cards.find(c => c.id_carta === selectedId);
                setSelectedCard(card);
                }}
                value={selectedCard?.id_carta || ''}
            >
                <option value="">-- Selecciona una carta --</option>
                {/* Usamos filteredCards en lugar de cards para mostrar solo las cartas filtradas */}
                {filteredCards.map(card => (
                <option key={card.id_carta} value={card.id_carta}>
                    {card.card_name} ({card.id_carta})
                </option>
                ))}
            </select>
            </div>

            
            {selectedCard && (
                <form onSubmit={handleAddEffect}>
                {/* Información de la carta seleccionada */}
                <div className="selected-card-info">
                    <h3>{selectedCard.card_name}</h3>
                    <p><strong>ID:</strong> {selectedCard.id_juego}-{selectedCard.id_coleccion}-{selectedCard.id_carta}</p>
                    <p><strong>Tipo:</strong> {selectedCard.card_type}</p>
                    {selectedCard.translation && (
                    <p><strong>Texto:</strong> {selectedCard.translation}</p>
                    )}
                </div>
                
                {/* Selector de triggers (con multiselección) */}
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
                <div key={card.id_carta} className="card-item">
                    <div className="card-header">
                    <h3>{card.card_name}</h3>
                    <span className="card-id">{card.id_carta}</span>
                    </div>
                    
                    <div className="card-details">
                    <div><strong>ID Completo:</strong> {card.id_juego}-{card.id_coleccion}-{card.id_carta}</div>
                    <div><strong>Tipo:</strong> {card.card_type}</div>
                    <div><strong>Color:</strong> {card.color}</div>
                    
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
                        <img src={card.link} alt={card.card_name} style={{ maxWidth: '100%', maxHeight: '200px' }} />
                        </div>
                    )}
                    </div>
                    
                    <div className="card-effects">
                        <h4>Efectos:</h4>
                        {card.effects && card.effects.length > 0 ? (
                            <ul>
                            {card.effects.map((effect, index) => (
                                <li key={effect.effect_id || index} className="effect-item">
                                <div><strong>Triggers:</strong> {effect.triggers ? effect.triggers.join(', ') : 'No definido'}</div>
                                <div><strong>Acción:</strong> {effect.action || 'No definida'}</div>
                                
                                {/* AQUÍ ES DONDE DEBES AÑADIR EL CÓDIGO PARA LOS EFECTOS DE TIPO LINK */}
                                {effect.action === 'LINK' && effect.params && (
                                    <div className="link-effect-details">
                                    <div>
                                        <strong>Link:</strong> 
                                        {effect.params.linkType === 'SPECIFIC_CARD' && (
                                        <>Carta específica: {effect.params.linkValue}</>
                                        )}
                                        {effect.params.linkType === 'TRAIT' && (
                                        <>Cualquier carta con trait: {effect.params.linkValue}</>
                                        )}
                                        {effect.params.linkType === 'ZONE' && (
                                        <>Cualquier carta de zona: {effect.params.linkValue}</>
                                        )}
                                        {effect.params.linkType === 'ANY' && (
                                        <>Cualquier carta compatible</>
                                        )}
                                    </div>
                                    
                                    <div><strong>Tipo de Efecto:</strong> {effect.params.linkEffect}</div>
                                    
                                    {effect.params.linkEffect === 'BOOST_STATS' && (
                                        <div><strong>Bonus:</strong> +{effect.params.bonusAP || 0} AP, +{effect.params.bonusHP || 0} HP</div>
                                    )}
                                    {effect.params.linkEffect === 'EXTRA_ABILITY' && (
                                        <div><strong>Habilidad:</strong> {effect.params.abilityDesc}</div>
                                    )}
                                    {effect.params.linkEffect === 'DRAW_CARD' && (
                                        <div><strong>Robar:</strong> {effect.params.drawAmount || 1} carta(s)</div>
                                    )}
                                    {effect.params.linkEffect === 'COST_REDUCTION' && (
                                        <div><strong>Reducción de Coste:</strong> -{effect.params.costReduction || 1}</div>
                                    )}
                                    </div>
                                )}
                                
                                {/* El código existente para mostrar los parámetros */}
                                {effect.params && Object.keys(effect.params).length > 0 && effect.action !== 'LINK' && (
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
