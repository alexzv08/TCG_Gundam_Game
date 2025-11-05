import { useState, useEffect, useCallback } from "react";
import PropTypes from 'prop-types';
import Select from 'react-select';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import filtro from '../../assets/svg/filter.svg'; 

// Rango máximo asumido (puedes ajustarlo si tus cartas tienen valores más altos)
const MAX_VALUE = 10; 

// --- Componente de Range Slider Auxiliar ---
const RangeFilter = ({ label, name, range, max, tripe,onChange }) => (
    <div className="w-[200px] p-2 border border-gray-300 rounded-lg bg-[var(--bg-primary)] shadow-sm">
        <label className="block mb-3 text-sm font-semibold text-gray-700">{label}: {range.join(' - ')}</label>
        {/* Usamos RCSlider.Range que es la importación correcta */}
        <Slider range
            min={0}
            max={max}
            step={1}
            value={range} 
            onChange={onChange}
            className="mt-3"
        />
    </div>
);

RangeFilter.propTypes = {
    label: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    range: PropTypes.array.isRequired,
    max: PropTypes.number.isRequired,
    onChange: PropTypes.func.isRequired,
};

// --- Componente principal ---
const FiltroCartas = ({ onFilter, types, colors}) => {

    const DEBOUNCE_DELAY = 300; 

    // 1. INICIALIZACIÓN DE ESTADOS (incluyendo el FIX para showAdvanced)
    const [showAdvanced, setShowAdvanced] = useState(false); 
    
    const [filters, setFilters] = useState({
        name: '',
        type: [],
        color: [],
        apRange: [0, MAX_VALUE],
        hpRange: [0, MAX_VALUE],
        nvRange: [0, MAX_VALUE],
        costRange: [0, MAX_VALUE],
    });

    // Preparación de opciones para react-select
    // Convertir a minúsculas al mapear asegura que la coincidencia sea consistente
    const colorOptions = colors.map(color => ({ value: color.toLowerCase(), label: color }));
    const typeOptions = types.map(type => ({ value: type.toLowerCase(), label: type }));

    // Calcular objetos seleccionados (para la prop 'value' del Select)
    const selectedColorObjects = colorOptions.filter(opt => filters.color.includes(opt.value));
    const selectedTypeObjects = typeOptions.filter(opt => filters.type.includes(opt.value));


    // --- 2. LÓGICA DE FILTRADO AUTOMÁTICO (DEBOUNCE) ---
    const applyFilter = useCallback(() => {
        onFilter(filters);
    }, [filters, onFilter]);

    useEffect(() => {
        const handler = setTimeout(() => {
            applyFilter();
        }, DEBOUNCE_DELAY);

        return () => clearTimeout(handler);
    }, [filters, applyFilter]);


    // --- 3. HANDLERS DE ESTADO ---

    // Handler para INPUTS NATIVOS (ej: name)
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFilters((prevFilters) => ({
            ...prevFilters,
            [name]: value,
        }));
    };

    // Handler genérico para SELECT de selección múltiple (type y color)
    const handleSelectChange = (name) => (selectedOptions) => {
        const newValues = selectedOptions 
            ? selectedOptions.map(option => option.value.toLowerCase()) 
            : [];
        setFilters((prevFilters) => ({
            ...prevFilters,
            [name]: newValues,
        }));
    };

    // Handler genérico para Range Slider
    const handleSliderChange = (name) => (newRange) => {
        setFilters((prevFilters) => ({
            ...prevFilters,
            [name]: newRange,
        }));
    };

    const handleClear = () => {
        const clearedFilters = {
            name: '',
            type: [],
            color: [],
            apRange: [0, MAX_VALUE],
            hpRange: [0, MAX_VALUE],
            nvRange: [0, MAX_VALUE],
            costRange: [0, MAX_VALUE],
        };
        setFilters(clearedFilters);
        // onFilter se llama automáticamente via useEffect
    };
    
    // --- 4. RENDERIZADO ---

    return (
        <div className="flex flex-col w-full p-4 bg-[var(--bg-primary)] rounded-lg shadow-xl filter-container">
            {/* --- FILTROS BÁSICOS (Línea Principal) --- */}
            <div className="flex items-center w-full gap-4">
                {/* INPUT DE NOMBRE */}
                <input 
                    type="text" 
                    name="name" 
                    placeholder="Buscar por Nombre" 
                    value={filters.name}
                    onChange={handleChange}
                    className="w-[300px] p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />

                {/* SELECT para COLORES */}
                <Select 
                    isMulti 
                    name="color" 
                    options={colorOptions} 
                    className="w-[200px]"
                    value={selectedColorObjects} 
                    onChange={handleSelectChange('color')}
                    placeholder="Colores"
                />

                {/* SELECT para TIPOS */}
                <Select 
                    isMulti
                    name="type" 
                    options={typeOptions} 
                    className="w-[200px]"
                    value={selectedTypeObjects} 
                    onChange={handleSelectChange('type')}
                    placeholder="Tipos"
                />

                {/* Botón para Abrir/Cerrar Filtros Avanzados (El botón que fallaba) */}
                <button 
                    onClick={() => setShowAdvanced(!showAdvanced)}
                    className={`flex items-center justify-center p-3 rounded-full transition-colors duration-200 ${showAdvanced ? 'bg-blue-700' : 'bg-blue-600'} hover:bg-blue-700 shadow-md`}
                    title="Filtros Avanzados"
                >
                    <img src={filtro} alt="filtro icono" className="w-5 h-5 invert" />
                </button>
                
                {/* Botón para Limpiar */}
                <button 
                    onClick={handleClear}
                    className="p-2 text-sm text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
                >
                    Limpiar
                </button>
            </div>

            {/* --- FILTROS AVANZADOS (Sección Condicional) --- */}
            {showAdvanced && (
                <div className="p-4 mt-4 border-t border-gray-200 advanced-filters-popup">
                    <h4 className="mb-4 text-lg font-bold text-gray-800">Filtros Avanzados por Rango</h4>
                    <div className="my-2">
                        <Select 
                            isMulti
                            name="tride" 
                            options={tipeOptions} 
                            className="w-[200px]"
                            value={selectedTypeObjects} 
                            onChange={handleSelectChange('tride')}
                            placeholder="Tride"
                        />
                    </div>
                    <div className="flex flex-wrap gap-6">
                        {/* RANGO AP */}
                        <RangeFilter 
                            label="Ataque (AP)" 
                            name="apRange" 
                            range={filters.apRange} 
                            max={MAX_VALUE}
                            onChange={handleSliderChange('apRange')}
                        />

                        {/* RANGO HP */}
                        <RangeFilter 
                            label="Vida (HP)" 
                            name="hpRange" 
                            range={filters.hpRange} 
                            max={MAX_VALUE}
                            onChange={handleSliderChange('hpRange')}
                        />

                        {/* RANGO NIVEL */}
                        <RangeFilter 
                            label="Nivel" 
                            name="nvRange" 
                            range={filters.nvRange} 
                            max={MAX_VALUE}
                            onChange={handleSliderChange('nvRange')}
                        />

                        {/* RANGO COSTE */}
                        <RangeFilter 
                            label="Coste" 
                            name="costRange" 
                            range={filters.costRange} 
                            max={MAX_VALUE}
                            onChange={handleSliderChange('costRange')}
                        />
                    </div>
                </div>
            )}
        </div>
    )
};

FiltroCartas.propTypes = {
    onFilter: PropTypes.func.isRequired,
    types: PropTypes.array.isRequired,
    colors: PropTypes.array.isRequired,
};

export default FiltroCartas;