import React, { useEffect, useState, useRef } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import "../style/equipment-client.css";
import Footer from "../components/common/Footer";
import Navigation from '../components/common/Navigation';
import LoadingPage from "../components/common/LoadingPage";
import CompactEquipment from "../components/common/CompactEquipment";
import ExpandedEquipment from "../components/common/ExpandedEquipment";
import Hero from "../components/sections/ClientDefaultHero";
import heroImage from "../assets/images/menus_hero.jpg"
import Pagination from "../components/common/Pagination";

const DEFAULT_ROUTE = "http://localhost:1522";

function EquipmentsClient() {
  const [equipments, setEquipments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedEquipment, setSelectedEquipment] = useState(null);
  const expandedEquipmentRef = useRef(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const [filterType, setFilterType] = useState("todos");


  // Paginación
  const [currentPage, setCurrentPage] = useState(1);
  const equipmentsPerPage = 4;

  useEffect(() => {
    AOS.init();
  }, []);

  useEffect(() => {
    getEquipments();
  }, []);

  const getEquipments = async () => {
    try {
      const res = await fetch(`${DEFAULT_ROUTE}/equipments`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      if (!res.ok) {
        const errorData = await res.json();
        alert(errorData.message || "Error al obtener los equipos");
        return;
      }

      const equipmentData = await res.json();
      setEquipments(equipmentData);


    } catch (error) {
      console.error("Error al obtener equipos:", error);
      alert("Ocurrió un error al obtener los equipos.");
    } finally {
      setLoading(false);
    }
  };

const uniqueTypes = [...new Set(equipments.map((e) => e.type))];

const filteredAndSortedEquipments = equipments
  .filter((equipment) => {
    const matchesSearch = equipment.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === "todos" || equipment.type.toLowerCase() === filterType.toLowerCase();
    return equipment.ID !== selectedEquipment && matchesSearch && matchesType;
  })
  .sort((a, b) =>
    sortOrder === "asc"
      ? a.unitaryPrice - b.unitaryPrice
      : b.unitaryPrice - a.unitaryPrice
  );


  const indexOfLast = currentPage * equipmentsPerPage;
  const indexOfFirst = indexOfLast - equipmentsPerPage;
  const currentEquipments = filteredAndSortedEquipments.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredAndSortedEquipments.length / equipmentsPerPage);

  if (loading) return <LoadingPage />;

  return (
    <div className="equipments-client-page">
      <Hero
        subtitle="Explora nuestros equipos"
        title="Equipos disponibles para tus eventos"
        message="Ofrecemos una amplia gama de equipos para asegurar el éxito de tus actividades. Explora y elige lo que más se ajuste a tus necesidades."
        imgSrc={heroImage}
      />


      <main className="equipments-client-main">
        <button type="button" onClick={() => window.history.back()}>
          <i className="bi bi-arrow-left"></i> Regresar
        </button>
        <h2>Conoce nuestros equipos</h2>

        {/* Filtros */}
        <div className="equipments-client-filters">
          <div className="equipments-search-input">
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
          <div className="equipments-filter-input">

          <label htmlFor="status">Filtrar por tipo: </label>
          <select
            id="status"
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="filter-select"
          >
            <option value="todos">Todos los tipos</option>
            {uniqueTypes.map((type) => (
              <option key={type} value={type}>
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </option>
            ))}
          </select>
        </div>

          <div className="equipments-sort-input">
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

        <div className="client-equipments-container">
          {equipments.length === 0 && <p>No hay equipos disponibles</p>}

          {/* Equipo expandido */}
          {selectedEquipment && (
            <div className="equipment-client-card expanded" ref={expandedEquipmentRef}>
              <ExpandedEquipment
                equipment={equipments.find((eq) => eq.ID === selectedEquipment)}
                onClose={() => setSelectedEquipment(null)}
              />
            </div>
          )}

          {/* Equipos compactos */}
          <div className="equipment-grid">
            {currentEquipments.map((equipment) => (
              <div
                key={equipment.ID}
                className="equipment-client-card"
                onClick={() => setSelectedEquipment(equipment.ID)}
              >
                <CompactEquipment equipment={equipment} />
              </div>
            ))}
          </div>

          {/* Paginación */}
          {totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default EquipmentsClient;
