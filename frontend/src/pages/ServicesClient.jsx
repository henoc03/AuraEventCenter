import React, {useEffect, useState} from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import "../style/services-client.css";
import heroImage from "../assets/images/services-hero.jpg";
import Hero from "../components/sections/RoomsServicesHero";
import Footer from "../components/common/Footer";
import LoadingPage from "../components/common/LoadingPage";

const DEFAULT_ROUTE = "http://localhost:1522";

// Componente de la pagina de servicios para el cliente
function ServicesClient() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    AOS.init();
  }, []);

  useEffect(() => {
    getServices();
  }, []);

  // Función pra traer los servicios de la base de datos
  const getServices = async () => {
    try {
      // Solicitud de todos los servicios al backend
      const res = await fetch(`${DEFAULT_ROUTE}/services/`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      if (!res.ok) {
        const errorData = await res.json();
        alert(errorData.message || "Error al obtener los servicios");
        return;
      }

      // Almacenar respuesta con los servicios
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
          <div 
            key={service.ADDITIONAL_SERVICE_ID}   className="service-container">
            <img 
              src="https://brownbrotherscatering.com/wp-content/uploads/Exploring-the-Importance-of-Good-Service-in-Catering.jpg"
              alt={service.NAME}
              data-aos={service.ADDITIONAL_SERVICE_ID %2 != 0 ? "fade-right" : "fade-left"}
              data-aos-duration="1500"
            />
            <div
              className="service-info-container"
              data-aos={service.ADDITIONAL_SERVICE_ID %2 != 0 ? "fade-left" : "fade-right"}
              data-aos-duration="1500"
            >
              <h3>{service.NAME}</h3>
              <p>{service.DESCRIPTION}</p>
              <p>{`Precio: ₡${service.PRICE.toLocaleString('es-CR')}`}</p>
              {service.NAME.toLowerCase().includes("catering") && (
                <a href="/menus" className="service-menu-link">
                  <button type='button'>Ver menús</button>
                </a>
              )}
            </div>
          </div>
        ))}
      </main>

      <Footer />
    </div>
  );
}

export default ServicesClient;