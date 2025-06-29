import React from "react";
import PropTypes from "prop-types";
import "../../style/compact-room.css";
import DefaultRoom from "../../assets/images/salas/default_zone.jpg";

const CompactRoom = ({ room, isBooking = false, isSelected = false, isNew = false}) => {
  const DEFAULT_ROUTE = "http://localhost:1522";
  // Extract button label logic to a variable

  let buttonLabel = "Agregar";
  if (isSelected && isNew) {
    buttonLabel = "Desagregar";
  } else if (isSelected && !isNew) {
    buttonLabel = "Agregado";
  }

  return (
    <div className={`compact-room ${isSelected ? "room-is-selected" : ""} ${isNew ? " room-is-new" : ""}`}>
      <img
        src={room.IMAGE_PATH && room.IMAGE_PATH.trim() !== "" ? `${DEFAULT_ROUTE}/${room.IMAGE_PATH}` : DefaultRoom}
        alt={`Imagen de ${room.NAME}`}
        className="compact-room-image"
      />
      <div className="compact-room-info">
        <h3><strong>{room.NAME}</strong></h3>
        {!isBooking ? (
          <span className="compact-room-link">Ver más &gt; </span>
        ) : (
          <button
            className={`add-room-booking-button${isSelected ? " room-is-selected" : ""}${isNew ? " room-is-new" : ""}`}
            type="button"
          >
            {buttonLabel}
          </button>
        )}
      </div>
    </div>
  );
};

CompactRoom.propTypes = {
  room: PropTypes.object.isRequired,
  isBooking: PropTypes.bool,
  isSelected: PropTypes.bool,
  isNew: PropTypes.bool
};

export default CompactRoom;
