import React from 'react';
import { useForm } from 'react-hook-form';
import Auth from '../components/common/Auth';
import '../style/auth.css';

const ResetPassword = () => {
  const { register, handleSubmit, watch, formState: { errors, isValid } } = useForm({ mode: 'onChange' });
  const password = watch("newPassword");

  const onSubmit = (data) => {
    console.log("Nueva contraseña:", data);
  };

  return (
    <Auth title="Recuperar contraseña">
      <form onSubmit={handleSubmit(onSubmit)} className="auth-form">

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
