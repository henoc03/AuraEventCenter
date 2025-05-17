import React from 'react';
import '../../style/loading-page.css';
import logo from '../../assets/images/logo-no-background.png';

const LoadingPage = () => {
  return (
    <div className="loading-page">
      {/*<div className="spinner" />*/}
      <img src={logo} alt="Logo empresa" className="loading-logo" />
      <p className="loading-text">Cargando...</p>
    </div>
  );
};

export default LoadingPage;
