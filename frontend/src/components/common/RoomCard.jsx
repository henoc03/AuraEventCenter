import React from 'react';
import {useState} from 'react';
import AddEditRoomModal from './AddEditRoomModal';
import '../../style/roomCard.css'; // Import your CSS file for styling

function RoomCard ({name, image, state}) {
  const [isDeleted, setIsDeleted] = useState(false);
  const [isEditClicked, setIsEditClicked] = useState(false);

  return (
    <>
      <div className={`card ${isDeleted ? "deleted":""}`}>
        <h2>{state ? "Publicada" : "No publicada"}</h2>
        <img src={image} className="card-img-top" alt={`Imagen de la sala ${name}`} />
        <div className="card-body">
          <h3 className="card-title">{name}</h3>
          <div className="buttons">
            <a href="#" className="btn btn-primary button" onClick={() => setIsDeleted(!isDeleted)}>Borrar</a>
            <a href="#" className="btn btn-primary button" onClick={() => setIsEditClicked(!isEditClicked)}>Editar</a>
            <a href="#" className="btn btn-primary button">Visualizar</a>
          </div>
        </div>
      </div>

      {isEditClicked && (
        <AddEditRoomModal 
        isModalOpen={true} 
        onClose={() => setIsEditClicked(false)} 
      />
      )}
    </>
  );
};

export default RoomCard;