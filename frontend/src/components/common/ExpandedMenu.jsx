import React from "react";
// import "../../style/menu-cards.css";
import MenuDefault from "../../assets/images/default_no_image.jpg";

const ExpandedMenu = ({ menu, onClose }) => {
  return (
    <div className="expanded-menu">
      <button onClick={onClose} className="close-expanded-menu">✕</button>
      {/*TODO: Agregar las imagenes desde el backend*/}
      <img
        src={MenuDefault}
        alt={`Imagen de ${menu.NAME}`}
        className="expanded-menu-image"
      />
      <div className="expanded-menu-details">
        <h2>{menu.NAME}</h2>
        <p>{menu.DESCRIPTION}</p>
        <p> Precio: {menu.PRICE} | {menu.ACTIVE === 1 ? "Disponible" : "No disponible"}</p>
        <p><strong>Productos</strong></p>
        {/*TODO: Agregar los productos*/} 
      </div>
    </div>
  );
};

export default ExpandedMenu;
