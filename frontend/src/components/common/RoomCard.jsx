import React from 'react';
import {useState} from 'react';
import AddEditRoomModal from './AddEditRoomModal';
import RoomPhoto from '../../assets/images/salas/sala2.png'
import '../../style/room-card.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSquare } from '@fortawesome/free-solid-svg-icons';

const DEFAULT_ROUTE = "http://localhost:1522";

function RoomCard ({id, name, image, state, type, capacity, price, description, onClose}) {
  const [isDeleted, setIsDeleted] = useState(false);
  const [isEditClicked, setIsEditClicked] = useState(false);
  const [isViewClicked, setIsViewClicked] = useState(false);

  const handleClose = () => {
    setIsViewClicked(false);
    if (onClose) {
      onClose();
    }
  };

  if (isDeleted) {
    const handleDelete  = async () => {
      try {
        const res = await fetch(`${DEFAULT_ROUTE}/zones/${id}`, {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' }
        });

        if (!res.ok) {
          const errorData = await res.json();
          alert(errorData.message || 'Error al eliminar la zona');
          return;
        }
        
      } catch (error) {
        console.error('Error:', error);
        alert('Ocurrió un error al eliminar la zona.');
      }
      setIsDeleted(true);
    }
    handleDelete();
  }


  return (
    <>
      <div className={`room-card ${isDeleted ? "deleted":""}`}>
        <img src={image} className="card-img-top" alt={`Imagen de la sala ${name}`} />
        <div className="card-body">
          <h3 className="card-title">{name}</h3>
          <h2>
            <FontAwesomeIcon icon={faSquare} className={state == 1 ? "status-indicator active" : "status-indicator inactive"} /> {state ?  "Publicada" : " No publicada"}
          </h2>
          <div className="buttons">
            <a href="#" className="btn btn-primary button" onClick={() => setIsDeleted(true)}>Borrar</a>
            <a href="#" className="btn btn-primary button" onClick={() => setIsEditClicked(!isEditClicked)}>Editar</a>
            <a href="#" className="btn btn-primary button" onClick={() => setIsViewClicked(!isViewClicked)}>Visualizar</a>
          </div>
        </div>
      </div>

      {isEditClicked && (
        <AddEditRoomModal 
        isModalOpen={true} 
        onClose={() => setIsEditClicked(false)}
        id={id}
        name={name}
        type={type}
        price={price}
        capacity={capacity}
        description={description}
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
                <p>{type}   |   Capacidad: {capacity} personas</p>
                <p>{price}</p>
                <p>{description}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default RoomCard;