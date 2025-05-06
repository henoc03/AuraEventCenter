import React, { useState} from "react";
import { useNavigate } from "react-router-dom";
import SideNav from "../components/common/SideNav.jsx"
import "../style/account-settings.css";

const AccountSettings = ({ sections }) => {
  const [showModal, setShowModal] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const navigate = useNavigate();

  const handleEditClick = () => {
    navigate('/cuenta/verificar-codigo');
  };

  const handleDelete = async () => {
    if (!password.trim()) {
      setError('Por favor ingresá tu contraseña.');
      return;
    }

    setError('');
  
    const token = localStorage.getItem('token');
  
    try {
      const res = await fetch('/users/deactivate', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ password }),
      });
  
      let data;
      try {
        data = await res.json();
      } catch (jsonErr) {
        setError('Respuesta inesperada del servidor.');
        return;
      }

      if (!res.ok) {
        setError(data.message || 'Error al desactivar la cuenta.');
        return;
      }

  
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      navigate('/');
    } catch (err) {
      setError('Error de conexión con el servidor.');
    }
  };
  

  return (
    <>
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

              <button className="delete-account-button"
              onClick={() => setShowModal(true)}
              >
                Eliminar cuenta
              </button>
            </div>
          </div>
        </div>
      </div>

      {showModal && (
      <div className="modal-overlay">
        <div className="modal">
          <h3>¿Estás seguro de que quieres eliminar tu cuenta?</h3>
          <p>Ingresa tu contraseña para confirmar.</p>
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {error && <p className="error-message">{error}</p>}
          <div className="modal-actions">
            <button onClick={handleDelete} className="confirm-button">Confirmar</button>
            <button onClick={() => setShowModal(false)} className="cancel-button">Cancelar</button>
          </div>
        </div>
      </div>
    )}
    </>
  );
};

export default AccountSettings;