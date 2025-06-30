import React from "react";
import PropTypes from "prop-types";
import "../../style/equipment-card.css";
import DefaultImage from "../../assets/images/default_no_image.jpg";

const DEFAULT_ROUTE = "http://localhost:1522";

const CompactEquipment = ({ equipment, isBooking = false, isSelected = false, isNew = false }) => {
  let buttonLabel = "Agregar";
  if (isSelected && isNew) {
    buttonLabel = "Desagregar";
  } else if (isSelected && !isNew) {
    buttonLabel = "Agregado";
  }
  
  return (
    <div
      className={[
        "compact-equipment",
        isSelected ? "equipment-is-selected" : "",
        isSelected ? "equipment-is-new" : ""
      ].join(" ").trim()}
    >
      <img
        src={equipment.imagePath && equipment.imagePath.trim() !== ""
          ? `${DEFAULT_ROUTE}/${equipment.imagePath}` : DefaultImage}
        alt={`Imagen de ${equipment.name}`}
        className="compact-equipment-image"
      />
      <div className="compact-equipment-info">
        <h3>{equipment.name}</h3>
        {!isBooking ? (
          <span className="compact-equipment-link">Ver más &gt; </span>
        ) : (
          <button
            className={[
              "add-equipment-booking-button",
              isSelected ? "equipment-is-selected" : "",
              isNew ? "equipment-is-new" : ""
            ].join(" ").trim()}
            type="button"
          >
            {buttonLabel}
          </button>
        )}
      </div>
    </div>
  );
};
CompactEquipment.propTypes = {
  equipment: PropTypes.shape({
    name: PropTypes.string.isRequired,
    imagePath: PropTypes.string,
  }).isRequired,
  isBooking: PropTypes.bool,
  isSelected: PropTypes.bool,
  isNew: PropTypes.bool,
};

export default CompactEquipment;
