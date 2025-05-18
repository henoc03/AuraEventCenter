import React from "react";
import "../../style/expanded-room.css";
import SalaDefault from "../../assets/images/salas/sala2.png";

const ExpandedRoom = ({ room, onClose }) => {
  return (
<div className="expanded-room">
  <button onClick={onClose} className="close-expanded-room">✕</button>
  <img
    src={SalaDefault}
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
