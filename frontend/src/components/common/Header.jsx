import React, { useEffect, useState } from 'react';
import Logo from '../icons/Logo.jsx';
import DropDownMenu from './DropDownMenu.jsx'; 
import '../../style/header.css'
import {jwtDecode} from 'jwt-decode';

const DEFAULT_ROUTE = 'http://localhost:1522'

function Header({children}) {
  const [isMobile, setIsMobile] = useState(false);
  const [hamburgerMenuIsOpen, setHamburguerMenuIsOpen] = useState(false);
  const [name, setName] = useState("");
  const [lastname, setLastname] = useState("");
  const [role, setRole] = useState("");


  // Llamado a la funcion para traer y setear el nombre y rol de usuario
  useEffect(() => {
    getSetUserInfo();
  }, []);


  const getSetUserInfo= async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      return;
    }
    const sessionUserData = jwtDecode(token);

    try {
      const res = await fetch(`${DEFAULT_ROUTE}/users/getNameLastnameRole/${sessionUserData.id}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!res.ok) {
        const errorData = await res.json();
        alert(errorData.message || 'Error traer la información de usuario');
        return;
      }

      const userData = await res.json();

      setName(userData.FIRST_NAME)
      setLastname(userData.LAST_NAME_1)
      setRole(userData.USER_TYPE)
    } catch {
      alert('Ocurrió un error al obtener la información de usuario.');
      
    }
  };

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
            <p>{role == "admin"? "Administrador" : "Cliente"}</p>
          </div>

          <DropDownMenu/>
        </div>
      </div>
    </header>
  )
}

export default Header;