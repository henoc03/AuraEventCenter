import React from 'react';
import {useState} from 'react';
import AddEditMenuModal from './AddEditMenuModal';
import AlertMessage from "./AlertMessage.jsx";
import defaultImage from '../../assets/images/default_no_image.jpg'
import '../../style/menu-admin-card.css';

const DEFAULT_ROUTE = "http://localhost:1522";

// Componente para la tarjeta de un menú en la vista de administrador
function MenuAdminCard ({id, menu, onClose, onSuccess}) {
  const [isDeleted, setIsDeleted] = useState(false);
  const [isEditClicked, setIsEditClicked] = useState(false);
  const [isViewClicked, setIsViewClicked] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [showDeleteSuccess, setShowDeleteSuccess] = useState(false);

  // Maneja el cerrar la vista de un servicio
  const handleClose = () => {
    setIsViewClicked(false);
    if (onClose && !isViewClicked) {
      onClose();
    }
  };

  // Manejar cuando se clickea el botón de eliminar
  const handleDelete  = async () => {
    try {
      const res = await fetch(`${DEFAULT_ROUTE}/menus/${menu.MENU_ID}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' }
      });

      if (!res.ok) {
        const errorData = await res.json();
        if (onError) onError(errorData.message || 'Error al eliminar la zona');
        return;
      }
      
    } catch (error) {
      console.error('Error:', error);
      alert('Ocurrió un error al eliminar el menú.');
    }
    setIsDeleted(true);
    onSuccess();
  }

  console.log(menu.IMAGE_PATH && menu.IMAGE_PATH.trim() !== "" ? '${DEFAULT_ROUTE}/${menu.IMAGE_PATH}': defaultImage);

  return (
    <>
      {showDeleteSuccess && (
        <AlertMessage message="Menu eliminado con éxito" type="alert-floating" onClose={() => setShowDeleteSuccess(false)} duration={3000} className="success" />
      )}

      <div className={`menu-card ${isDeleted ? "menu-deleted":""}`}>
        <img src={menu.IMAGE_PATH && menu.IMAGE_PATH.trim() !== "" ? `${DEFAULT_ROUTE}/${menu.IMAGE_PATH}`: defaultImage} className="menu-card-img-top" alt={`Imagen del menú ${menu.NAME}`} />
        <div className="menu-card-body">
          <h3 className="menu-card-title">{menu.NAME}</h3>
            <p className="menu-card-status-text">
            <span className={`menu-status-indicator ${menu.AVAILABLE == 1 ? "active" : "inactive"}`}></span>
            {menu.AVAILABLE == 1 ? "Disponible" : "No disponible"}
            </p>
          <div className="menu-card-buttons">
            <a href="#" className="btn btn-primary button" onClick={() => setIsViewClicked(!isViewClicked)}>Visualizar</a>
            <a href="#" className="btn btn-primary button" onClick={() => setIsEditClicked(!isEditClicked)}>Editar</a>
            <a href="#" className="btn btn-primary button" onClick={() => setShowDeleteConfirmation(true)}>Eliminar</a>
            
    
          </div>
        </div>
      </div>

      {isEditClicked && (
        <AddEditMenuModal 
          menu={menu}
          isModalOpen={true} 
          onClose={() => { setIsEditClicked(false); onClose(); }}
          onSuccess={() => {
            if (typeof onSuccess === "function") onSuccess("Sala actualizada con éxito");
            setIsEditClicked(false);
            onSuccess();
          }}
          existingImagePath={menu.IMAGE_PATH}
          isAdd={false}
        />
      )}
      
      {isViewClicked && (
        <div className="menu-info-modal" onClick={handleClose}>
          <div className="modal-menu-info-content" onClick={(e) => e.stopPropagation()}>
            <button className="menu-close-button" type="button" onClick={handleClose}><i class="bi bi-x-lg"></i></button>

            <div className='menu-info-photo-container'>
              <img src={menu.IMAGE_PATH && menu.IMAGE_PATH.trim() !== "" ? `${DEFAULT_ROUTE}/${menu.IMAGE_PATH}`: defaultImage} alt={`Foto del menú ${menu.NAME}`}/>
              <div className='menu-info-content'>
                <h2>{menu.NAME}</h2>
                <p><strong>Descripción: </strong>{menu.DESCRIPTION}</p>
                <p><strong>Precio: ₡</strong>{parseFloat(menu.PRICE).toLocaleString()}  |  {menu.AVAILABLE ?  "Disponible" : " No disponible"}</p>

                <p><strong>Productos:</strong></p>
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
          </div>
        </div>
      )}

      {showDeleteConfirmation && (
        <div className="user-modal-overlay">
          <div className="user-modal-content">
            <button className="user-modal-close" onClick={() => setShowDeleteConfirmation(false)}>×</button>
            <h2 className="modal-title">¿Eliminar menú?</h2>
            <p><strong>{menu.NAME}</strong> será eliminada permanentemente.</p>
            <div className="user-modal-actions">
              <button
                className="btn"
                onClick={async () => {
                  await handleDelete();
                  setShowDeleteConfirmation(false);
                  setShowDeleteSuccess(true);
                }}
                style={{ color: "red" }}
              >
                Eliminar
              </button>
              <button className="btn" onClick={() => setShowDeleteConfirmation(false)}>Cancelar</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MenuAdminCard;