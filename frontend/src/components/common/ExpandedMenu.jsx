import React from "react";
import "../../style/menu-cards.css";
import MenuDefault from "../../assets/images/default_no_image.jpg";

const DEFAULT_ROUTE = "http://localhost:1522";

const ExpandedMenu = ({ menu, onClose }) => {
  return (
    <div className="expanded-menu">
      <button onClick={onClose} className="close-expanded-menu">✕</button>
      <img
        src={menu.IMAGE_PATH && menu.IMAGE_PATH.trim() !== ""
          ? `${DEFAULT_ROUTE}/${menu.IMAGE_PATH}` : MenuDefault
        }
        alt={`Imagen de ${menu.NAME}`}
        className="expanded-menu-image"
      />
      <div className="expanded-menu-details">
        <h2>{menu.NAME}</h2>
        <p>{menu.DESCRIPTION}</p>
        <p> {`Precio: ₡${menu.PRICE.toLocaleString('es-CR')}`} | {menu.AVAILABLE === 1 ? "Disponible" : "No disponible"}</p>
        <h3>Productos</h3>
        <ul>
          {menu.PRODUCTS && menu.PRODUCTS.length > 0 ? (
            menu.PRODUCTS.map((product, idx) => (
              <li key={idx}>- {product.NAME}</li>
            ))
          ) : (
            <li>No hay productos</li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default ExpandedMenu;
