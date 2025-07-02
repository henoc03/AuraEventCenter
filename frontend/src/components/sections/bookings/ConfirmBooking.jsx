// components/sections/bookings/ConfirmBooking.jsx
import React, { useState } from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import AlertMessage from "../../common/AlertMessage.jsx";

const DEFAULT_ROUTE = "http://localhost:1522";

function ConfirmBooking({
  userId,
  step1Data,
  selectedRooms,
  selectedServices,
  selectedMenus,
  selectedEquipments,
  onBack
}) {
  const navigate = useNavigate();
  const [alert, setAlert] = useState(null);

  const handleSubmit = async () => {
    try {
        console.log("USER PARA CREAR:", userId);

      const res = await fetch(`${DEFAULT_ROUTE}/bookings/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId:userId,
          bookingInfo: step1Data,
          rooms: selectedRooms,
          services: selectedServices,
          menus: selectedMenus,
          equipments: selectedEquipments
        })
      });

      if (res.ok) {
        setAlert({ type: 'success', message: 'Reserva creada con éxito' });
        setTimeout(() => navigate("/inicio"), 2000); //
      } else {
         setAlert({ type: 'error', message: 'Error al crear la reserva' });
         setTimeout(() => setAlert(null), 3000); 
      }
    } catch (err) {
      console.error("Error al crear reserva:", err);
      setAlert({ type: 'error', message: 'Hubo un error al enviar la reserva.' });
      setTimeout(() => setAlert(null), 3000); 
    }
  };

  return (
    <div className="booking-client-step4">
      {alert && <AlertMessage type={alert.type} message={alert.message} />}

      <div style={{ display: 'flex', gap: '20px', marginTop: '2rem' , marginLeft: '13rem'}}>
        <button
          type="button"
          className="booking-next-step-button active"
          onClick={onBack}
        >
          Paso anterior
        </button>

        <button
          type="button"
          className="booking-next-step-button active"
          onClick={handleSubmit}
        >
          Guardar y crear reserva
        </button>
      </div>
    </div>
  );
}

ConfirmBooking.propTypes = {
  userId: PropTypes.number.isRequired,
  step1Data: PropTypes.object.isRequired,
  selectedRooms: PropTypes.array.isRequired,
  selectedServices: PropTypes.object.isRequired,
  selectedMenus: PropTypes.object.isRequired,
  selectedEquipments: PropTypes.object.isRequired,
  onBack: PropTypes.func.isRequired
};

export default ConfirmBooking;
