import React from "react";
import "../../style/equipment-card.css";
import DefaultImage from "../../assets/images/default_no_image.jpg";

const DEFAULT_ROUTE = "http://localhost:1522";

const CompactEquipment = ({ equipment }) => {
  return (
    <div className="compact-equipment">
      <img
        src={equipment.imagePath && equipment.imagePath.trim() !== ""
          ? `${DEFAULT_ROUTE}/${equipment.imagePath}` : DefaultImage}
        alt={`Imagen de ${equipment.name}`}
        className="compact-equipment-image"
      />
      <div className="compact-equipment-info">
        <h3>{equipment.name}</h3>
        <span className="compact-equipment-link">Ver más &gt;</span>
      </div>
    </div>
  );
};

export default CompactEquipment;
