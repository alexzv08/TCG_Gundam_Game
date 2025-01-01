import PropTypes from 'prop-types';

const Input = ({ label_for, label_text, input_type, input_id, inpout_placeholder, input_value, svg, onChange }) => {
    return (
        <div>
            <label htmlFor={label_for} className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                {label_text}
            </label>
            <div className="relative mb-6">
                <div className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none">
                    <img src={svg} alt="" className='w-5 h-5'/>
                </div>
                <input 
                    type={input_type}
                    id={input_id}
                    value={input_value}
                    placeholder={inpout_placeholder}
                    onChange={onChange}
                    className="
                    bg-gray-50 
                        border border-gray-300 text-gray-900 text-sm rounded-lg 
                        focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5  
                        dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 
                        dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                    >
                </input>
            </div>
        </div>
        
    );
};

Input.propTypes = {
    label_for: PropTypes.string.isRequired,
    label_text: PropTypes.string.isRequired,
    input_type: PropTypes.string.isRequired,
    input_id: PropTypes.string.isRequired,
    inpout_placeholder: PropTypes.string.isRequired,
    input_value: PropTypes.string.isRequired,
    svg: PropTypes.string,
    onChange: PropTypes.func
};

export default Input;