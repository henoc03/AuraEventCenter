import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from '../icons/Logo';
import navigationLinks from '../utils/content';
import DropDownMenu from '../common/DropDownMenu';
import "../../style/nav.css";


function Nav() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeLink, setActiveLink] = useState(1);
  const [currentUser, setCurrentUser] = useState(null);

  const navigate = useNavigate();



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

  useEffect(() => {
    const updateUser = () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const decoded = JSON.parse(atob(token.split('.')[1]));
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
            localStorage.removeItem('token');
            setCurrentUser(null);
          }
        } catch (error) {
          console.error('Error decoding token:', error);
          localStorage.removeItem('token');
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
    <nav className="nav">
      <a href="#">
        <Logo className="logo-img" />
      </a>

      <div className={menuOpen ? 'nav-links open' : 'nav-links'}>
        <ul>
          {navigationLinks.map(link => (
            <li key={link.id}>
              <a 
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
          <DropDownMenu 
            name={currentUser.firstName} 
            email={currentUser.email} 
            onLogout={handleLogout}
          />
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

export default Nav;
