import React from 'react';
import Footer from "../components/common/Footer";
import Navigation from '../components/common/Navigation';
import AOS from "aos";
import "aos/dist/aos.css";
import '../style/about-page.css';
import headerImage from '../assets/images/contact-header.jpg';
import aboutImage from '../assets/images/about-image.jpg';

const AboutPage = () => {
const timelineData = [
  {
    year: "2018",
    title: "Fundación",
    description:  "Aura Event Center abre sus puertas con tres salas multifuncionales y una visión clara: redefinir la experiencia de eventos en la ciudad.",
    color: "#60A5FA"
  },
  {
    year: "2019",
    title: "Expansión Tecnológica",
    description: "Se incorporan sistemas audiovisuales de última generación y un equipo técnico especializado para eventos empresariales y culturales.",
    color: "#3B82F6"
  },
  {
    year: "2021",
    title: "Reconocimiento Regional",
    description: "Aura recibe el premio al Centro de Eventos del Año por la Asociación de Empresarios Locales.",
    color: "#0074d9"
  },
  {
    year: "2023",
    title: "Renovación y Nuevas Zonas",
    description: "Inauguramos nuevos espacios verdes y zonas VIP con diseño arquitectónico vanguardista.",
    color: "#4169E1"
  },
  {
    year: "2025",
    title: "Presencia Internacional",
    description: "Firmamos alianzas con agencias de eventos en Centroamérica y el Caribe.",
    color: "#1E3A8A"
  }
];


  return (
    <div className="about-page">
        
      <div className="about-navigation-container">
        <Navigation />
      </div>
      <header className="about-hero" style={{ backgroundImage: `url(${headerImage})` }}>
        <div className="about-overlay">
          <h1>Conócenos</h1>
        </div>
      </header>

      <main className="about-container">
         <button type='button' className="back-btn-about" onClick={() => window.history.back()}>
            <i className="bi bi-arrow-left"></i> Regresar
          </button>
        <section className="about-section">
          <h2>Quiénes Somos</h2>
          <p>
            En Aura Event Center somos más que un espacio para eventos: somos un equipo apasionado por crear experiencias memorables. 
            Desde celebraciones sociales hasta encuentros corporativos, nos dedicamos a ofrecer soluciones integrales para que cada 
            evento supere las expectativas. Nuestra combinación de tecnología, diseño elegante y atención personalizada nos ha convertido 
            en un referente en organización de eventos a nivel regional.
          </p>
        </section>

        <section className="about-section">
          <h2>Nuestra Historia</h2>
          <p>
            Aura Event Center nació en 2018 como un pequeño salón multifuncional con capacidad para 50 personas. Fundado por cuatro emprendedores apasionados 
            por el diseño y la logística de eventos, el centro fue creciendo a medida que aumentaba la demanda por espacios bien equipados y flexibles. 
            En 2020, durante la pandemia, apostamos por la transformación digital, ofreciendo eventos híbridos y mejorando nuestra infraestructura tecnológica. 
            En la actualidad, contamos con más de 5 salones temáticos, espacios al aire libre, y una reputación consolidada en la industria de eventos.
          </p>
          <img src={aboutImage} alt="Company history" className="about-section-image" />
        </section>

        <section className="about-section">
          <h2> Misión</h2>
          <p>
            Nuestra misión es ofrecer espacios modernos, versátiles y completamente equipados que permitan a nuestros clientes vivir experiencias 
            únicas en un entorno acogedor, seguro y profesional, promoviendo la excelencia en la organización de eventos.
          </p>
        </section>

        <section className="about-section">
          <h2>Visión</h2>
          <p>
            Ser reconocidos como el centro de eventos líder en innovación, sostenibilidad y calidad en servicio, expandiendo nuestras operaciones y generando 
            impacto positivo en la comunidad y el sector turístico.
          </p>
        </section>

        <section className="about-section">
          <h2>Trayectoria</h2>
            <div className="timeline-container">
                <div className="timeline-line"></div>
                {timelineData.map((item, index) => (
                    <div className="timeline-data"data-aos="fade-down"
                        data-aos-duration="1500">
                    <div className={`timeline-item ${index % 2 === 0 ? "top" : "bottom"}`} key={index}>
                    <div className="circle" style={{ borderColor: item.color }}>
                        {item.year}
                    </div>
                    <div className="content-about" >
                        <h3 style={{ color: item.color }}>{item.title}</h3>
                        <p>{item.description}</p>
                    </div>
                    </div>
                    </div>
                ))}
                </div>

        </section>
      </main>
      <Footer />
    </div>
  );
};

export default AboutPage;
