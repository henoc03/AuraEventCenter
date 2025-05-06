import React, { useEffect, useState } from 'react';
import ProfilePhoto from '../icons/ProfilePhoto.jsx'
import {jwtDecode} from 'jwt-decode';
import '../../style/dropDownMenu.css'
//import { useNavigate } from "react-router-dom";

const DEFAULT_ROUTE = 'http://localhost:1522'

function DropDownMenu() {
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState(false);
  const [email, setEmail] = useState(false);


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
      const res = await fetch(`${DEFAULT_ROUTE}/users/getNameEmail/${sessionUserData.id}`, {
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
      setEmail(userData.LAST_NAME_1)
      setLoading(true);
    } catch {
      alert('Ocurrió un error al obtener la información de usuario.');
      
    } finally {
      () => setLoading(true)
    }
  };

  if (loading) {return (
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
        <ProfilePhoto/>
      </button>

      <div className="collapse submenu" id="collapseMenu" 
      style={{ position: 'absolute', zIndex: 1000, right: '-20%', top: '96%'}}>
        <div className='card card-body'>
          <div className='dropdown-user-info'>
            <p className='user-email'>
              {email}
            </p>
            <ProfilePhoto width={100} height={100} className="drop-down-photo"/>
            <p>{`¡Hola, ${name}!`}</p>

            <div className='options'>
              <a href="/">Inicio</a>
              <a href="/">Cerrar sesión</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )}
}

export default DropDownMenu;