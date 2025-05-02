import React from "react";
import { useForm } from 'react-hook-form';
import Header from "../components/common/Header";
import Main from "../components/common/Main.jsx";
import SideBar from "../components/common/SideBar.jsx";
import ProfilePhoto from "../components/icons/ProfilePhoto.jsx";
import '../style/profile.css';

function Profile() {
  const {register, handleSubmit, formState: { errors, isValid } } = useForm({ mode: 'onChange' });

  const onSubmit = (data) => {
    console.log('Profile:', data);
  };

  return (
    <>    
      <Header/>
      <div className="main-container">
        <SideBar className="side-bar">
          <ul>
            <li><a href="/profile"><i class="bi bi-person-fill"></i><span>Perfil</span></a></li>
            <li><a href="/account"><i class="bi bi-gear"></i><span>Cuenta</span></a></li>
            <li><a href="/privacy"><i class="bi bi-lock-fill"></i><span>Privacidad</span></a></li>
            <li><a href="/notifications"><i class="bi bi-bell-fill"></i><span>Notificaciones</span></a></li>
            <li><a href="/appareance"><i class="bi bi-eye"></i><span>Apariencia</span></a></li>
          </ul>
        </SideBar>

        <div className="main">
          <div className="profile-container">
            <h1>Información de perfil</h1>
            <div className="image-form-container">
              <div className="image-container"><ProfilePhoto width='250' height='250'/></div>
              <div className="user-info-container">
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