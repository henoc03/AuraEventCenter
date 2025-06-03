import React from "react";
// import "../../style/menu-cards.css";
import MenuDefault from "../../assets/images/default_no_image.jpg";

const CompactMenu = ({ menu }) => {
  return (
    <div className="compact-menu">
      {/*TODO: Agregar las imagenes desde el backend*/}
      <img
        src={MenuDefault}
        alt={`Imagen de ${menu.NAME}`}
        className="compact-menu-image"
      />
      <div className="compact-menu-info">
        <h3><strong>{menu.NAME}</strong></h3>
        <span className="compact-menu-link">Ver más &gt; </span>
      </div>
    </div>
  );
};

export default CompactMenu;
