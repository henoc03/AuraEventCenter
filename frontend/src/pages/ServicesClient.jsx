import React, {useEffect} from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import "../style/services-client.css";
import heroImage from "../assets/images/services-hero.jpg";
import Hero from "../components/sections/RoomsServicesHero"

function ServicesClient() {
  useEffect(() => {
    AOS.init();
  }, []);

  return (
    <div className="services-client-page">
      <Hero
        subtitle="Los servicios que necesitas"
        title="Servicios y atención a tu medida"
        message="Creamos momentos inolvidables con atención personalizada, servicios integrales y una atmósfera única para cada tipo de evento."
        imgSrc={heroImage}
      />
    </div>
  );
}

export default ServicesClient;