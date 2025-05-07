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
  const email = location.state?.email || '';
  const [token, setToken] = useState(location.state?.token || '');
  
  const isCodeValid = code.length === 6;

  const handleVerify = async (e) => {
    e.preventDefault();

    if (!isCodeValid) {
      setMessage('Código inválido o incompleto');
      setMessageType('error');
      return;
    }

    try {
      const response = await fetch('http://localhost:1522/email/recuperar/verificar-codigo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code, token }),
      });

      const result = await response.json();

      if (response.ok) {
        if (onVerify) onVerify(code);
        navigate('/cambiar-contraseña', {
          state: { email, token }
        });
      } else {
        setMessage(result.message || 'Código incorrecto o expirado');
        setMessageType('error');
      }
    } catch (error) {
      console.error(error);
      setMessage('Error al verificar el código');
      setMessageType('error');
    }
  };

  const handleResend = async () => {
    try {
      setMessage('Reenviando código...');
      setMessageType('info');

      const response = await fetch('http://localhost:1522/email/recuperar/enviar-codigo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const result = await response.json();

      if (response.ok) {
        setMessage('Código reenviado exitosamente.');
        setMessageType('success');

        setToken(result.token);

        setCode('');
      } else {
        setMessage(result.message || 'Error al reenviar el código');
        setMessageType('error');
      }
    } catch (error) {
      console.error(error);
      setMessage('Error al conectar con el servidor');
      setMessageType('error');
    }
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
