import React from "react";
import "../../style/service-card.css";
import defaultImage from "../../assets/images/default_no_image.jpg";

const DEFAULT_ROUTE = "http://localhost:1522";

const ServiceCard = ({ service, onView, onEdit, onDelete }) => {
  const isActive = service.active === 1;
  return (
    <div className="service-card">
      <img
        src={service.imagePath && service.imagePath.trim() !== ""
                    ? `${DEFAULT_ROUTE}/${service.imagePath}`: defaultImage}
        alt={`Imagen del servicio ${service.name}`}
        className="service-card-img-top"
      />
      

      <div className="service-card-body">
        <h3 className="servide-card-title">{service.name}</h3>
        <h2>
          <p className="service-card-status-text">
            <span className={`status-indicator ${isActive ? "active" : "inactive"}`}></span>
            {isActive ? "Activo" : "Inactivo"}
          </p>
        </h2>

        <div className="service-card-buttons">
          <button className="btn btn-primary button" onClick={() => onDelete(service)}>
            Eliminar
          </button>
          <button className="btn btn-primary button" onClick={() => onEdit(service)}>
            Editar
          </button>
          <button className="btn btn-primary button" onClick={() => onView(service)}>
            Visualizar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ServiceCard;
