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
  <div className="account-settings-container">
    <h1>Configuración de la cuenta</h1>

    <div className="card">
      <h2>Cambiar contraseña</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="form-password">

        <label htmlFor="currentPassword">Escriba su contraseña actual *</label>
        <input
          type="password"
          id="currentPassword"
          {...register("currentPassword", { required: "Campo requerido" })}
        />
        {errors.currentPassword && (
          <span className="error">{errors.currentPassword.message}</span>
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
          <span className="error">{errors.newPassword.message}</span>
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
          <span className="error">{errors.confirmPassword.message}</span>
        )}

        <button
          type="submit"
          className={`continue-btn ${isValid ? 'active' : ''}`}
          disabled={!isValid}
        >
          Cambiar
        </button>
      </form>
    </div>
  </div>
);
};

export default ChangePassword;
