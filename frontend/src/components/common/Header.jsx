import React, { useEffect, useState } from 'react';
import Logo from '../icons/Logo.jsx';
import ProfilePhoto from '../icons/ProfilePhoto.jsx'
import '../../style/header.css'

const DEFAULT_ROUTE = 'http://localhost:3000'

function Header({children}) {
  //const [currentUser, setCurrentUser] = useState([]);

  // Traer informacion del usuario activo desde la api
  // useEffect(() => {
  //   fetch(`${DEFAULT_ROUTE}/api/current_user`)
  //    .then(res=>res.json())
  //    .then(data => setCurrentUser(data))
  //    .catch(error => console.error('Error fetching user data:', error));
  // },[]);

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



  return (
  <header className='header-container'>
    <a href="/"><Logo className='logo'/></a>

    <div className='drop-down-menus-container'>
      {isMobile && (
        <div className="hamburger" onClick={() => setHamburguerMenuIsOpen(!hamburgerMenuIsOpen)}>
          <div className='drop-down-menu' style={{top: '0%'}}>
            <button 
              id="hamburger-button"
              className="btn btn-primary"
              data-bs-toggle="collapse"
              data-bs-target="#hamburger-menu"
            >
              <i className="bi bi-list"></i>
            </button>

            <div className="collapse submenu" id="hamburger-menu"
              style={{ position: 'absolute', zIndex: 1000, left: '0%' }}>
              <div className='card card-body'>
                <div className='dropdown-hamburger-menu'>
                  {children}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Bloque del usuario */}
      <div className='right-content-container'>
        <ProfilePhoto />
        <div className='user-info-container'>
          <h2>Brayan Rivera</h2>
          <p>Administrador</p>
        </div>
        <button 
          id="collapse-button" 
          className="btn btn-primary"
          data-bs-toggle="collapse"
          data-bs-target="#collapseMenu"
          aria-expanded="false"
          aria-controls="collapseMenu"
          style={{ marginBottom: 0 }}
        >
          <i className="bi bi-chevron-down"></i>
        </button>
      </div>
    </div>

    {/* 🔥 Mueve aquí el menú desplegable */}
    <div className="collapse submenu" id="collapseMenu"
      style={{ position: 'absolute', top: '100%', right: 0, zIndex: 1000 }}>
      <div className='card card-body'>
        <div className='dropdown-user-info'>
          <p className='user-email'>BrayanRivera@gmail.com</p>
          <ProfilePhoto width={120} height={120}/>
          <p>¡Hola, Brayan!</p>
          <div className='options'>
            <a href="/">Inicio</a>
            <a href="/">Cerrar sesión</a>
          </div>
        </div>
      </div>
    </div>
  </header>
  )
}

export default Header;
