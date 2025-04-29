import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from '../icons/Logo';
import navigationLinks from '../utils/content';

function Navigation() {
  // Estados locales
  const [menuOpen, setMenuOpen] = useState(false); // Menú hamburguesa
  const [scrolled, setScrolled] = useState(false); // Estado de scroll
  const [activeLink, setActiveLink] = useState(1); // Link activo
  const navigate = useNavigate(); // Hook para navegar

  // Función para manejar el scroll y cambiar el estilo del navbar
  const handleScroll = () => {
    if (window.scrollY > window.innerHeight) {
      setScrolled(true);
    } else {
      setScrolled(false);
    }
  };

  // Función para abrir/cerrar el menú hamburguesa
  const toggleMenu = () => setMenuOpen(!menuOpen);

  // Función para manejar el click en un link de navegación
  const handleLinkClick = (link) => {
    setActiveLink(link); // Cambiar el link activo
    setMenuOpen(false); // Cerrar el menú en móvil
  };

  // Función para redirigir al Sign In
  const handleSignInClick = () => {
    navigate('/iniciarsesion');
  };

  // Hook para escuchar el evento de scroll
  useEffect(() => {
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // JSX del componente
  return (
    <nav className={`nav ${scrolled ? 'scrolled' : ''}`}>
      {/* Logo */}
      <a data-aos="fade-down" data-aos-duration="1500" className="logo" href="#">
        <Logo className="logo-img" />
      </a>

      {/* Menú de navegación */}
      <div className={menuOpen ? 'nav-links open' : 'nav-links'}>
        <ul>
          {navigationLinks.map(link => (
            <li key={link.id}>
              <a 
                data-aos="fade-down" 
                data-aos-delay="350" 
                data-aos-duration="3500" 
                className={`navIndex ${activeLink === link.id ? 'active' : ''}`}
                href={link.href}
                onClick={() => handleLinkClick(link.id)}
              >
                {link.link}
              </a>
            </li>
          ))}
        </ul>
      </div>

      {/* Botón de Iniciar Sesión */}
      <div>
        <button className="signInBtn" onClick={handleSignInClick}>Iniciar Sesión</button>
      </div>

      {/* Menú hamburguesa */}
      <div className="hamburger" onClick={toggleMenu}>
        <span className={menuOpen ? 'line open' : 'line'}></span>
        <span className={menuOpen ? 'line open' : 'line'}></span>
        <span className={menuOpen ? 'line open' : 'line'}></span>
      </div>
    </nav>
  );
}

export default Navigation;
