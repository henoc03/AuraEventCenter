import React, { useState, useEffect } from 'react';
import Logo from '../icons/Logo';
import navigationLinks from '../../utils/content';

function Navigation() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeLink, setActiveLink] = useState(1);

  const handleScroll = () => {
    if (window.scrollY > window.innerHeight) {
      setScrolled(true);
    } else {
      setScrolled(false);
    }
  };

  const toggleMenu = () => setMenuOpen(!menuOpen);

  const handleLinkClick = (link) => {
    setActiveLink(link);
    setMenuOpen(false);
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <nav className={`nav ${scrolled ? 'scrolled' : ''}`}>
      <a data-aos="fade-down" data-aos-duration="1500" className="logo" href="#">
        <Logo className="logo-img" />
      </a>

      <div className={menuOpen ? "nav-links open" : "nav-links"}>
        <ul>
          {navigationLinks.map(link => (
            <li key={link.id}>
              <a data-aos="fade-down" data-aos-delay="350" data-aos-duration="3500" 
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
      <div><button className="signInBtn">Iniciar Sesión</button></div>  
      <div className="hamburger" onClick={toggleMenu}>
        <span className={menuOpen ? "line open" : "line"}></span>
        <span className={menuOpen ? "line open" : "line"}></span>
        <span className={menuOpen ? "line open" : "line"}></span>
      </div>
    </nav>
  );
}

export default Navigation;
