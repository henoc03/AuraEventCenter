import React from "react";
import "../../style/equipment-card.css";
import defaultImage from "../../assets/images/default_no_image.jpg";

const DEFAULT_ROUTE = "http://localhost:1522";

const EquipmentCard = ({ equipment, onView, onEdit, onDelete }) => {
  return (
    <div className="equipment-card">
      <img
        src={equipment.imagePath ? `${DEFAULT_ROUTE}/${equipment.imagePath}` : defaultImage}
        alt={equipment.name}
        className="equipment-card-img-top"
      />
      <div className="equipment-card-body">
        <h3 className="equipment-card-title">{equipment.name}</h3>
        <h2><p><strong>Cantidad:</strong> {equipment.quantity}</p></h2>
        <div className="equipment-card-buttons">
          <button className="btn btn-primary button" onClick={() => onDelete(equipment)}>Eliminar</button>
          <button className="btn btn-primary button" onClick={() => onEdit(equipment)}>Editar</button>
          <button className="btn btn-primary button" onClick={() => onView(equipment)}>Visualizar</button>
        </div>
      </div>
    </div>
  );
};

export default EquipmentCard;