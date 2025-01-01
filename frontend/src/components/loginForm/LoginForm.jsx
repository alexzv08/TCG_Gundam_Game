// src/components/Register.js
import  { useState } from 'react';
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import Input from '../input/Input';
import userSvg from '../../assets/svg/user.svg';
import padlockSvg from '../../assets/svg/padlock.svg';



const LoginterForm = () => {
    // Estado para manejar los valores del formulario
    const navigate = useNavigate();
    const [usuario, setUsuario] = useState('');
    const [password, setPassword] = useState('');
    const [mensaje, setMensaje] = useState('');

    // Función para manejar el envío del formulario
    const handleSubmit = async (e) => {
        e.preventDefault(); // Evitar que se recargue la página

        // Verificar que los campos no estén vacíos
        if (!usuario || !password) {
            setMensaje('Por favor, rellena todos los campos.');
            return;
        }

        // Crear el objeto con los datos del formulario
        const datos = {
            usuario,
            password,
        };

        try {
            // Hacer la solicitud POST al backend para registrar el usuario
            const respuesta = await axios.post('http://localhost:5000/api/login', datos);

            if (respuesta.data.token) {
                // Guardar el token en Local Storage
                localStorage.setItem("token", respuesta.data.token);
                navigate("/home");
                setMensaje("Login exitoso.");
                console.log("Token guardado:", respuesta.data.token);
            }


            // Si la respuesta es exitosa, mostrar un mensaje
            setMensaje('Login successful.');
            console.log(respuesta.data); // Mostrar la respuesta del servidor

            // Limpiar los campos después del registro
            setUsuario('');
            setPassword('');
        } catch (error) {
            // Manejar errores si ocurren
            console.error(error);
            setMensaje('Hubo un error al registrar al usuario.');
        }
    };

    const manejarClick = (ruta) => {
        navigate(ruta); // Aquí defines a dónde redirigir cuando el texto es clickeado
    };
    return (
        <div className="container p-4 mx-auto">
            <h1 className="w-auto mx-auto my-5 text-2xl font-bold max-w-96 min-w-[200px] text-white">Login Your
            Account</h1>
            {mensaje && <p className="text-red-500">{mensaje}</p>}
            <form onSubmit={handleSubmit} className="w-full mx-auto space-y-4 max-w-96 min-w-[200px]">
                <Input label_for={"usuario"} label_text={"User"} input_type="text" input_id="usuario" inpout_placeholder='Enter Your User Name' input_value={usuario} svg={userSvg}
                    onChange={(e) => setUsuario(e.target.value)}
                ></Input>
                <Input label_for={"password"} label_text={"Password"} input_type="password" input_id="password" inpout_placeholder='Enter Your Password' input_value={password} svg={padlockSvg}
                    onChange={(e) => setPassword(e.target.value)}
                ></Input>
                
                {<div className='grid grid-cols-1 gap-4 py-5 text-center'>
                    <h2 className='text-gray-400'>Create New Account? <b className='text-gray-200 cursor-pointer' onClick={() => manejarClick("register")} >Sing in</b></h2>
                    <h2 className='text-gray-400'>Forget Your Password? <b className='text-gray-200'>Changed It</b></h2>
                </div>}
                <button
                    type="submit"
                    className="w-full p-2 text-white bg-blue-500 rounded"
                >
                    Login
                </button>
            </form>
        </div>
    );
};

export default LoginterForm;