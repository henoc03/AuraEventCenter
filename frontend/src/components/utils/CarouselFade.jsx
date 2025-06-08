// src/components/CarouselFadeExample.jsx
import React from 'react';
import { Carousel } from 'react-bootstrap';


const CarouselFadeExample = ({ imagePaths = [], className = "" }) => {
  if (imagePaths.length === 0) return null;

  return (
    <div className={`carousel-container ${className}`} style={{ height: "100%", width: "100%" }}>
      <Carousel fade interval={3000} indicators={false} controls={false}>
        {imagePaths.map((src, index) => (
          <Carousel.Item key={index}>
            <img
              className="d-block w-100 h-100"
              src={src}
              alt={`Imagen ${index + 1}`}
              style={{ objectFit: "cover" }}
            />
          </Carousel.Item>
        ))}
      </Carousel>
    </div>
  );
};


export default CarouselFadeExample;
