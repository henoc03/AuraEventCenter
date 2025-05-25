import React from "react";
import "../../style/expanded-room.css";
import DefaultRoom from "../../assets/images/salas/default_zone.jpg";

const ExpandedRoom = ({ room, onClose }) => {
    const DEFAULT_ROUTE = "http://localhost:1522";
  return (
<div className="expanded-room">
  <button onClick={onClose} className="close-expanded-room">✕</button>
  <img
    src={room.IMAGE_PATH && room.IMAGE_PATH.trim() !== "" ? `${DEFAULT_ROUTE}/${room.IMAGE_PATH}` : DefaultRoom}
    alt={`Imagen de ${room.NAME}`}
    className="expanded-room-image"
  />
  <div className="expanded-room-details">
    <h2>{room.NAME}</h2>
    <p>
     <strong> {room.TYPE} | Capacidad: {room.CAPACITY} personas</strong>
    </p>
    <p style={{ marginBottom: "20px" }}>
      ₡{room.PRICE}
    </p>
    <p>{room.DESCRIPTION}</p>
  </div>
</div>

  );
};

export default ExpandedRoom;
