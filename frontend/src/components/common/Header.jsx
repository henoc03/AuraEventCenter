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
          <ProfilePhoto/>
          <div className='user-info-container'>
            <h2>{/*currentUser?.name8*/}Brayan Rivera</h2>
            <p>{/*currentUser?.role != 'client' ? currentUser?.role : ''*/}Administrador</p>
          </div>

          <div className='drop-down-menu'>
            <button 
              id="collapse-button" 
              type="button"
              className="btn btn-primary"
              data-bs-toggle="collapse"
              data-bs-target="#collapseMenu" 
              aria-expanded="false" 
              aria-controls="collapseMenu"
              style={{ marginBottom: 0 }}>
              <i className="bi bi-chevron-down"></i>
            </button>

            <div className="collapse submenu" id="collapseMenu" 
            style={{ position: 'absolute', zIndex: 1000, right: '-10%'}}>
              <div className='card card-body'>
                <div className='dropdown-user-info'>
                  <p className='user-email'>
                    {/*currentUser?.role != 'client' ? currentUser?.role : ''*/}
                    BrayanRivera@gmail.com
                  </p>
                  <ProfilePhoto width={120} height={120}/>
                  <p>{/*`Hola, ${currentUser?.username}`*/}¡Hola, Brayan!</p>

                  <div className='options'>
                    <a href="/">Inicio</a>
                    <a href="/">Cerrar sesión</a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header;