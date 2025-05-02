

import PropTypes from 'prop-types';

export default function GraveyardZone({ trash }) {
    return (
        <div className="flex flex-col items-center col-span-2 p-4 space-y-4 border border-gray-500">
            <h2 className="text-lg font-bold">Trash: {trash.length}</h2>
            <div className="w-24 h-32 border border-gray-500 border-dashed"></div>
        </div>
    );
}

GraveyardZone.propTypes = {
    trash: PropTypes.array.isRequired,
};
