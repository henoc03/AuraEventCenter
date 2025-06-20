import React from "react";
import "../../style/equipment-card.css";
import DefaultImage from "../../assets/images/default_no_image.jpg";

const DEFAULT_ROUTE = "http://localhost:1522";

const ExpandedEquipment = ({ equipment, onClose }) => {
  return (
    <div className="expanded-equipment">
      <button onClick={onClose} className="close-expanded-equipment">✕</button>
      <img
        src={equipment.imagePath && equipment.imagePath.trim() !== ""
          ? `${DEFAULT_ROUTE}/${equipment.imagePath}` : DefaultImage}
        alt={`Imagen de ${equipment.name}`}
        className="expanded-equipment-image"
      />
      <div className="expanded-equipment-details">
        <h2>{equipment.name}</h2>
        <p style={{ marginBottom: "20px" }}>
          <span>Precio unitario: </span>{`₡${equipment.unitaryPrice?.toLocaleString('es-CR')}`} |
          <span> Cantidad: </span>{equipment.quantity}
        </p>
        <span>Descripción:</span>
        <p>{equipment.description}</p>
      </div>
    </div>
  );
};

export default ExpandedEquipment;
