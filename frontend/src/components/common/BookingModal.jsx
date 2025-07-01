
import PropTypes from "prop-types";
import "../../style/booking-modal.css";

const BookingModal = ({ isOpen, mode, booking, onClose, onDelete }) => {
  
  const isViewMode = mode === "view";
  const isDeleteMode = mode === "delete";

  const handleDelete = () => {
    onDelete(booking);
    onClose();
  };

  if (!isOpen || !booking) return null;

  return (
    <div className="booking-modal-overlay">
      <div className="booking-modal-content">
        <button className="booking-modal-close" onClick={onClose}>×</button>

        {isViewMode && booking && (
          <div className="info-container">
            <h3><strong>{booking.booking_name}</strong></h3>

            <div className="modal-section">
              <h5><strong>Contacto</strong></h5>
              <p><strong>Nombre:</strong> {booking.owner}</p>
              <p><strong>Correo:</strong> {booking.email}</p>
              <p><strong>Teléfono:</strong> {booking.phone}</p>
            </div>

            <div className="modal-section">
              <h5><strong>Detalles</strong></h5>
              <p><strong>Tipo:</strong> {booking.event_type}</p>
              <p><strong>Fecha:</strong> {booking.event_date?.split("T")[0]}</p>
              <p><strong>Horario:</strong> {booking.start_time.slice(11, 16)} - {booking.end_time.slice(11, 16)}</p>
            </div>

            {booking.zones?.length > 0 && (
              <div className="modal-section">
                <h5><strong>Salas</strong></h5>
                <ul>{booking.zones.map((z) => <li className="booking-list" key={z}>{z}</li>)}</ul>
              </div>
            )}

            {booking.services?.length > 0 && (
              <div className="modal-section">
                <h5><strong>Servicios</strong></h5>
                <ul>{booking.services.map((s) => <li className="booking-list"key={s}>{s}</li>)}</ul>
              </div>
            )}

            {booking.menus?.length > 0 && (
              <div className="modal-section">
                <h5><strong>Menús</strong></h5>
                <ul>{booking.menus.map((m) => <li className="booking-list" key={m}>{m}</li>)}</ul>
              </div>
            )}

            {booking.equipments?.length > 0 && (
              <div className="modal-section">
                <h5><strong>Equipos</strong></h5>
                <ul>{booking.equipments.map((e) => <li className="booking-list" key={e}>{e}</li>)}</ul>
              </div>
            )}
          </div>
        )}

        {isDeleteMode && booking && (
          <>
            <h2>¿Eliminar reserva?</h2>
            <p><strong>{booking.booking_name}</strong> será eliminada permanentemente.</p>
            <div className="booking-modal-actions">
              <button className="booking-delete-actions-btn" onClick={handleDelete} style={{ color: "red" }}>Eliminar</button>
              <button className="booking-delete-actions-btn" onClick={onClose}>Cancelar</button>
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
    start_time: PropTypes.string,            
    end_time: PropTypes.string,            
    id_card: PropTypes.string,                
    status: PropTypes.string,                
    owner: PropTypes.string,                  
    email: PropTypes.string,                   
    phone: PropTypes.string,                    
    zones: PropTypes.arrayOf(PropTypes.string), 
    services: PropTypes.arrayOf(PropTypes.string), 
    menus: PropTypes.arrayOf(PropTypes.string), 
    equipments: PropTypes.arrayOf(PropTypes.string) 
  }),
  onClose: PropTypes.func.isRequired,
  onDelete: PropTypes.func
};

export default BookingModal;
