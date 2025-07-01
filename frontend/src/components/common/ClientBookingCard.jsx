import React from "react";
import PropTypes from "prop-types";
import "../../style/admin-bookings.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendar } from '@fortawesome/free-solid-svg-icons';

const ClientBookingCard = ({ booking, onView, onDelete, onEdit }) => {
  const {
    date,
    startTime,
    endTime,
    zones = []
  } = booking;

  const formattedDate = date
    ? new Date(date).toLocaleDateString("es-CR", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "Fecha no disponible";

  return (
     <div className="booking-card-horizontal">
      <FontAwesomeIcon icon={faCalendar} className="booking-card-icon" />

      <div className="booking-card-content">
        <h3 className="booking-card-title">Reserva {zones[0]}</h3>
        <p className="booking-card-date-time">
          {formattedDate} • {startTime} - {endTime}
        </p>

        <div className="booking-card-actions">
          <button onClick={() => onView(booking)} className="btn-booking-card">Detalles</button>
          <button onClick={() => onEdit(booking)} className="btn-booking-card">Editar</button>
          <button onClick={() => onDelete(booking)} className="btn-booking-card">Eliminar</button>
        </div>
      </div>
    </div>
  );
};

ClientBookingCard.propTypes = {
  booking: PropTypes.shape({
    bookingName: PropTypes.string,
    date: PropTypes.string,
    startTime: PropTypes.string,
    endTime: PropTypes.string,
    zones: PropTypes.arrayOf(PropTypes.string)
  }).isRequired,
  onView: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired,
};

export default ClientBookingCard;
