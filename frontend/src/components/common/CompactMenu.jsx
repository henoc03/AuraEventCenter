import React from "react";
import "../../style/menu-cards.css";
import PropTypes from "prop-types";
import defaultImage from "../../assets/images/default_no_image.jpg";

const DEFAULT_ROUTE = "http://localhost:1522";

const CompactMenu = ({ menu, isBooking = false, isSelected = false, isNew = false }) => {
  let buttonLabel = "Agregar";
  if (isSelected && isNew) {
    buttonLabel = "Desagregar";
  } else if (isSelected && !isNew) {
    buttonLabel = "Agregado";
  }

  return (
    <div className={`compact-menu ${isSelected ? "menu-is-selected" : ""} ${isNew ? " menu-is-new" : ""}`}>
      <img
        src={menu.IMAGE_PATH && menu.IMAGE_PATH.trim() !== ""
                    ? `${DEFAULT_ROUTE}/${menu.IMAGE_PATH}`: defaultImage}
        alt={`Imagen de ${menu.NAME}`}
        className="compact-menu-image"
      />
      <div className="compact-menu-info">
        <h3><strong>{menu.NAME}</strong></h3>
        {!isBooking ? (
          <span className="compact-menu-link">Ver más &gt; </span>
        ) : (
          <button
            className={`add-menu-booking-button${isSelected ? " menu-is-selected" : ""}${isNew ? " menu-is-new" : ""}`}
            type="button"
          >
            {buttonLabel}
          </button>
        )}
      </div>
    </div>
  );
};

CompactMenu.propTypes = {
  menu: PropTypes.object.isRequired,
  isBooking: PropTypes.bool,
  isSelected: PropTypes.bool,
  isNew: PropTypes.bool,
};

export default CompactMenu;

