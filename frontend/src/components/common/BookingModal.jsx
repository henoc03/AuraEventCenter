import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import PropTypes from "prop-types";
import "../../style/booking-modal.css"; // puedes crear este archivo o reutilizar el anterior

const BookingModal = ({ isOpen, mode, booking, onClose, onDelete }) => {
  
  const isViewMode = mode === "view";
  const isDeleteMode = mode === "delete";

  const handleDelete = () => {
    onDelete(booking);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="booking-modal-overlay">
      <div className="booking-modal-content">
        <button className="booking-modal-close" onClick={onClose}>×</button>

        {isViewMode && booking && (
          <div className="info-container">
            <h3><strong>{booking.event_type}</strong></h3>
            <p><strong>Reservado por:</strong> {booking.booking_name}</p>
            <p><strong>Fecha:</strong> {booking.event_date}</p>
            <p><strong>Estado:</strong> {booking.status}</p>
          </div>
        )}

        {isDeleteMode && booking && (
          <>
            <h2>¿Eliminar reserva?</h2>
            <p><strong>{booking.event_type} - {booking.booking_name}</strong> será eliminada permanentemente.</p>
            <div className="booking-modal-actions">
              <button className="btn" onClick={handleDelete} style={{ color: "red" }}>Eliminar</button>
              <button className="btn" onClick={onClose}>Cancelar</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

BookingModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  mode: PropTypes.oneOf(["view", "delete"]).isRequired,
  booking: PropTypes.shape({
    event_type: PropTypes.string.isRequired,
    booking_name: PropTypes.string.isRequired,
    event_date: PropTypes.string.isRequired,
    guests: PropTypes.number,
    status: PropTypes.string
  }),
  onClose: PropTypes.func.isRequired,
  onDelete: PropTypes.func
};

export default BookingModal;
