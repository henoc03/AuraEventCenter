import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "../../style/client-nav.css";
import Logo from "../icons/Logo";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const toggleMenu = () => setMenuOpen(!menuOpen);

  const handleLoginClick = () => {
    navigate("/iniciar-sesion");
    setMenuOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <Logo />
      </div>

      <div className={`navbar-links ${menuOpen ? "open" : ""}`}>
        <NavLink to="/" className="nav-item" onClick={() => setMenuOpen(false)}>
          Inicio
        </NavLink>
        <NavLink
          to="/salas"
          className="nav-item"
          onClick={() => setMenuOpen(false)}
        >
          Salas
        </NavLink>
        <NavLink
          to="/servicios"
          className="nav-item"
          onClick={() => setMenuOpen(false)}
        >
          Servicios
        </NavLink>
        <NavLink
          to="/cotizacion"
          className="nav-item"
          onClick={() => setMenuOpen(false)}
        >
          Cotización
        </NavLink>
        <NavLink
          to="/contacto"
          className="nav-item"
          onClick={() => setMenuOpen(false)}
        >
          Contacto
        </NavLink>
        <button
          className="navbar-button mobile-button"
          onClick={handleLoginClick}
        >
          Iniciar Sesión
        </button>
      </div>

      <button className="menu-toggle" onClick={toggleMenu}>
        ☰
      </button>

      <button
        className="navbar-button desktop-button"
        onClick={handleLoginClick}
      >
        Iniciar Sesión
      </button>
    </nav>
  );
}

export default Navbar;
