import React from "react";
import "../../style/client-hero.css";
import heroImage from "../../assets/images/clienthero.jpeg";
function ClientHero() {
  return (
    <section className="client-hero">
      <div className="client-hero-text">
        <p className="client-hero-subtitle">Tu evento, tu espacio</p>
        <h1 className="client-hero-title">
          Transforma tu evento en una experiencia inolvidable
        </h1>
        <p className="client-hero-description">
          Creamos momentos únicos con atención personalizada, espacios
          versátiles y todos los servicios que necesitas para hacer realidad
          cualquier tipo de evento.
        </p>
      </div>
      <div
        className="client-hero-image"
        style={{ backgroundImage: `url(${heroImage})` }}
      ></div>
    </section>
  );
}

export default ClientHero;
