import React from "react";
import PropTypes from "prop-types";
import "../../style/compact-service.css";
import DefaultService from "../../assets/images/default_no_image.jpg";

const DEFAULT_ROUTE = "http://localhost:1522";

const Compactservice = ({ service, isBooking = false, isSelected = false, isNew = false}) => {
  const isCatering = (service.name || "").toLowerCase().includes("catering");
  const isEquipment = (service.name || "").toLowerCase().includes("equipo");

  // Etiqueta para el boton
  let buttonLabel = "Agregar";
  if ((isSelected && !isNew) ||
    (isSelected && isCatering) ||
    (isSelected && isEquipment)) {
      buttonLabel = "Agregado";
  } else if (isSelected && isNew) {
    buttonLabel = "Desagregar";
  }

  return (
    <div
      className={[
        "compact-service",
        isSelected && !isCatering && !isEquipment ? "service-is-selected" : "",
        isSelected && !isCatering && !isEquipment ? "service-is-new" : ""
      ].join(" ").trim()}
    >
      <img
        src={service.imagePath && service.imagePath.trim() !== "" ? `${DEFAULT_ROUTE}/${service.imagePath}` : DefaultService}
        alt={`Imagen de ${service.NAME}`}
        className="compact-service-image"
      />
      <div className="compact-service-info">
        <h3><strong>{service.name}</strong></h3>
        {!isBooking ? (
          <span className="compact-service-link">Ver más &gt; </span>
        ) : (
          <button
            className={[
              "add-service-booking-button",
              isSelected && !isCatering && !isEquipment ? "service-is-selected" : "",
              isNew && !isCatering && !isEquipment ? "service-is-new" : ""
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

Compactservice.propTypes = {
  service: PropTypes.object.isRequired,
  isBooking: PropTypes.bool,
  isSelected: PropTypes.bool,
  isNew: PropTypes.bool
};

export default Compactservice;
