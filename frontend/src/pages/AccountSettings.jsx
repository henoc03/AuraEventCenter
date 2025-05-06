import React from "react";
import { useNavigate } from "react-router-dom";
import DefaultProfilePhoto from '../assets/images/default-profile-photo.png'
import SideNav from "../components/common/SideNav.jsx"
import "../style/settings.css";
import Header from "../components/common/Header.jsx";

const AccountSettings = ({ sections }) => {
  const navigate = useNavigate();

  const handleEditClick = () => {
    navigate('/cuenta/verificar-codigo');
  };

  return (
    <>
      <Header />
      <div className="side-nav-mobile">
        <SideNav sections={sections} />
      </div>
      
      <div className="main-container">
        <div className="side-nav-desktop">
          <SideNav sections={sections} />
        </div>

        <div className="main">
          <div className="profile-container">
            <h1 className="settings-title">Configuración de la cuenta</h1>

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
        
      </div>
    </>
  );
};

export default AccountSettings;