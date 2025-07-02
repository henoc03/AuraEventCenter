// components/sections/bookings/ConfirmBooking.jsx
import React from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";

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
        alert("Reserva creada con éxito");
        navigate("/inicio");
      } else {
        alert("Error al crear la reserva");
      }
    } catch (err) {
      console.error("Error al crear reserva:", err);
      alert("Hubo un error al enviar la reserva.");
    }
  };

  return (
    <div className="booking-client-step4">



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
