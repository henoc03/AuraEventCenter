import React, { useState } from 'react';
import '../style/accountSettings.css';

const VerifyAccountCode = () => {
const [code, setCode] = useState(['', '', '', '', '', '']);
const [error, setError] = useState('');

const handleChange = (value, index) => {
  if (!/^\d?$/.test(value)) return;

  const newCode = [...code];
  newCode[index] = value;
  setCode(newCode);

  if (value && index < 3) {
    document.getElementById(`code-${index + 1}`).focus();
  }
};

const handleSubmit = (e) => {
  e.preventDefault();
  const joinedCode = code.join('');
  if (joinedCode.length < 6) {
    setError('Por favor, introduce el código completo.');
    return;
  }
  setError('');
  console.log('Código enviado:', joinedCode);
};

return (
  <div className="account-settings-container">
    <h1>Configuración de la cuenta</h1>
    <div className="card">
      <h2>Cambiar contraseña</h2>
      <p>Te hemos enviado un código de seguridad a tu correo, escríbelo abajo.</p>
      {error && <p className="error-message">{error}</p>}
      <form onSubmit={handleSubmit}>
        <div className="code-inputs">
          {code.map((digit, i) => (
            <input
              key={i}
              id={`code-${i}`}
              type="text"
              maxLength="1"
              value={digit}
              onChange={(e) => handleChange(e.target.value, i)}
              className="code-box"
            />
          ))}
        </div>
        <button type="submit" className="continue-button">
          Continuar
        </button>
      </form>
    </div>
  </div>
);
};

export default VerifyAccountCode;
