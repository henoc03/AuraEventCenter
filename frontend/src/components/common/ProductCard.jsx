import React from "react";
import "../../style/admin-products.css";

const ProductCard = ({ product, onView, onEdit, onDelete }) => {
  const { name, description, price, status = "activo" } = product;
  const isActive = status.toLowerCase() === "activo";

  return (
    <div className="product-card-container">
      <div className="product-card-info">
        <h3 className="product-card-name">{name}</h3>
      </div>

      <p className="product-card-status-text">
        <span className={`status-indicator ${product.active ? "active" : "inactive"}`}></span>
        {product.active ? "Activo" : "Inactivo"}
      </p>

      <div className="product-card-actions">
<div className="product-card-actions">
  <button className="btn-product-card" onClick={() => onDelete(product)}>Eliminar</button>
  <button className="btn-product-card" onClick={() => onEdit(product)}>Editar</button>
  <button className="btn-product-card" onClick={() => onView(product)}>Visualizar</button>
</div>

      </div>
    </div>
  );
};

export default ProductCard;
