import React, {useEffect, useState } from "react";
import PropTypes from 'prop-types';
import {jwtDecode} from 'jwt-decode';
import { useNavigate } from "react-router-dom";
import LoadingPage from "../components/common/LoadingPage.jsx";
import Header from "../components/common/Header";
import SideNav from "../components/common/SideNav.jsx"
import StepBar from "../components/common/StepBar";
import '../style/edit-booking-client.css'


const DEFAULT_ROUTE = "http://localhost:1522";

// Componente para la página de edición de reservas para el cliente
function EditBookingClient({ sections }) {
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [lastname, setLastname] = useState("");
  const [role, setRole] = useState("");
  const [step, setStep] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
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

        // Guarda los datos traidos
        setName(userData.FIRST_NAME)
        setEmail(userData.EMAIL)
        setLastname(userData.LAST_NAME_1)
        setRole(userData.USER_TYPE)
      } catch {
        alert('Ocurrió un error al obtener la información de usuario.');
        navigate('/login');
      } finally {
        setLoading(false);
      }
    };

    getSetUserInfo();
  }, [navigate]);

  if (loading) return <LoadingPage />;

  // Nombres de los pasos
  const steps = [
    "Seleccionar sala",
    "Detalles de reserva",
    "Confirmar datos",
    "Finalizar"
  ];

  return (
    <>
      <div className="booking-header-container">
        <Header name={name} lastname={lastname} role={role} email={email}>
          {/*Menu de hamburguesa*/}
          <SideNav id="booking-sidenav-mobile" sections={sections} />
        </Header>
      </div>  

      <div className="booking-client-sidenav-main">
        <div id="booking-sidenav-desktop">
          <SideNav className="booking-sidenav" sections={sections} />
        </div>

        <div className="booking-client-content">
          <button type='button' className="back-btn-bookings-client" onClick={() => window.history.back()}>
            <i className="bi bi-arrow-left"></i> Regresar
          </button>

          <h1>Editar reserva</h1>

          {/* Barra de pasos */}
          <StepBar steps={steps} currentStep={step} /> 
        </div>   
      </div>  
    </>
  );
}

EditBookingClient.propTypes = {
  sections: PropTypes.array.isRequired,
};

export default EditBookingClient;