import { useState } from "react";
import PropTypes from 'prop-types';


const FiltroCartas = ({ onFilter, types, colors }) => {
    const [filters, setFilters] = useState({
        name: '',
        type: '',
        color: '',
        hp: '',
        ap: '',
        level: '',
        cost: '',
    });

    const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({
        ...prevFilters,
        [name]: value,
    }));
    };

    const handleFilter = () => {
    onFilter(filters);
    };

    const handleClear = () => {
    const clearedFilters = {
        name: '',
        type: '',
        color: '',
        hp: '',
        ap: '',
        level: '',
        cost: '',
    };
    setFilters(clearedFilters);
    onFilter(clearedFilters);
    };
    return (
        <div className="flex items-center justify-between w-full h-auto p-4 bg-transparent border-2 border-white rounded-lg filter-container">
            <input
            type="text"
            name="name"
            placeholder="Card Name"
            value={filters.name}
            onChange={handleChange}
            />

            <select name="type" value={filters.type} onChange={handleChange}>
            <option value="Types">Types</option>
                {types.map((type) => (
                <option key={type} value={type}>
                    {type}
                </option>
                ))}
            </select>

            <select name="color" value={filters.color} onChange={handleChange}>
            <option value="color">Color</option>
                {colors.map((color) => (
                <option key={color} value={color}>
                    {color}
                </option>
                ))}
            </select>

            
            <input
                type="number"
                name="ap"
                placeholder="AP"
                value={filters.ap}
                onChange={handleChange}
                min={0}
                max={10}
            />
            <input
                type="number"
                name="hp"
                placeholder="HP"
                min={0}
                max={10}
                value={filters.hp}
                onChange={handleChange}
            />
            <input
                type="number"
                name="level"
                min={0}
                max={10}
                placeholder="Nivel"
                value={filters.level}
                onChange={handleChange}
            />
            <input
                type="number"
                name="cost"
                placeholder="Coste"
                min={0}
                max={10}
                value={filters.cost}
                onChange={handleChange}
            />
            <button onClick={handleFilter}>Aplicar filtros</button>
            <button onClick={handleClear}>Limpiar filtros</button>
        </div>
    )
        
};

FiltroCartas.propTypes = {
    onFilter: PropTypes.func.isRequired,
    types: PropTypes.array.isRequired,
    colors: PropTypes.array.isRequired,

};
export default FiltroCartas;
