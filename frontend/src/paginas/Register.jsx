import React, { useState, useEffect } from 'react';
import RegisterForm from '../components/registro/RegisterForm';  // Importamos el componente FiltroCartas';

const Register = () => {
return (
    <div className="p-6">
    {/* Componente del filtro */}
    <RegisterForm />
    </div>
    );
};

export default Register;