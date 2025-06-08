import Navigation from '../common/Navigation';


function Hero() {
  return (
   <section className="hero">
    <div className='home-nav-container'>
      <Navigation />
    </div>
    <h1 data-aos="fade-up" data-aos-duration="1500">Centro de Eventos Aura</h1>
    <h2 data-aos="fade-up" data-aos-delay="350" data-aos-duration="5500">Descubrí una experiencia única en un espacio moderno, sostenible y diseñado para todo tipo de eventos. 
      Versatilidad, tecnología y naturaleza en perfecta armonía.</h2>
    </section>
  )
}
export default Hero;