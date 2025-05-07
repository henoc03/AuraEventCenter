import React, { useEffect } from 'react';
import '../../index.css';

const AlertMessage = ({ message, type = 'info', onClose,  className = '', duration = 3000 }) => {
  useEffect(() => {
    if (message && onClose) {
      const timer = setTimeout(onClose, duration);
      return () => clearTimeout(timer);
    }
  }, [message, onClose, duration]);

  if (!message) return null;

  return (
    <div className={`alert-message ${type} ${className}`}>
      <span>{message}</span>
      <button onClick={onClose}>&times;</button>
    </div>
  );
};

export default AlertMessage;
