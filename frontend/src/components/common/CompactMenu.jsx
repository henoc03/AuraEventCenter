import React from "react";
import "../../style/menu-cards.css";
import defaultImage from "../../assets/images/default_no_image.jpg";

const DEFAULT_ROUTE = "http://localhost:1522";

const CompactMenu = ({ menu }) => {
  return (
    <div className="compact-menu">
      <img
        src={menu.IMAGE_PATH && menu.IMAGE_PATH.trim() !== ""
                    ? `${DEFAULT_ROUTE}/${menu.IMAGE_PATH}`: defaultImage}
        alt={`Imagen de ${menu.NAME}`}
        className="compact-menu-image"
      />
      <div className="compact-menu-info">
        <h3>{menu.NAME}</h3>
        <span className="compact-menu-link">Ver más &gt; </span>
      </div>
    </div>
  );
};

export default CompactMenu;

