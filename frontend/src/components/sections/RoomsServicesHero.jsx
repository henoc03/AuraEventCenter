import Navigation from '../common/Navigation';
import '../../style/rooms-services-hero.css';

// Componente para el hero de la pantalla de servicios y salas
function RoomsServicesHero({subtitle, title, message, imgSrc}) {
  return (
    <section className="rooms-services-hero">
      <div className='services-navigation-container'>
        <Navigation />
      </div>
      <div className="info-img-hero-container">
        <div className = "hero-info-container">
          <h2 data-aos="fade-right" data-aos-duration="1500">{subtitle}</h2>
          <h1 data-aos="fade-right" data-aos-duration="1500">{title}</h1>
          <p data-aos="fade-right" data-aos-duration="1500">{message}</p>
        </div>
        <img data-aos="fade-left" data-aos-duration="1500" src={imgSrc} alt={`Imagen ${subtitle}`} />
      </div>
    </section>
  )
}
export default RoomsServicesHero;