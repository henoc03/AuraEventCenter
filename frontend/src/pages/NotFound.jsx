import React from 'react';
import '../index.css';

function NotFound() {
  return (
    <div className="not-found">
      <div className="not-found-content">
        <h1 className="not-found-title">404</h1>
        <p className="not-found-message">Página No Encontrada</p>
        <p className="not-found-description">Lo sentimos, la página que buscas no existe.</p>
        <a href="/" className="not-found-link">Volver a la página principal</a>
      </div>
    </div>
  );
}

export default NotFound;
