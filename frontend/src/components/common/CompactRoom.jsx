import React from "react";
import "../../style/compact-room.css";
import SalaDefault from "../../assets/images/salas/sala2.png";

const CompactRoom = ({ room }) => {
  return (
    <div className="compact-room">
      <img
        src={SalaDefault}
        alt={`Imagen de ${room.NAME}`}
        className="compact-room-image"
      />
      <div className="compact-room-info">
        <h3><strong>{room.NAME}</strong></h3>
        <span className="compact-room-link">Ver más &gt; </span>
      </div>
    </div>
  );
};

export default CompactRoom;
