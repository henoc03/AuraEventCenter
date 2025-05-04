import React, { useEffect } from 'react';
import '../../index.css';

const AlertMessage = ({ message, type = 'info', onClose, duration = 3000 }) => {
  useEffect(() => {
    if (message && onClose) {
      const timer = setTimeout(onClose, duration);
      return () => clearTimeout(timer);
    }
  }, [message, onClose, duration]);

  if (!message) return null;

  return (
    <div className={`alert-message ${type}`}>
      {message}
    </div>
  );
};

export default AlertMessage;
