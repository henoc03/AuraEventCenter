import React, { useEffect, useState } from 'react';
import Logo from '../icons/Logo.jsx';
import DropDownMenu from './DropDownMenu.jsx'; 
import '../../style/header.css'

const DEFAULT_ROUTE = 'http://localhost:1522'

function Header({name, lastname, role, email, children}) {
  const [isMobile, setIsMobile] = useState(false);
  const [hamburgerMenuIsOpen, setHamburguerMenuIsOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);



  return (
    <header className='header-container'>
      <a href="/"><Logo className='logo'/></a>

      <div className='drop-down-menus-container'>
        {/*Menu de hamburguesa*/}
        {isMobile && (
          <div className="hamburger" onClick={() => setHamburguerMenuIsOpen(!hamburgerMenuIsOpen)}>
            <div className='drop-down-menu' style={{top: '0%'}}>
              <button 
                id="hamburger-button" 
                type="button"
                className="btn btn-primary"
                data-bs-toggle="collapse"
                data-bs-target="#hamburger-menu" 
                aria-expanded="false" 
                aria-controls="hamburger-menu" // Corregido para que coincida con el id del menú
                style={{ marginBottom: 0 }}>
                <i className="bi bi-list"></i> {/* Asegurarse de que los íconos de Bootstrap estén disponibles */}
              </button>

              <div className="collapse submenu" id="hamburger-menu" 
              style={{ position: 'absolute', zIndex: 1000, left: '0%'}}>
                <div className='card card-body'>
                  <div className='dropdown-hamburger-menu'>
                    {children}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className='right-content-container'>
          <div className='user-info-container'>
            <h2>{`${name} ${lastname}`}</h2>
            <p>
            {role === "root admin"
              ? "Administrador Principal"
              : role === "admin"
              ? "Administrador"
              : "Cliente"}
          </p>
          </div>

          <DropDownMenu name={name} email={email}/>
        </div>
      </div>
    </header>
  )
}

export default Header;