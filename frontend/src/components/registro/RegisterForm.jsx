// src/components/Register.js
import  { useState } from 'react';
import axios from 'axios';
import Input from '../input/Input';
import mailSvg from '../../assets/svg/mail.svg';
import userSvg from '../../assets/svg/user.svg';
import padlockSvg from '../../assets/svg/padlock.svg';



const RegisterForm = () => {
    // Estado para manejar los valores del formulario
    const [usuario, setUsuario] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [mensaje, setMensaje] = useState('');

    // Función para manejar el envío del formulario
    const handleSubmit = async (e) => {
        e.preventDefault(); // Evitar que se recargue la página

        // Verificar que los campos no estén vacíos
        if (!usuario || !password || !email) {
            setMensaje('Por favor, rellena todos los campos.');
            return;
        }

        // Crear el objeto con los datos del formulario
        const datos = {
            usuario,
            password,
            email,
        };

        try {
            // Hacer la solicitud POST al backend para registrar el usuario
            const respuesta = await axios.post('http://localhost:5000/api/register', datos);

            // Si la respuesta es exitosa, mostrar un mensaje
            setMensaje('Usuario registrado con éxito.');
            console.log(respuesta.data); // Mostrar la respuesta del servidor

            // Limpiar los campos después del registro
            setUsuario('');
            setPassword('');
            setEmail('');
        } catch (error) {
            // Manejar errores si ocurren
            console.error(error);
            setMensaje('Hubo un error al registrar al usuario.');
        }
    };

    return (
        <div className="container p-4 mx-auto">
            <h1 className="w-auto mx-auto my-5 text-2xl font-bold max-w-96 min-w-[200px] text-white">Register Your Account</h1>
            {mensaje && <p className="text-red-500">{mensaje}</p>}
            <form onSubmit={handleSubmit} className="w-full mx-auto space-y-4 max-w-96 min-w-[200px]">
                <Input label_for={"usuario"} label_text={"User"} input_type="text" input_id="usuario" inpout_placeholder='Enter Your User Name' input_value={usuario} svg={userSvg}
                    onChange={(e) => setUsuario(e.target.value)}
                ></Input>
                <Input label_for={"Email"} label_text={"Email"} input_type="email" input_id="email" inpout_placeholder='Enter Your Email' input_value={email} svg={mailSvg}
                    onChange={(e) => setEmail(e.target.value)}
                ></Input>
                <Input label_for={"password"} label_text={"Password"} input_type="password" input_id="password" inpout_placeholder='Enter Your Password' input_value={password} svg={padlockSvg}
                    onChange={(e) => setPassword(e.target.value)}
                ></Input>
                
                {<div className='w-full mx-auto text-center'>
                    <h2 className='text-gray-400'>Login With Your Account? <b className='text-gray-200'>Sing in</b></h2>
                </div>}
                <button
                    type="submit"
                    className="w-full p-2 text-white bg-blue-500 rounded"
                >
                    Register
                </button>
            </form>
        </div>
    );
};

export default RegisterForm;