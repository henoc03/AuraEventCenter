import React from 'react';
import '../../style/roomCard.css'; // Import your CSS file for styling

function RoomCard ({name, image, state}) {
  return (
    <div className="card">
      <h2>{state ? "Publicada" : "No publicada"}</h2>
      <img src={image} className="card-img-top" alt={`Imagen de la sala ${name}`} />
      <div className="card-body">
        <h3 className="card-title">{name}</h3>
        <div className="buttons">
          <a href="#" className="btn btn-primary button">Borrar</a>
          <a href="#" className="btn btn-primary button">Editar</a>
          <a href="#" className="btn btn-primary button">Visualizar</a>
        </div>
      </div>
    </div>
  );
};

export default RoomCard;