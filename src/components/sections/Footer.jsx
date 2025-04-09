import React from 'react';

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-logo">
          <h2>Centro de Eventos Aura</h2>
        </div>
        <div className="footer-links">
          <ul>
            <li><a href="/">Inicio</a></li>
            <li><a href="/salas">Salas</a></li>
            <li><a href="/servicios">Servicios</a></li>
            <li><a href="/cotizaciones">Cotizaciones</a></li>
            <li><a href="/contacto">Contacto</a></li>
          </ul>
        </div>
        <div className="footer-info">
          <p>&copy; 2025 Centro de Eventos Aura. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
