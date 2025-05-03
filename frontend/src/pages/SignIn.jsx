import React from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import Auth from "../components/common/Auth";
import '../style/auth.css';

const SignIn = () => {
  const { register, handleSubmit, formState: { errors, isValid } } = useForm({ mode: 'onChange' });
  const navigate = useNavigate();

  const onSubmit = (data) => {
    console.log('Login:', data);
    navigate('/');
  };

  return (
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
  );
};

export default SignIn;
