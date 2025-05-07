import React, {useEffect, useState } from "react";
import { useForm} from 'react-hook-form';
import Header from "../components/common/Header";
import SideBar from "../components/common/SideBar.jsx";
import DefaultProfilePhoto from '../assets/images/default-profile-photo.png'
import '../style/auth.css';
import '../style/profile.css';

const DEFAULT_ROUTE = 'http://localhost:1522'

function Profile() {
  const [currentUser, setCurrentUser] = useState([]);

  useEffect(() => {
    fetch(`${DEFAULT_ROUTE}/current_user`)
      .then(res => res.json())
      .then(data => setCurrentUser(data))
      .catch(error => console.error('Error fetching user data:', error));
  }, []);

  const editableProfilePhoto = currentUser?.profile_photo || DefaultProfilePhoto;

  const {register, handleSubmit, formState: { errors, isValid } } = useForm({ mode: 'onChange' });

  const onSubmit = (data) => {
    console.log('Profile:', data);
  };

  return (
    <>   
      <Header>
        <ul>
          <li><a href="/profile"><i className="bi bi-person-fill"></i><span>Perfil</span></a></li>
          <li><a href="/account"><i className="bi bi-gear"></i><span>Cuenta</span></a></li>
          <li><a href="/privacy"><i className="bi bi-lock-fill"></i><span>Privacidad</span></a></li>
          <li><a href="/*"><i className="bi bi-bell-fill"></i><span>Notificaciones</span></a></li>
          <li><a href="/*"><i className="bi bi-eye"></i><span>Apariencia</span></a></li>
        </ul>
      </Header>

      <div className="main-container">
        <SideBar className="side-bar">
          <ul>
            <li><a href="/profile"><i className="bi bi-person-fill"></i><span>Perfil</span></a></li>
            <li><a href="/account"><i className="bi bi-gear"></i><span>Cuenta</span></a></li>
            <li><a href="/privacy"><i className="bi bi-lock-fill"></i><span>Privacidad</span></a></li>
            <li><a href="/*"><i className="bi bi-bell-fill"></i><span>Notificaciones</span></a></li>
            <li><a href="/*"><i className="bi bi-eye"></i><span>Apariencia</span></a></li>
          </ul>
        </SideBar>

        <div className="main">
          <div className="profile-container">
            <h1>Información de perfil</h1>
            <div className="image-form-container">
              <div className="image-container">
                <img src={editableProfilePhoto} alt="Foto de perfil editable" className="editable-profile-photo" width='400' height='400'/>
                <i className="bi bi-pencil edit-icon"></i>
              </div>
              <div className="user-info-form">
                <form onSubmit={handleSubmit(onSubmit)} className="auth-form">
                  <label htmlFor="name">Nombre *</label>
                  <input
                    type="text"
                    placeholder=""
                    {...register('name', { required: 'Nombre requerido' })}
                  />
                  {errors.name && <span className="error">{errors.name.message}</span>}

                  <label htmlFor="lastname">Apellidos *</label>
                  <input
                    type="text"
                    placeholder=""
                    {...register('lastname', { required: 'Apellidos requeridos' })}
                  />
                  {errors.lastname && <span className="error">{errors.lastname.message}</span>}
                  
                  <label htmlFor="email">Correo electrónico *</label>
                  <input
                    type="email"
                    placeholder=""
                    {...register('email', {
                      required: 'Email requerido',
                      pattern: {
                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                        message: 'Formato de email inválido'
                      }
                    })}
                  />
                  {errors.email && <span className="error">{errors.email.message}</span>}


                  <label htmlFor="phone">Número telefónico *</label>
                  <input
                    type="tel"
                    placeholder=""
                    {...register('phone', {
                      required: 'Teléfono requerido',
                      pattern: {
                        value: /^[0-9]{8}$/,
                        message: 'Solo números (8 dígitos)'
                      }
                    })}
                  />
                  {errors.phone && <span className="error">{errors.phone.message}</span>}

                  <button type="submit" disabled={!isValid} className={`save-button ${isValid ? 'active' : ''}`} >
                    Guardar
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Profile;