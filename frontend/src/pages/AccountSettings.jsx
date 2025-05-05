import React, { useState } from "react";
import "../style/accountSettings.css"

export default function AccountSettings() {
const [showPassword, setShowPassword] = useState(false);
const [password, setPassword] = useState("********");

const togglePasswordVisibility = () => {
  setShowPassword((prev) => !prev);
};

const handlePasswordChange = (e) => {
  setPassword(e.target.value);
};

return (
  <div className="account-settings-container">
    <h2>Configuración de la cuenta</h2>

    <div className="card">

      <label htmlFor="password">Contraseña</label>
      <div className="password-field">
        <input
          id="password"
          type={showPassword ? "text" : "password"}
          value={password}
          onChange={handlePasswordChange}
        />
        <button
          className="icon-button"
          onClick={togglePasswordVisibility}
          aria-label="Mostrar/ocultar contraseña"
        >
          <i className={`bi ${showPassword ? "bi-eye-slash" : "bi-eye"}`}></i>
        </button>
        <button className="icon-button edit-button" aria-label="Editar">
          <i className="bi bi-pencil"></i>
        </button>
      </div>

      <div className="two-step-section">
        <p>Verificación en 2 pasos</p>
        <a href="#" className="change-link">
          Cambiar configuración de verificación en 2 pasos
        </a>
      </div>

      <button className="delete-button">Eliminar cuenta</button>
    </div>
  </div>
);
}
