import React from "react";
import PropTypes from "prop-types";
import "../../style/compact-service.css";
import DefaultService from "../../assets/images/default_no_image.jpg";

const Compactservice = ({ service, isBooking = false, isSelected = false, isNew = false}) => {

  const DEFAULT_ROUTE = "http://localhost:1522";

  // Etiqueta para el boton
  let buttonLabel = "Agregar";
  if (isSelected && isNew) {
    buttonLabel = "Desagregar";
  } else if (isSelected && !isNew) {
    buttonLabel = "Agregado";
  }

  return (
    <div className={`compact-service ${isSelected ? "service-is-selected" : ""} ${isNew ? " service-is-new" : ""}`}>
      <img
        src={service.IMAGE_PATH && service.IMAGE_PATH.trim() !== "" ? `${DEFAULT_ROUTE}/${service.IMAGE_PATH}` : DefaultService}
        alt={`Imagen de ${service.NAME}`}
        className="compact-service-image"
      />
      <div className="compact-service-info">
        <h3><strong>{service.NAME}</strong></h3>
        {!isBooking ? (
          <span className="compact-service-link">Ver más &gt; </span>
        ) : (
          <button
            className={`add-service-booking-button${isSelected ? " service-is-selected" : ""}${isNew ? " service-is-new" : ""}`}
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
