import React from "react";
import { useNavigate } from "react-router-dom";
import "../style/accountSettings.css";

const AccountSettings = () => {
  const navigate = useNavigate();

  const handleEditClick = () => {
    navigate('/cliente/cuenta/verificar-codigo');
  };

  return (
    <div className="settings-container">

      <div className="settings-content">
        <h3 className="settings-title">Configuración de la cuenta</h3>

        <div className="settings-box">
          <div className="password-section">
            <label className="settings-subtitle">Contraseña</label>
            <div className="password-input-wrapper">
              <input type="password" value="************" readOnly></input>
              <button 
                className="icon-button"
                onClick={handleEditClick}  
              >
              <i className="bi bi-pencil-fill"></i>
              </button>
            </div>
          </div>

          <div className="two-factor-section">
            <p className="settings-subtitle">Verificación en 2 pasos</p>
            <a href="" className="blue-link">Cambiar configuración de verificación en 2 pasos</a>
          </div>

          <button className="delete-account-button">Eliminar cuenta</button>
        </div>
      </div>
    </div>
  );
};

export default AccountSettings;
