import React, { useEffect, useState } from "react";
import "../../style/expanded-room.css";
import DefaultRoom from "../../assets/images/salas/default_zone.jpg";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";

const ExpandedRoom = ({ room, onClose }) => {
  const DEFAULT_ROUTE = "http://localhost:1522";
  const responsive = {
    superLargeDesktop: {
      breakpoint: { max: 4000, min: 1024 },
      items: 3,
    },
    desktop: {
      breakpoint: { max: 1024, min: 768 },
      items: 2,
    },
    tablet: {
      breakpoint: { max: 768, min: 464 },
      items: 1,
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 1,
    },
  };
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
    console.log("Cargando imágenes para la sala con ID:", room.ZONE_ID)
    fetchImages();
  }
}, [room]);


  return (
    <div className="expanded-room">
      <button onClick={onClose} className="close-expanded-room">✕</button>

     <div className="expanded-room-carousel">
  {filteredImages.length > 0 ? (
    <Carousel additionalTransfrom={0} arrows draggable infinite responsive={responsive}>
      {filteredImages.map((img) => (
        <img
          key={img.id}
          src={`${DEFAULT_ROUTE}/${img.path}`}
          alt={`Imagen de ${room.NAME}`}
          className="expanded-room-image"
            containerClass="carousel-container"
  itemClass="carousel-item"
        />
      ))}
    </Carousel>
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
        <p><strong>{room.TYPE} | Capacidad: {room.CAPACITY} personas</strong></p>
        <p style={{ marginBottom: "20px" }}>₡{room.PRICE}</p>
        <p>{room.DESCRIPTION}</p>
      </div>
    </div>
  );
};

export default ExpandedRoom;
