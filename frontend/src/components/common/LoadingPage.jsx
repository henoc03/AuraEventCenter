import React from 'react';
import '../../style/loading-page.css';

const LoadingPage = () => {
  return (
    <div className="loading-page">
      <div className="spinner" />
      <p className="loading-text">Cargando...</p>
    </div>
  );
};

export default LoadingPage;
