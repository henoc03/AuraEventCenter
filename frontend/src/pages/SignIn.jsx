import React from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import Auth from "../components/common/Auth";
import '../style/auth.css';

const PORT = "http://localhost:1522";

const SignIn = () => {
  const { register, handleSubmit, formState: { errors, isValid } } = useForm({ mode: 'onChange' });
  const navigate = useNavigate();

  const onSubmit = async ({data}) => {
    try {
      const res = await fetch(`${PORT}/users/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({data})
      });

      if (!res.ok) {
        const errorData = await res.json();
        alert(errorData.message || 'Error al iniciar sesión');
        return;
      }

      const access = await res.json(); // Leer el cuerpo como JSON directamente
      localStorage.setItem('token', access.token);

      console.log("Sesión iniciada");
      navigate('/');
    } catch (error) {
      console.error('Error en login:', error);
      alert('Ocurrió un error al iniciar sesión.');
    }
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

        <button type="submit" disabled={!isValid} className={`submit-button ${isValid ? 'active' : ''}`}  style={{ marginTop: '30px' }}>
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
