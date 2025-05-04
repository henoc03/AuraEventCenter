import React from 'react';
import logo from '../../assets/images/logo.png';

function Logo({ width = 180, height = 25 }) {
  return (
    <div className="logo">
      <img src={logo} alt="Logo" width={width} height={height} />
    </div>
  );
}

export default Logo;
