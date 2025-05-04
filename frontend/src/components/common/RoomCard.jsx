import React from 'react';
import {useState} from 'react';
import AddEditRoomModal from './AddEditRoomModal';
import RoomPhoto from '../../assets/images/salas/sala2.png'
import '../../style/roomCard.css'; // Import your CSS file for styling

function RoomCard ({name, image, state, type, capacity, price, description, onClose}) {
  const [isDeleted, setIsDeleted] = useState(false);
  const [isEditClicked, setIsEditClicked] = useState(false);
  const [isViewClicked, setIsViewClicked] = useState(false);

  const handleClose = () => {
    setIsViewClicked(false);
    if (onClose) {
      onClose();
    }
  };

  return (
    <>
      <div className={`room-card ${isDeleted ? "deleted":""}`}>
        <h2>{state ? "Publicada" : "No publicada"}</h2>
        <img src={image} className="card-img-top" alt={`Imagen de la sala ${name}`} />
        <div className="card-body">
          <h3 className="card-title">{name}</h3>
          <div className="buttons">
            <a href="#" className="btn btn-primary button" onClick={() => setIsDeleted(!isDeleted)}>Borrar</a>
            <a href="#" className="btn btn-primary button" onClick={() => setIsEditClicked(!isEditClicked)}>Editar</a>
            <a href="#" className="btn btn-primary button" onClick={() => setIsViewClicked(!isViewClicked)}>Visualizar</a>
          </div>
        </div>
      </div>

      {isEditClicked && (
        <AddEditRoomModal 
        isModalOpen={true} 
        onClose={() => setIsEditClicked(false)} 
      />
      )}

      {isViewClicked && (
        <div className="room-info-modal" onClick={handleClose}>
          <div className="modal-room-info-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-button" type="button" onClick={handleClose}><i class="bi bi-x-lg"></i></button>

            <div className='room-info-photo-container'>
              <img src={RoomPhoto} alt={`Foto de la sala ${name}`}/>
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