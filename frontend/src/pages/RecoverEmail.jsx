import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import Auth from '../components/common/Auth';
import AlertMessage from '../components/common/AlertMessage';
import '../style/auth.css';

const RecoverEmail = () => {
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');

  const { register, handleSubmit, formState: { errors, isValid } } = useForm({ mode: 'onChange' });
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      const response = await fetch('http://localhost:1522/email/recuperar/enviar-codigo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: data.email }),
      });
  
      const result = await response.json();
  
      if (response.ok) {
        setMessage('Código de seguridad enviado a tu correo');
        setMessageType('success');
        navigate('/verificar-codigo', {
          state: { email: data.email, token: result.token }
        });
      } else {
        setMessage(result.message || 'Error al enviar el código');
        setMessageType('error');
      }
    } catch (error) {
      console.error(error);
      setMessage('Error del servidor');
      setMessageType('error');
    }
  };

  return (
    <Auth title="Recuperar contraseña">
      <form onSubmit={handleSubmit(onSubmit)} className="auth-form">
        
        <AlertMessage
          message={message}
          type={messageType}
          onClose={() => setMessage('')}
        />

        <p className="info-message">Te enviaremos un código de seguridad</p>

        <label htmlFor="email">Correo electrónico *</label>
        <input
          type="email"
          placeholder=""
          {...register('email', {
            required: 'Correo requerido',
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: 'Correo inválido'
            }
          })}
        />
        {errors.email && <span className="error">{errors.email.message}</span>}

        <button 
          type="submit" 
          disabled={!isValid} 
          className={`submit-button ${isValid ? 'active' : ''}`} 
          style={{ marginTop: '40px' }}
        >
          Recuperar contraseña
        </button>
        
        <div className="auth-links">
          <a href="/iniciar-sesion">Volver al inicio de sesión</a>
        </div>
      </form>
    </Auth>
  );
};

export default RecoverEmail;
