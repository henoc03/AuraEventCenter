import React, {useEffect, useState} from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import "../style/services-client.css";
import heroImage from "../assets/images/services-hero.jpg";
import Hero from "../components/sections/RoomsServicesHero";
import LoadingPage from "../components/common/LoadingPage";

const DEFAULT_ROUTE = "http://localhost:1522";

function ServicesClient() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    AOS.init();
  }, []);

  useEffect(() => {
    getServices();
  }, []);

  const getServices = async () => {
    try {
      const res = await fetch(`${DEFAULT_ROUTE}/services/`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      if (!res.ok) {
        const errorData = await res.json();
        alert(errorData.message || "Error al obtener los servicios");
        return;
      }

      const servicesData = await res.json();
      setServices(servicesData);
    } catch (error) {
      console.error("Error al obtener servicios:", error);
      alert("Ocurrió un error al obtener las salas.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingPage />;

  return (
    <div className="services-client-page">
      <Hero
        subtitle="Los servicios que necesitas"
        title="Servicios y atención a tu medida"
        message="Creamos momentos inolvidables con atención personalizada, servicios integrales y una atmósfera única para cada tipo de evento."
        imgSrc={heroImage}
      />

      <main className="services-client-main">
        <h2>Conoce nuestros servicios</h2>
        {services.map((service) => (
          <div key={service.ADDITIONAL_SERVICE_ID} className="service-container">
            <img src={service.IMAGE_PATH} alt={service.NAME} />
            <div className="service-info-container">
              <h3>{service.NAME}</h3>
              <p>{service.DESCRIPTION}</p>
              <p>{`Precio: ${service.PRICE}`}</p>
            </div>
          </div>
        ))}
      </main>
    </div>
  );
}

export default ServicesClient;