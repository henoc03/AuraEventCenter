import React, {useEffect, useState } from "react";
import { useForm} from 'react-hook-form';
import {jwtDecode} from 'jwt-decode';
import { useNavigate } from "react-router-dom";
import Header from "../components/common/Header";
import ProfilePhoto from "/default-image.jpg"
import SideNav from "../components/common/SideNav.jsx"
import AlertMessage from "../components/common/AlertMessage.jsx"
import LoadingPage from "../components/common/LoadingPage.jsx";
import '../style/auth.css';
import '../style/profile.css';


const DEFAULT_ROUTE = "http://localhost:1522";

function Profile({sections}) {
  const { register, handleSubmit, reset, formState: { errors, isValid } } = useForm({ mode: 'onChange' });
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [lastname, setLastname] = useState("");
  const [role, setRole] = useState("");
  const [imageFile, setImageFile] = useState(null);
  // eslint-disable-next-line no-unused-vars
  const [imageName, setImageName] = useState("");
  const [imagePath, setImagePath] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    getSetUserInfo();
  // eslint-disable-next-line react-hooks/exhaustive-deps
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
      setImagePath(userData.PROFILE_IMAGE_PATH)
    } catch {
      alert('Ocurrió un error al obtener la información de usuario.');
      navigate('/login');
    } finally {
      setLoading(false);
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

    const formData = new FormData();
    formData.append('firstName', data.name);
    formData.append('lastName1', apellido1);
    formData.append('lastName2', apellido2);
    formData.append('email', data.email);
    formData.append('phone', data.phone);
    formData.append('image', imageFile);
    
    try {
      const res = await fetch(`${DEFAULT_ROUTE}/users/profile/${sessionUserData.id}`, {
        method: 'PUT',
        body: formData
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

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImageName(file.name);
    }
  };

  // Ref para el input de imagen
  const imageInputRef = React.useRef(null);

  if (loading) return <LoadingPage />;

  // Maneja el click en el icono de editar
  const handleEditImageClick = (e) => {
    e.preventDefault();
    if (imageInputRef.current) {
      imageInputRef.current.click();
    }
  };

  return (
    <> 
      <div className="profile-header-container">
        <Header name={name} lastname={lastname} role={role} email={email}>
          {/*Menu de hamburguesa*/}
          <SideNav id="profile-sidenav-mobile" sections={sections} />
        </Header>
      </div>  

      <div className="profile-sidenav-main">
        <div id="profile-sidenav-desktop">
          <SideNav className="profile-sidenav" sections={sections} />
        </div>

        <div className="profile-main">
          {showSuccess && (
            <AlertMessage
              message={"Información actualizada con éxito"}
              type={"alert-floating"}
              onClose={() => setShowSuccess(false)}
              duration={3000}
              className={"success"}
            />
          )}

          <div className="profile-title-form-container">
            <h1>Información de perfil</h1>
            <div className="image-form-container">
              <div className="profile-image-container">
                <label className="upload-label">
                  <div className="edit-delete-icons">
                    <i
                      className="bi bi-pencil profile-edit-icon"
                      onClick={handleEditImageClick}
                      style={{ cursor: "pointer" }}
                    ></i>
                    <i
                      className="bi bi-x profile-delete-icon"
                      onClick={() => {setImageFile(null); setImagePath("")}}
                    ></i>
                  </div>
                  <img src={imagePath ? `${DEFAULT_ROUTE}/${imagePath}` : ProfilePhoto} alt="Foto de perfil editable"/>
                </label>
                <input
                  ref={imageInputRef}
                  id="profile-image-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  style={{ display: "none" }}
                />
              </div>

              <div className="user-info-form">
                <form onSubmit={handleSubmit(onSubmit)} className="auth-form" id="profile-auth-form">
                  <label htmlFor="name">
                    Nombre <span style={{ color: 'red' }}>*</span>
                  </label>
                  <input
                    type="text"
                    placeholder={name}
                    {...register('name', { required: 'Nombre requerido' })}
                  />
                  {errors.name && <span className="error">{errors.name.message}</span>}

                  <label htmlFor="lastname">
                    Apellidos <span style={{ color: 'red' }}>*</span>
                  </label>
                  <input
                    type="text"
                    placeholder=""
                    {...register('lastname', { required: 'Apellidos requeridos' })}
                  />
                  {errors.lastname && <span className="error">{errors.lastname.message}</span>}
                  
                  <label htmlFor="email">
                    Correo electrónico <span style={{ color: 'red' }}>*</span>
                  </label>
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


                  <label htmlFor="phone">
                    Número telefónico <span style={{ color: 'red' }}>*</span>
                  </label>
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
  )
}

export default Profile;