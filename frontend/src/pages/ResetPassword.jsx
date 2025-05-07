import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useLocation } from 'react-router-dom';
import Auth from '../components/common/Auth';
import AlertMessage from '../components/common/AlertMessage';
import '../style/auth.css';

const ResetPassword = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || '';
  const token = location.state?.token || '';

  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');

  const { register, handleSubmit, watch, formState: { errors, isValid } } = useForm({ mode: 'onChange' });
  const password = watch("newPassword");

  const onSubmit = async (data) => {
    try {
      const response = await fetch('http://localhost:1522/email/recuperar/cambiar-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, token, newPassword: data.newPassword }),
      });

      const result = await response.json();

      if (response.ok) {
        sessionStorage.setItem('authSuccessMessage', 'Contraseña actualizada correctamente');
        sessionStorage.setItem('authMessageType', 'success');
        
        navigate('/iniciar-sesion');
      } else {
        setMessage(result.message || 'Error al actualizar la contraseña');
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
          className="alert-floating"
        />

        <label htmlFor="password">Nueva contraseña *</label>
        <input
          type="password"
          placeholder=""
          {...register("newPassword", {
            required: "Contraseña requerida",
            pattern: {
              value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/,
              message: "Debe tener al menos 8 caracteres, una mayúscula, una minúscula, un número y un símbolo"
            }
          })}
        />
        {errors.newPassword && <span className="error">{errors.newPassword.message}</span>}

        <label htmlFor="password">Confirmar contraseña *</label>
        <input
          type="password"
          placeholder=""
          {...register("confirmPassword", {
            required: "Confirma tu contraseña",
            validate: value => value === password || "Las contraseñas no coinciden"
          })}
        />
        {errors.confirmPassword && <span className="error">{errors.confirmPassword.message}</span>}

        <button type="submit" disabled={!isValid} className={`submit-button ${isValid ? 'active' : ''}`}>
          Guardar nueva contraseña
        </button>
        <div className="auth-links">
          <a href="/iniciar-sesion">Volver al inicio de sesión</a>
        </div>
      </form>
    </Auth>
  );
};

export default ResetPassword;
