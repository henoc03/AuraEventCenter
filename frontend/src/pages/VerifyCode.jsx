import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import OTPInput from '../components/sections/OTPInput';
import Auth from '../components/common/Auth';
import AlertMessage from '../components/common/AlertMessage'; 
import '../style/auth.css';

const VerifyCode = ({ onVerify }) => {
  const [code, setCode] = useState('');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');

  const navigate = useNavigate();
  const location = useLocation();
  const isCodeValid = code.length === 6;

  const handleVerify = (e) => {
    e.preventDefault();

    if (isCodeValid) {
      if (onVerify) onVerify(code);
      const email = location.state?.email || '';
      navigate('/cambiar-contraseña', { state: { email } });
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
    <Auth title="Recuperar contraseña">
      <div className="recover-container">
        <p className="info-message">Introduce el código de seguridad</p>

        <AlertMessage
          message={message}
          type={messageType}
          onClose={() => setMessage('')}
        />

        <form onSubmit={handleVerify}>
          <OTPInput length={6} onChange={setCode} />
          <div className="recover-buttons">
            <button
              type="submit"
              disabled={!isCodeValid}
              className={`primary-btn ${isCodeValid ? 'active' : ''}`}
            >
              Continuar
            </button>
            <button
              type="button"
              className="secondary-btn"
              onClick={handleResend}
            >
              Reenviar código
            </button>
          </div>
        </form>

        <a href="/iniciar-sesion">Volver al inicio de sesión</a>
      </div>
    </Auth>
  );
};

export default VerifyCode;
