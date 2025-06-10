import React, { useEffect, useState } from "react";
import "../../style/expanded-room.css";
import DefaultRoom from "../../assets/images/salas/default_zone.jpg";
import CarouselFadeExample from "../utils/CarouselFade"; // Asegúrate de que el path sea correcto

const ExpandedRoom = ({ room, onClose }) => {
  const DEFAULT_ROUTE = "http://localhost:1522";
  const [images, setImages] = useState([]);
  const filteredImages = images.filter((img) => String(img.id) !== "main");

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const res = await fetch(`${DEFAULT_ROUTE}/zones/${room.ZONE_ID}/images`);
        const data = await res.json();
        setImages(data);
      } catch (err) {
        console.error("Error al cargar imágenes de la sala:", err);
      }
    };

    if (room?.ZONE_ID) {
      console.log("Cargando imágenes para la sala con ID:", room.ZONE_ID);
      fetchImages();
    }
  }, [room]);

  // Convertir los paths en URLs absolutas para pasarlas al carrusel
  const imagePaths = filteredImages.map((img) => `${DEFAULT_ROUTE}/${img.path}`);

  return (
    <div className="expanded-room">
      <button onClick={onClose} className="close-expanded-room">✕</button>

      <div className="expanded-room-carousel">
        {imagePaths.length > 0 ? (
          <CarouselFadeExample imagePaths={imagePaths} className="carousel"/>
        ) : (
          <img
            src={room.IMAGE_PATH?.trim() ? `${DEFAULT_ROUTE}/${room.IMAGE_PATH}` : DefaultRoom}
            alt={`Imagen de ${room.NAME}`}
            className="expanded-room-image"
          />
        )}
      </div>

      <div className="expanded-room-details">
        <h2 className="room-title">{room.NAME}</h2>
        <p><span>Tipo: </span>{room.TYPE} | <span>Capacidad: </span>{room.CAPACITY} personas</p>
        <p style={{ marginBottom: "20px" }}><span>Precio: </span> {`₡${room.PRICE.toLocaleString('es-CR')}`}</p>
        <span>Descripción: </span>
        <p>{room.DESCRIPTION}</p>
      </div>
    </div>
  );
};

export default ExpandedRoom;
