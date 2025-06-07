import React from 'react';
import {useState} from 'react';
// import AddEditserviceModal from './AddEditserviceModal';
import defaultImage from '../../assets/images/default_no_image.jpg'
import '../../style/service-card.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSquare } from '@fortawesome/free-solid-svg-icons';

const DEFAULT_ROUTE = "http://localhost:1522";

// Componente para la tarjeta de un servicio adicional en la vista de administrador
function ServiceCard ({service, onClose}) {
  const [isDeleted, setIsDeleted] = useState(false);
  const [isEditClicked, setIsEditClicked] = useState(false);
  const [isViewClicked, setIsViewClicked] = useState(false);

  // Maneja el cerrar la vista de un servicio
  const handleClose = () => {
    setIsViewClicked(false);
    if (onClose) {
      onClose();
    }
  };

  // Manejar cuando se clickea el botón de eliminar
  if (isDeleted) {
    const handleDelete  = async () => {
      try {
        const res = await fetch(`${DEFAULT_ROUTE}/services/${service.ADDITIONAL_SERVICE_ID}`, {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' }
        });

        if (!res.ok) {
          const errorData = await res.json();
          alert(errorData.message || 'Error al eliminar el servicio adicional');
          return;
        }
        
      } catch (error) {
        console.error('Error:', error);
        alert('Ocurrió un error al eliminar el servicio adicional.');
      }
      setIsDeleted(true);
    }
    handleDelete();
  }

  return (
    <>
      <div className={`service-card ${isDeleted ? "service-deleted":""}`}>
        <img src={service.IMAGE_PATH || defaultImage} className="service-card-img-top" alt={`Imagen del servicio ${service.NAME}`} />
        <div className="service-card-body">
          <h3 className="servide-card-title">{service.NAME}</h3>
          <h2>
            <FontAwesomeIcon icon={faSquare} className={service.ACTIVE == 1 ? "service-status-indicator active" : "service-status-indicator inactive"} /> {service.ACTIVE ?  "Publicada" : " No publicada"}
          </h2>
          <div className="service-card-buttons">
            <a href="#" className="btn btn-primary button" onClick={() => setIsDeleted(true)}>Borrar</a>
            <a href="#" className="btn btn-primary button" onClick={() => setIsEditClicked(!isEditClicked)}>Editar</a>
            <a href="#" className="btn btn-primary button" onClick={() => setIsViewClicked(!isViewClicked)}>Visualizar</a>
          </div>
        </div>
      </div>

      {/* {isEditClicked && (
        <AddEditserviceModal 
        isModalOpen={true} 
        onClose={() => setIsEditClicked(false)}
        service = {service}
      />
      )} */}

      {isViewClicked && (
        <div className="service-info-modal" onClick={handleClose}>
          <div className="modal-service-info-content" onClick={(e) => e.stopPropagation()}>
            <button className="service-close-button" type="button" onClick={handleClose}><i class="bi bi-x-lg"></i></button>

            <div className='service-info-photo-container'>
              <img src={service.IMAGE_PATH || defaultImage} alt={`Foto del servicio ${service.NAME}`}/>
              <div className='service-info-content'>
                <h2>{service.NAME}</h2>
                <p>{`Precio: ₡${service.PRICE.toLocaleString('es-CR')}`}  |  {service.ACTIVE ?  "Disponible" : " No disponible"}</p>
                <p>{service.DESCRIPTION}</p>

                {service.NAME.toLowerCase().includes("catering") && (
                  <div className='menus-products-buttons'>
                    <a href="/admin/menus" className="service-menu-button">
                      <button type='button'>Ver menús</button>
                    </a>
                    <a href="/admin/productos" className="service-products-button">
                      <button type='button'>Ver productos</button>
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ServiceCard;