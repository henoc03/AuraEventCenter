import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

import Auth from "../components/common/Auth";
import AlertMessage from '../components/common/AlertMessage';
import '../style/auth.css';

const PORT = "http://localhost:1522";

const SignIn = () => {
  const { register, handleSubmit, formState: { errors, isValid } } = useForm({ mode: 'onChange' });
  const navigate = useNavigate();
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const { setCurrentUser } = useAuth();

  const onSubmit = async (data) => {
    try {
      const res = await fetch(`${PORT}/users/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      if (!res.ok) {
        const errorData = await res.json();
        alert(errorData.message || 'Error al iniciar sesión');
        return;
      }

      const access = await res.json();
      
      const decoded = JSON.parse(atob(access.token.split('.')[1]));
      localStorage.setItem('user', JSON.stringify(decoded));
      localStorage.setItem('token', access.token);
      
      setCurrentUser(decoded); // Actualiza el estado del contexto de autenticación
      
      window.dispatchEvent(new Event('userUpdated'));
      
      if (decoded.userType === 'root admin') {
        navigate('/root-admin/tablero');
      } else if (decoded.userType === 'admin') {
        navigate('/admin/tablero');
      } else {
        navigate('/');
      }

    } catch (error) {
      console.error('Error en login:', error);
      alert('Ocurrió un error al iniciar sesión.');
    }
  };

  useEffect(() => {
    const storedMessage = sessionStorage.getItem('authSuccessMessage');
    const storedType = sessionStorage.getItem('authMessageType');
    
    if (storedMessage) {
      setMessage(storedMessage);
      setMessageType(storedType || 'success');

      sessionStorage.removeItem('authSuccessMessage');
      sessionStorage.removeItem('authMessageType');
    }
  }, []);
  return (
    <div className="signin">
      <AlertMessage
        message={message}
        type={messageType}
        onClose={() => setMessage('')}
        duration={3000}
        className="alert-floating"
      />
    <Auth title="Iniciar sesión">
      <form onSubmit={handleSubmit(onSubmit)} className="auth-form">
        <label htmlFor="email">Correo electrónico *</label>
        <input
          type="email"
          placeholder=""
          {...register('email', {
            required: 'Email requerido',
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: 'Formato de email inválido'
            }
          })}
        />
        {errors.email && <span className="error">{errors.email.message}</span>}

        <label htmlFor="password">Contraseña *</label>
        <input
          type="password"
          placeholder=""
          {...register('password', { required: 'Contraseña requerida' })}
        />
        {errors.password && <span className="error">{errors.password.message}</span>}

        <button type="submit" disabled={!isValid} className={`submit-button ${isValid ? 'active' : ''}`}  style={{ marginTop: '20px' }}>
          Iniciar sesión
        </button>

        <div className="forgot-password">
          <a href="/recuperar-contraseña">¿Olvidaste tu contraseña?</a>
        </div>
        
        <div className="auth-links">
          <p>¿No tienes cuenta? <a href="/registro">Regístrate</a></p>
        </div>
      </form>
    </Auth>
    </div>
  );
};

export default SignIn;
