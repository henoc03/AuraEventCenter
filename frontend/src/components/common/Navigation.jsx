import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from '../icons/Logo';
import navigationLinks from '../utils/content';

function Navigation() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeLink, setActiveLink] = useState(1);
  const [currentUser, setCurrentUser] = useState(null);

  const navigate = useNavigate();

  const handleScroll = () => {
    setScrolled(window.scrollY > window.innerHeight);
  };

  const toggleMenu = () => setMenuOpen(!menuOpen);

  const handleLinkClick = (link) => {
    setActiveLink(link);
    setMenuOpen(false);
  };

  const handleSignInClick = () => {
    navigate('/iniciar-sesion');
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setCurrentUser(null);
    navigate('/');
  };


   // Maneja la apertura y cierre del submenu
   const [submenuOpen, setSubmenuOpen] = useState(false);
   const toggleSubmenu = () => setSubmenuOpen(!submenuOpen);
   
  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const updateUser = () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const decoded = JSON.parse(atob(token.split('.')[1]));
          setCurrentUser(decoded);
        } catch (error) {
          console.error('Error decoding token:', error);
          setCurrentUser(null);
        }
      } else {
        setCurrentUser(null);
      }
    };
  
    updateUser();
    window.addEventListener('userUpdated', updateUser);
  
    return () => {
      window.removeEventListener('userUpdated', updateUser);
    };
  }, []);

  return (
    <nav className={`nav ${scrolled ? 'scrolled' : ''}`}>
      {/* Logo */}
      <a data-aos="fade-down" data-aos-duration="1500" className="logo" href="#">
        <Logo className="logo-img" />
      </a>

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

      {/* Botón o menú de cliente */}
      <div>
        {currentUser && currentUser.userType === 'cliente' ? (
          <div>
          {/* Botón "Hola" */}
          <button className="helloBtn" onClick={toggleSubmenu}>
            Hola, {currentUser.firstName}
          </button>

          {/* Collapse submenu */}
          {submenuOpen && (
            <div
              className="collapse submenu"
              id="collapseMenu"
              style={{ position: 'absolute', zIndex: 1000, right: '-10%' }}
            >
              <div className="card card-body">
                <div className="dropdown-user-info">
                  <p className="user-email">{currentUser.email}</p>
                  <div className="options">
                    <a href={currentUser.userType === 'admin' ? '/admin/tablero' : '/'}>Inicio</a>
                    <a href="/" onClick={handleLogout}>Cerrar sesión</a>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        ) : (
          <button className="signInBtn" onClick={handleSignInClick}>Iniciar Sesión</button>
        )}
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
