import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import Auth from '../components/common/Auth';
import '../style/auth.css';

const Register = () => {
  const { register, handleSubmit, formState: { errors, isValid } } = useForm({ mode: 'onChange' });
  const [termsAccepted, setTermsAccepted] = useState(false);
  const navigate = useNavigate();

  const onSubmit = (data) => {
    console.log('Registro:', data);
    navigate('/');
  };

  return (
    <Auth title="Registrarse">
      <form onSubmit={handleSubmit(onSubmit)} className="auth-form">
        
        <label htmlFor="name">Nombre completo *</label>
        <input
          type="text"
          placeholder=""
          {...register('name', { required: 'Nombre requerido' })}
        />
        {errors.name && <span className="error">{errors.name.message}</span>}
        
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


        <label htmlFor="phone">Número telefónico *</label>
        <input
          type="tel"
          placeholder=""
          {...register('phone', {
            required: 'Teléfono requerido',
            pattern: {
              value: /^[0-9]{8}$/,
              message: 'Solo números (8 dígitos)'
            }
          })}
        />
        {errors.phone && <span className="error">{errors.phone.message}</span>}

        <label htmlFor="password">Contraseña *</label>
        <input
          type="password"
          placeholder=""
          {...register('password', {
            required: 'Contraseña requerida',
            pattern: {
              value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[\W_]).{8,}$/,
              message: 'Mínimo 8 caracteres, 1 mayúscula, 1 minúscula, 1 numero, 1 símbolo'
            }
          })}
        />
        {errors.password && <span className="error">{errors.password.message}</span>}

        <div className="terms">
          <input
            type="checkbox"
            id="terms"
            onChange={() => setTermsAccepted(prev => !prev)}
          />
          <label htmlFor="terms">He leído y acepto los términos y condiciones</label>
        </div>

        <button type="submit" disabled={!isValid || !termsAccepted} className={`submit-button ${isValid && termsAccepted ? 'active' : ''}`} >
          Registrarse
        </button>

        <div className="auth-links">
          <p>¿Ya tienes una cuenta? <a href="/iniciar-sesion">Inicia sesión</a></p>
        </div>
      </form>
    </Auth>
  );
};

export default Register;
