import React from 'react';
import { useForm } from 'react-hook-form';
import '../style/accountSettings.css';

const ChangePassword = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isValid }
  } = useForm({ mode: 'onChange' });

  const newPassword = watch("newPassword");

  const onSubmit = (data) => {
    console.log("Datos enviados:", data);
  };

  return (
    <div className="settings-container">
      <div className="settings-content">
        <h1 className='settings-title'>Configuración de la cuenta</h1>

        <div className="settings-box">
          <h2 className='settings-subtitle'>Cambiar contraseña</h2>

          <form onSubmit={handleSubmit(onSubmit)} className="settings-form">

            <label htmlFor="currentPassword">Escriba su contraseña actual *</label>
            <input
              type="password"
              id="currentPassword"
              {...register("currentPassword", { required: "Campo requerido" })}
            />
            {errors.currentPassword && (
              <span className="change-password-error">{errors.currentPassword.message}</span>
            )}

            <label htmlFor="newPassword">Escriba la nueva contraseña *</label>
            <input
              type="password"
              id="newPassword"
              {...register("newPassword", {
                required: "Campo requerido",
                pattern: {
                  value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/,
                  message:
                    "Debe tener al menos 8 caracteres, una mayúscula, una minúscula, un número y un símbolo"
                }
              })}
            />
            {errors.newPassword && (
              <span className="change-password-error">{errors.newPassword.message}</span>
            )}

            <label htmlFor="confirmPassword">Confirme la nueva contraseña *</label>
            <input
              type="password"
              id="confirmPassword"
              {...register("confirmPassword", {
                required: "Confirma tu contraseña",
                validate: (value) => value === newPassword || "Las contraseñas no coinciden"
              })}
            />
            {errors.confirmPassword && (
              <span className="change-password-error">{errors.confirmPassword.message}</span>
            )}

            <button
              type="submit"
              className={`change-button ${isValid ? 'active' : ''}`}
              disabled={!isValid}
            >
              Cambiar
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChangePassword;
