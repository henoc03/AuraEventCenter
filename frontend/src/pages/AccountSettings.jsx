import React, { useState} from "react";
import { useNavigate } from "react-router-dom";
import SideNav from "../components/common/SideNav.jsx"
import "../style/account-settings.css";

const AccountSettings = ({ sections }) => {
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const navigate = useNavigate();

  const handleEditClick = () => {
    navigate('/cuenta/verificar-codigo');
  };

  const handleConfirm = () => {
    setShowConfirmModal(false);
    setShowPasswordModal(true);
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
              onClick={() => setShowConfirmModal(true)}
              >
                Eliminar cuenta
              </button>

              {showConfirmModal && (
              <div className="modal">
                <div className="modal-content">
                  <button className="modal-close" onClick={() => setShowConfirmModal(false)}>×</button>
                  <h2>¿Estás seguro?</h2>
                  <p>Esta acción es irreversible</p>
                  <button onClick={() => setShowConfirmModal(false)}>Cancelar</button>
                  <button onClick={handleConfirm}>Continuar</button>
                </div>
              </div>
              )}

              {showPasswordModal && (
                <div className="modal">
                  <div className="modal-content">
                    <button className="modal-close" onClick={() => setShowPasswordModal(false)}>×</button>
                    <h2>Confirmar eliminación</h2>
                    <p>Escribe tu contraseña para confirmar</p>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Contraseña"
                    />
                    {error && <p className="error">{error}</p>}
                    <button onClick={() => setShowPasswordModal(false)}>Cancelar</button>
                    <button onClick={handleDelete}>Eliminar cuenta</button>
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AccountSettings;