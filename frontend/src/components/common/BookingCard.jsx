import React from "react";
import PropTypes from "prop-types";
import "../../style/admin-bookings.css";

const BookingCard = ({ booking, onView, onDelete, onEdit }) => {
	const { 
		bookingName, 
		eventDate, 
		status = "pendiente"
	} = booking;

	const getStatusClass = (status) => {
		const normalized = status.toLowerCase();
		switch (normalized) {
		case "completada":
			return "status-completed";
		case "en_progreso":
			return "status-in-progress";
		case "cancelada":
			return "status-cancelled";
		case "pendiente":
		default:
			return "status-pending";
		}
	};

	const statusClass = getStatusClass(status);

  return (
		<div className="booking-card-container">
			<div className="booking-card-info">
				<h3 className="booking-card-type">{bookingName}</h3>
				<p className="booking-card-date">{eventDate.slice(0, 10)}</p>
			</div>

			<p className="booking-card-status-text">
				<span className={`booking-status-indicator ${statusClass}`}></span>
				{status.charAt(0).toUpperCase() + status.slice(1)}
			</p>

			<div className="booking-card-sections">
				<button className="btn-booking-card" onClick={() => onView(booking)}>Visualizar</button>
        <button className="btn-booking-card" onClick={() => onEdit(booking)}>Editar</button>
        <button className="btn-booking-card" onClick={() => onDelete(booking)}>Eliminar</button>
			</div>
		</div>
	);
};

export default BookingCard;

BookingCard.propTypes = {
  booking: PropTypes.shape({
    eventType: PropTypes.string.isRequired,
    bookingName: PropTypes.string.isRequired,
    eventDate: PropTypes.string.isRequired,
    status: PropTypes.string
  }).isRequired,
  onView: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired
};