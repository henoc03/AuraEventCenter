import React, { useRef } from 'react';
import '../../style/auth.css';

const OTPInput = ({ length = 4, onChange }) => {
  const inputs = useRef([]);

  const handleChange = (e, index) => {
    const value = e.target.value;
    if (/^[0-9]$/.test(value) || value === '') {
      onChange((prev) => {
        const updated = [...prev];
        updated[index] = value;
        return updated.join('');
      });
      
      if (value !== '' && index < length - 1) {
        inputs.current[index + 1].focus();
      }
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && !e.target.value && index > 0) {
      inputs.current[index - 1].focus();
    }
  };

  return (
    <div className="otp-container">
      {Array.from({ length }).map((_, i) => (
        <input
          key={i}
          type="text"
          maxLength={1}
          className="otp-input"
          onChange={(e) => handleChange(e, i)}
          onKeyDown={(e) => handleKeyDown(e, i)}
          ref={(el) => (inputs.current[i] = el)}
        />
      ))}
    </div>
  );
};

export default OTPInput;
