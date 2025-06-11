import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Logo from '../icons/Logo';
import navigationLinks from '../utils/content';
import DropDownMenu from '../common/DropDownMenu';
import "../../style/navigation.css"


function Navigation() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const [width, setWidth] = useState(window.innerWidth);

  const navigate = useNavigate();
  const location = useLocation();

  const handleScroll = () => {
    setScrolled(window.scrollY > window.innerHeight);
  };

  const handleLinkClick = () => {
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
    const handleResize = () => {
      setWidth(window.innerWidth);
      if (window.innerWidth <= 800) setIsMobile(true);
      else setIsMobile(false);
    }
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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
    <nav className={`nav ${scrolled ? 'scrolled' : ''}`}>
      {isMobile && (
        <div className="dropdown client-nav-container">
          <button className="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
            <i className="bi bi-list"></i>
          </button>
          <ul className="dropdown-menu">
            {navigationLinks.map(link => (
              <li key={link.id}>
                <a
                  className={`drop-down-item navIndex${location.pathname === link.href ? 'active' : ''}`}
                  href={link.href}
                  onClick={() => handleLinkClick()}
                >
                  {link.link}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}

      <a data-aos="fade-down" data-aos-duration="1500" className="logo" href="/">
        <Logo className="logo-img" />
      </a>

      <div data-aos="fade-down" data-aos-duration="1500" className={menuOpen ? 'nav-links open' : 'nav-links'}>
        <ul className = "client-nav-container">
          {width >= 768 && navigationLinks.map(link => (
            <li key={link.id}>
              <a 
                data-aos="fade-down"
                data-aos-delay="350"
                data-aos-duration="3500"
                className={`navIndex ${location.pathname === link.href ? 'active' : ''}`}
                href={link.href}
                onClick={() => handleLinkClick()}
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
          <button data-aos="fade-down" data-aos-duration="1500" className="signInBtn" onClick={handleSignInClick}>Iniciar Sesión</button>
        )}
      </div>
    </nav>
  );
}

export default Navigation;
