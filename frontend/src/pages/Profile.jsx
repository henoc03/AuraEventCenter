import React, {useEffect, useState } from "react";
import { useForm} from 'react-hook-form';
import {jwtDecode} from 'jwt-decode';
import Header from "../components/common/Header";
import ProfilePhoto from "/default-image.jpg"
import SideNav from "../components/common/SideNav.jsx"
import AlertMessage from "../components/common/AlertMessage.jsx"
import '../style/auth.css';
import '../style/profile.css';
import { useNavigate } from "react-router-dom";


const DEFAULT_ROUTE = "http://localhost:1522";

function Profile({sections}) {
  const { register, handleSubmit, reset, formState: { errors, isValid } } = useForm({ mode: 'onChange' });
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [lastname, setLastname] = useState("");
  const [role, setRole] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${DEFAULT_ROUTE}/current_user`)
      .then(res => res.json())
      .then(data => setCurrentUser(data))
      .catch(error => console.error('Error fetching user data:', error));
  }, []);

  // Función para obtener información del usuario
  const getSetUserInfo = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      return;
    }

    const sessionUserData = jwtDecode(token);

    try {
      const res = await fetch(`${DEFAULT_ROUTE}/users/${sessionUserData.id}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!res.ok) {
        const errorData = await res.json();
        alert(errorData.message || 'Error traer la información de usuario');
        return;
      }

      const userData = await res.json();

      // Setea los campos del formulario con los datos traídos
      reset({
        name: userData.FIRST_NAME,
        lastname: `${userData.LAST_NAME_1} ${userData.LAST_NAME_2}`,
        email: userData.EMAIL,
        phone: userData.PHONE
      });

       // Guarda los datos traidos
        setName(userData.FIRST_NAME)
        setEmail(userData.EMAIL)
        setLastname(userData.LAST_NAME_1)
        setRole(userData.USER_TYPE)

        // Cambia el estado de la página
        setLoading(false);
    } catch {
      alert('Ocurrió un error al obtener la información de usuario.');
      navigate('/login');
    } finally {
      () => setLoading(true)
    }
  };

  // Función para actualizar los datos del usuario
  const onSubmit = async (data) => {
    const token = localStorage.getItem('token');
    if (!token) {
      return;
    }
    const sessionUserData = jwtDecode(token);

    const apellidos = data.lastname.trim().split(' ');

    const apellido1 = apellidos[0] || '';
    const apellido2 = apellidos[1] || '';

    const userToSend = {
      firstName: data.name,
      lastName1: apellido1,
      lastName2: apellido2,
      email: data.email,
      phone: data.phone
    };
    
    try {
      const res = await fetch(`${DEFAULT_ROUTE}/users/updateProfile/${sessionUserData.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userToSend)
      });

      if (!res.ok) {
        const errorData = await res.json();
        alert(errorData.message || 'Error al actualizar la información del usuario');
        return;
      }
      
      getSetUserInfo();
      setShowSuccess(true);
    } catch (error) {
      setShowSuccess(false);
      console.error('Error:', error);
      alert('Ocurrió un error al actualizar la información de usuario.');
      navigate('/login');
    }
  };

  if (!loading) {return (
    <>   
      <Header name={name} lastname={lastname} role={role} email={email}>
        {/*Menu de hamburguesa*/}
        <SideNav id="side-nav-mobile" sections={sections} />
      </Header>

      <div className="main-container">
        <div id="side-nav-desktop">
          <SideNav sections={sections} />
        </div>


        <div className="main">
          {showSuccess && (
            <AlertMessage
              message={"Información actualizada con éxito"}
              type={"alert-floating"}
              onClose={() => setShowSuccess(false)}
              duration={3000}
              className={"success"}
            />
          )}

          <div className="profile-container">
            <h1>Información de perfil</h1>
            <div className="image-form-container">
              <div className="image-container">
                <label htmlFor="image-upload" className="upload-label">
                  <i className="bi bi-pencil edit-icon"></i>
                  <img src={ProfilePhoto} alt="Foto de perfil editable" className="editable-profile-photo" width='400' height='400'/>
                </label>
                <input
                  id="image-upload"
                  type="file"
                  accept="image/*"
                />

              </div>
              <div className="user-info-form">
                <form onSubmit={(handleSubmit(onSubmit))} className="auth-form">
                  <label htmlFor="name">Nombre *</label>
                  <input
                    type="text"
                    placeholder={name}
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

                  <button onSubmit={onSubmit} type="submit" disabled={!isValid} className={`save-button ${isValid ? 'active' : ''}`} >
                    Guardar
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )}
}

export default Profile;