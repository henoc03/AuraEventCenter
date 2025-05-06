import React from 'react';
import { useNavigate } from 'react-router-dom';
import Carousel from '../utils/CarouselFade';


function About() {
  const navigate = useNavigate(); // Hook para navegar
  const handleClick = () => {
    navigate('/acerca');
  };
  return (
    <div className="about-us-container">
    <section className="about-us">
      <div data-aos="fade-right" data-aos-duration="3000" data-aos-delay="200" className="social-container">
        <div className="social-icons">
          <a href="https://facebook.com" className="social-icon">
            <i className="fab fa-facebook-f"></i>
          </a>
          <a href="https://youtube.com" className="social-icon">
            <i className="fab fa-youtube"></i>
          </a>
          <a href="https://instagram.com" className="social-icon">
            <i className="fab fa-instagram"></i>
          </a>
        </div>
        <p className="follow-us">Síguenos</p>
      </div>
  
      <div data-aos="fade-right" data-aos-duration="3000" data-aos-delay="200" className="about-text">
        <div className="line-container">
          <hr className="line" />
          <h2>Conócenos</h2>
        </div>
        <p>
        El Centro de Convenciones Aura es una joya arquitectónica que fusiona modernidad, sostenibilidad y elegancia. Inspirado en la rica biodiversidad y el patrimonio cultural de la región, su diseño busca ofrecer experiencias inigualables en un entorno que respeta el equilibrio con la naturaleza. Cada rincón de este centro ha sido cuidadosamente pensado para brindar versatilidad y sofisticación, creando un espacio donde los eventos y encuentros trascienden, en armonía con un ambiente único, responsable y lleno de autenticidad.
        </p>
        <button onClick={handleClick}>Aprende más acerca de nosotros</button>
      </div>
  
      <div data-aos="fade-left" data-aos-duration="3000" data-aos-delay="200" className="carousel-container">
        <Carousel />
      </div>
    </section>
  </div>
  
  );
}

export default About;
