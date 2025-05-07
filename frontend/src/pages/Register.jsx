import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import Auth from '../components/common/Auth';
import '../style/auth.css';

const PORT = "http://localhost:1522";

const Register = () => {
  const { register, handleSubmit, formState: { errors, isValid } } = useForm({ mode: 'onChange' });
  const [termsAccepted, setTermsAccepted] = useState(false);
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    const body = {
      email: data.email,
      first_name: data.first_name,
      last_name_1: data.last_name_1,
      last_name_2: data.last_name_2,
      phone: data.phone,
      password: data.password,
      user_type: 'cliente'
    };
  
    try {
      const response = await fetch(`${PORT}/users/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        alert(errorData.error || 'Error al registrar');
        return;
      }
  
      const result = await response.json();
  
      if (result.token) {
        localStorage.setItem('token', result.token);
        console.log('Usuario creado con ID:', result.user_id);
      }

      window.dispatchEvent(new Event('userUpdated'));

      sessionStorage.setItem('authSuccessMessage', 'Usuario registrado exitosamente');
      sessionStorage.setItem('authMessageType', 'success');
    
      navigate('/');
    } catch (error) {
      console.error('Error al registrar:', error);
      alert('Ocurrió un error al conectar con el servidor.');
    }
  };

  return (
    <Auth title="Registrarse">
      <form onSubmit={handleSubmit(onSubmit)} className="auth-form">
        <label>Nombre *</label>
        <input
          type="text"
          {...register('first_name', { required: 'Nombre requerido' })}
        />
        {errors.first_name && <span className="error">{errors.first_name.message}</span>}

        <label>Primer apellido *</label>
        <input
          type="text"
          {...register('last_name_1', { required: 'Primer apellido requerido' })}
        />
        {errors.last_name_1 && <span className="error">{errors.last_name_1.message}</span>}

        <label>Segundo apellido *</label>
        <input
          type="text"
          {...register('last_name_2', { required: 'Segundo apellido requerido' })}
        />
        {errors.last_name_2 && <span className="error">{errors.last_name_2.message}</span>}

        <label>Correo electrónico *</label>
        <input
          type="email"
          {...register('email', {
            required: 'Email requerido',
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: 'Formato de email inválido'
            }
          })}
        />
        {errors.email && <span className="error">{errors.email.message}</span>}

        <label>Número telefónico *</label>
        <input
          type="tel"
          {...register('phone', {
            required: 'Teléfono requerido',
            pattern: {
              value: /^[0-9]{8}$/,
              message: 'Debe tener 8 dígitos'
            }
          })}
        />
        {errors.phone && <span className="error">{errors.phone.message}</span>}

        <label>Contraseña *</label>
        <input
          type="password"
          {...register('password', {
            required: 'Contraseña requerida',
            pattern: {
              value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/,
              message: 'Mínimo 8 caracteres, mayúscula, minúscula, número y símbolo'
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

        <button
          type="submit"
          disabled={!isValid || !termsAccepted}
          className={`submit-button ${isValid && termsAccepted ? 'active' : ''}`}
        >
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
