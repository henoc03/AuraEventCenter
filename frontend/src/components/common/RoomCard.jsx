import React from 'react';
import {useState} from 'react';
import AddEditRoomModal from './AddEditRoomModal';
import '../../style/room-card.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSquare } from '@fortawesome/free-solid-svg-icons';

const DEFAULT_ROUTE = "http://localhost:1522";

function RoomCard ({id, name, image, state, type, capacity, price, description, onClose, onSuccess }) {
  const [isDeleted, setIsDeleted] = useState(false);
  const [isEditClicked, setIsEditClicked] = useState(false);
  const [isViewClicked, setIsViewClicked] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);


  const handleClose = () => {
    setIsViewClicked(false);
    if (onClose) {
      onClose();
    }
  };

    const handleDelete = async () => {
    try {
      const res = await fetch(`${DEFAULT_ROUTE}/zones/${id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' }
      });

      if (!res.ok) {
        const errorData = await res.json();
        if (onError) onError(errorData.message || 'Error al eliminar la zona');
        return;
      }

      if (onSuccess) onSuccess("Sala eliminada con éxito");
      setIsDeleted(true);

    } catch (error) {
      console.error('Error:', error);
      alert("Ocurrió un error al eliminar la zona.");
    }
  };
console.log(image);

  return (
    <>
      <div className={`room-card ${isDeleted ? "deleted":""}`}>
        <img src={image} className="card-img-top" alt={`Imagen de la sala ${name}`} />
        {console.log(image)}
        <div className="card-body">
          <h3 className="card-title">{name}</h3>
          <h2>
            <FontAwesomeIcon icon={faSquare} className={state == 1 ? "status-indicator active" : "status-indicator inactive"} /> {state ?  "Publicada" : " No publicada"}
          </h2>
          <div className="buttons">
            <a href="#" className="btn btn-primary button" onClick={(e) => { e.preventDefault(); setShowDeleteConfirmation(true); }}>Borrar</a>
            <a href="#" className="btn btn-primary button" onClick={() => setIsEditClicked(!isEditClicked)}>Editar</a>
            <a href="#" className="btn btn-primary button" onClick={() => setIsViewClicked(!isViewClicked)}>Visualizar</a>
          </div>
        </div>
      </div>

      {isEditClicked && (
        <AddEditRoomModal 
        isModalOpen={true} 
        onClose={() => setIsEditClicked(false)}
        onSuccess={() => {
        if (typeof onSuccess === "function") onSuccess("Sala actualizada con éxito");
            setIsEditClicked(false);
        }}
        id={id}
        name={name}
        type={type}
        price={price}
        capacity={capacity}
        description={description}
        isAdd={false}
      />
      )}

      {isViewClicked && (
        <div className="room-info-modal" onClick={handleClose}>
          <div className="modal-room-info-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-button" type="button" onClick={handleClose}><i className="bi bi-x-lg"></i></button>

            <div className='room-info-photo-container'>
              <img src={image} alt={`Foto de la sala ${name}`}/>
              <div className='room-info-content'>
                <h2>{name}</h2>
                <p><strong>Tipo: </strong>{type} | <strong>Capacidad: </strong> {capacity} personas</p>
                <p><strong>Precio: </strong>₡{parseFloat(price).toLocaleString()}</p>
                <p><strong>Descripción: </strong>{description}</p>
              </div>
            </div>
          </div>
        </div>
      )}
      {showDeleteConfirmation && (
        <div className="user-modal-overlay">
          <div className="user-modal-content">
            <button className="user-modal-close" onClick={() => setShowDeleteConfirmation(false)}>×</button>
            <h2 className="modal-title">¿Eliminar Sala?</h2>
            <p><strong>{name}</strong> será eliminada permanentemente.</p>
            <div className="user-modal-actions">
              <button
                className="btn"
                onClick={async () => {
                  await handleDelete();
                  setShowDeleteConfirmation(false);
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

export default RoomCard;