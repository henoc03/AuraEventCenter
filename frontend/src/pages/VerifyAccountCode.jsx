import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import OTPInput from '../components/sections/OTPInput';
import AlertMessage from '../components/common/AlertMessage';
import DefaultProfilePhoto from '../assets/images/default-profile-photo.png'
import SideNav from "../components/common/SideNav.jsx"
import "../style/account-settings.css";
import Header from "../components/common/Header.jsx";

const VerifyAccountCode = ({ sections }) => {
  const [code, setCode] = useState('');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');

  const navigate = useNavigate();
  const location = useLocation();
  const isCodeValid = code.length === 6;

  const handleVerify = (e) => {
    e.preventDefault();

    if (isCodeValid) {
      navigate('/cuenta/cambiar-contraseña');
    } else {
      setMessage('Código inválido o incompleto');
      setMessageType('error');
    }
  };

  const handleResend = () => {
    setMessage('Reenviando código...');
    setMessageType('info');

    setTimeout(() => {
      setMessage('Código reenviado exitosamente.');
      setMessageType('success');
    }, 1000);
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
            <div className="settings-content">
              <h1 className="settings-title">Configuración de la cuenta</h1>
              <div className="settings-box">
                <h2 className="settings-subtitle">Cambiar contraseña</h2>
                <p>Introduce el código de seguridad enviado a tu correo.</p>

                <AlertMessage
                  message={message}
                  type={messageType}
                  onClose={() => setMessage('')} 
                />

                <form onSubmit={handleVerify}>
                  <div className="opt-wrapper">
                    <OTPInput length={6} onChange={setCode} />
                  </div>
          
                  <div className="resend-buttons">
                  <button 
                    type="submit" 
                    disabled={!isCodeValid}
                    className={`continue-button ${isCodeValid ? 'active' : ''}`}>
                    Continuar
                  </button>
                  <button 
                    type="button"
                    className="resend-button"
                    onClick={handleResend}>
                    Reenviar código
                  </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default VerifyAccountCode;
