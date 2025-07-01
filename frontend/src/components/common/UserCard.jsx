import React from "react";
import "../../style/admin-users.css";

const UserCard = ({ user, onView, onEdit, onDelete }) => {
  const { name, email, status = "activo" } = user;
  const isActive = status.toLowerCase() === "activo";

  return (
    <div className="user-card-container">

      <div className="user-card-info">
        <h3 className="user-card-name">{name}</h3>
        <p className="user-card-email">{email}</p>
      </div>
      <p className="user-card-status-text">
       <span className={`status-indicator ${isActive ? "active" : "inactive"}`}></span>
       {isActive ? "Activo" : "Inactivo"}
      </p>

      <div className="user-card-actions">
        <button className="btn-user-card" onClick={() => onView(user)}>Visualizar</button>
        <button className="btn-user-card" onClick={() => onEdit(user)}>Editar</button>
        <button className="btn-user-card" onClick={() => onDelete(user)}>Eliminar</button>
      </div>
    </div>
  );
};

export default UserCard;
