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
        {errors.email && <span className="error">{errors.email.message}</span>}
        <input
          type="email"
          placeholder="Email"
          {...register('email', {
            required: 'Email requerido',
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: 'Formato de email inválido'
            }
          })}
        />

        {errors.password && <span className="error">{errors.password.message}</span>}
        <input
          type="password"
          placeholder="Contraseña"
          {...register('password', { required: 'Contraseña requerida' })}
        />

        <button type="submit" disabled={!isValid} className={`submit-button ${isValid ? 'active' : ''}`}>
          Iniciar sesión
        </button>

        <div className="forgot-password">
          <a href="/recover-password">¿Olvidaste tu contraseña?</a>
        </div>
        
        <div className="auth-links">
          <p>¿No tienes cuenta? <a href="/registro">Regístrate</a></p>
        </div>
      </form>
    </Auth>
  );
};

export default SignIn;
