import React, {useEffect, useState} from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import "../style/services-client.css";
import heroImage from "../assets/images/services-hero.jpg";
import Hero from "../components/sections/ClientDefaultHero";
import Footer from "../components/common/Footer";
import LoadingPage from "../components/common/LoadingPage";
import defaultImage from "../assets/images/default_no_image.jpg"

const DEFAULT_ROUTE = "http://localhost:1522";

// Componente de la pagina de servicios para el cliente
function ServicesClient() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  // Estados para los filtros y búsqueda
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");

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

  const filteredAndSortedServices = services
  .filter((service) => {
    const matchesSearch = service.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  })
  .sort((a, b) => {
    return sortOrder === "asc" ? a.price - b.price : b.price - a.price;
  });


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
        {/* Filtros */}
        <div className="services-client-filters">
          <div className="service-search-input">
            <label htmlFor="search">Buscar: </label>
            <input
              id="search"
              type="text"
              placeholder="Buscar por nombre..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="filter-input"
            />
          </div>

          <div className="service-sort-input">
            <label htmlFor="sort">Ordenar: </label>
            <select
              id="sort"
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="filter-select"
            >
              <option value="asc">Precio: menor a mayor</option>
              <option value="desc">Precio: mayor a menor</option>
            </select>
          </div>
        </div>

        {filteredAndSortedServices.map((service, index) => (
          <div 
            key={service.ADDITIONAL_SERVICE_ID} className="service-container">
            <img 
              src={service.imagePath && service.imagePath.trim() !== ""
                                  ? `${DEFAULT_ROUTE}/${service.imagePath}`: defaultImage}
              alt={service.name}
              data-aos={index % 2 === 0 ? "fade-left" : "fade-right"}
              data-aos-duration="1500"
            />
            <div
              className="service-info-container"
              data-aos={index % 2 !== 0 ? "fade-left" : "fade-right"}
              data-aos-duration="1500"
            >
              <h3>{service.name}</h3>
              <p>{service.description}</p>
              <p><span>Precio: </span>{`₡${service.price.toLocaleString('es-CR')}`}</p>
              {service.name.toLowerCase().includes("catering") && (
                <a href="/servicios/menus" className="service-menu-link">
                  <button type='button'>Ver menús</button>
                </a>
              )}
              {service.name.toLowerCase().includes("equipo") && (
                <a href="/servicios/equipos" className="service-menu-link">
                  <button type='button'>Ver equipos</button>
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