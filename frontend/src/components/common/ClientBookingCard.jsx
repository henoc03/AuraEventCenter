import React from "react";
import PropTypes from "prop-types";
import "../../style/admin-bookings.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendar } from '@fortawesome/free-solid-svg-icons';

const ClientBookingCard = ({ booking, onView, onDelete, onEdit }) => {
  const {
    bookingName,
    eventDate,
    startTime,
    endTime,
    status,
  } = booking;

  const formattedDate = eventDate
    ? new Date(eventDate).toLocaleDateString("es-CR", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "Fecha no disponible";

  const getStatusClass = (status) => {
  const normalized = status.toLowerCase();
  switch (normalized) {
    case "completada":
      return "status-completed-font";
    case "en_progreso":
      return "status-in-progress-font";
    case "cancelada":
      return "status-cancelled-font";
    case "pendiente":
    default:
      return "status-pending-font";
  }
};

  return (
     <div className="booking-card-horizontal">
      <FontAwesomeIcon icon={faCalendar} className="booking-card-icon" />

      <div className="booking-card-content">
        <h3 className="booking-card-title">{bookingName}</h3>
        <p className="booking-card-date-time">
          {formattedDate} • {startTime.slice(11, 16)} - {endTime.slice(11, 16)}
        </p>
        <p className={`booking-card-status ${getStatusClass(status)}`}>{status.charAt(0).toUpperCase() + status.slice(1)}</p>

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
    eventDate: PropTypes.string,
    status:PropTypes.string,
    startTime: PropTypes.string,
    endTime: PropTypes.string,
    zones: PropTypes.arrayOf(PropTypes.string)
  }).isRequired,
  onView: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired,
};

export default ClientBookingCard;
