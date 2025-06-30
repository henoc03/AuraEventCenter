import React from "react";
import PropTypes from "prop-types";

const BookingCard = ({ booking, onView, onDelete, onEdit }) => {
	const {
		event_type, 
		booking_name, 
		event_date, 
		status = "pendiente"
	} = booking;

	const statusClass = status.toLowerCase() === "completada" ? "active" : "inactive";

  return (
		<div className="booking-card-container">
			<div className="booking-card-info">
				<h3 className="booking-card-type">{event_type} - {booking_name}</h3>
				<p className="reservation-card-date">{event_date}</p>
			</div>

			<p className="product-card-status-text">
				<span className={`status-indicator ${statusClass}`}></span>
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
    event_type: PropTypes.string.isRequired,
    booking_name: PropTypes.string.isRequired,
    event_date: PropTypes.string.isRequired,
    status: PropTypes.string
  }).isRequired,
  onView: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired
};