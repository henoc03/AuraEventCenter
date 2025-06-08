import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "../../style/client-nav.css";
import Logo from "../icons/Logo";
import DropDownMenu from "../common/DropDownMenu";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate();

  const toggleMenu = () => setMenuOpen(!menuOpen);

  const handleLoginClick = () => {
    navigate("/iniciar-sesion");
    setMenuOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setCurrentUser(null);
    navigate("/");
  };

  useEffect(() => {
    const updateUser = () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const decoded = JSON.parse(atob(token.split(".")[1]));
          const now = Date.now();

          if (
            decoded &&
            decoded.userType &&
            decoded.firstName &&
            decoded.email &&
            decoded.exp &&
            now < decoded.exp * 1000
          ) {
            setCurrentUser(decoded);
          } else {
            localStorage.removeItem("token");
            setCurrentUser(null);
          }
        } catch (error) {
          console.error("Error decoding token:", error);
          localStorage.removeItem("token");
          setCurrentUser(null);
        }
      } else {
        setCurrentUser(null);
      }
    };

    updateUser();
    window.addEventListener("userUpdated", updateUser);
    return () => window.removeEventListener("userUpdated", updateUser);
  }, []);

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <Logo />
      </div>

      <div className={`navbar-links ${menuOpen ? "open" : ""}`}>
        <NavLink to="/" className="nav-item" onClick={() => setMenuOpen(false)}>
          Inicio
        </NavLink>
        <NavLink to="/salas" className="nav-item" onClick={() => setMenuOpen(false)}>
          Salas
        </NavLink>
        <NavLink to="/servicios" className="nav-item" onClick={() => setMenuOpen(false)}>
          Servicios
        </NavLink>
        <NavLink to="/cotizacion" className="nav-item" onClick={() => setMenuOpen(false)}>
          Cotización
        </NavLink>
        <NavLink to="/contacto" className="nav-item" onClick={() => setMenuOpen(false)}>
          Contacto
        </NavLink>

        {!currentUser || currentUser.userType !== "cliente" ? (
          <button className="navbar-button mobile-button" onClick={handleLoginClick}>
            Iniciar Sesión
          </button>
        ) : null}
      </div>

      <button className="menu-toggle" onClick={toggleMenu}>
        ☰
      </button>

      {/* Desktop session area */}
      <div>
        {currentUser && currentUser.userType === "cliente" ? (
          <DropDownMenu
            name={currentUser.firstName}
            email={currentUser.email}
            onLogout={handleLogout}
          />
        ) : (
          <button className="navbar-button desktop-button" onClick={handleLoginClick}>
            Iniciar Sesión
          </button>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
