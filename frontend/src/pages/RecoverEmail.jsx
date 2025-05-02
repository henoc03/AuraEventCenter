import React from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import Auth from '../components/common/Auth';
import '../style/auth.css';

const RecoverEmail = () => {
  const { register, handleSubmit, formState: { errors, isValid } } = useForm({ mode: 'onChange' });
  const navigate = useNavigate();

  const onSubmit = (data) => {
    console.log("Correo enviado a:", data.email);

    navigate('/verificar-codigo', { state: { email: data.email } });
  };

  return (
    <Auth title="Recuperar contraseña">
      <form onSubmit={handleSubmit(onSubmit)} className="auth-form">
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
