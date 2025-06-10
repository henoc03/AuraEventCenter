import React, { useEffect, useState, useRef } from "react";
import AOS from 'aos';
import 'aos/dist/aos.css';
import CompactRoom from "../components/common/CompactRoom";
import ExpandedRoom from "../components/common/ExpandedRoom";
import LoadingPage from "../components/common/LoadingPage";
import Hero from "../components/sections/ClientDefaultHero";
import Footer from "../components/common/Footer";
import Pagination from "../components/common/Pagination";
import heroImage from "../assets/images/clienthero.png";
import "../style/rooms-client.css";

const DEFAULT_ROUTE = "http://localhost:1522";

function RoomsClient() {
  const [zones, setZones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const expandedRoomRef = useRef(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("todos");
  const [sortOrder, setSortOrder] = useState("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const roomsPerPage = 3;

  useEffect(() => {
    AOS.init();
  }, []);

  useEffect(() => {
    getZones();
  }, []);

  useEffect(() => {
    if (selectedRoom && expandedRoomRef.current) {
      const yOffset = -100;
      const y =
        expandedRoomRef.current.getBoundingClientRect().top +
        window.pageYOffset +
        yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  }, [selectedRoom]);

  const getZones = async () => {
    try {
      const res = await fetch(`${DEFAULT_ROUTE}/zones/`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      if (!res.ok) {
        const errorData = await res.json();
        alert(errorData.message || "Error al obtener las salas");
        return;
      }

      const zonesData = await res.json();
      setZones(zonesData);
    } catch (error) {
      console.error("Error al obtener salas:", error);
      alert("Ocurrió un error al obtener las salas.");
    } finally {
      setLoading(false);
    }
  };

  const uniqueTypes = [...new Set(zones.map((room) => room.TYPE))];

  const filteredAndSortedRooms = zones
    .filter((room) => {
      const matchesSearch = room.NAME.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = filterType === "todos" || room.TYPE.toLowerCase() === filterType.toLowerCase();
      return room.ZONE_ID !== selectedRoom && matchesSearch && matchesType;
    })
    .sort((a, b) => sortOrder === "asc" ? a.PRICE - b.PRICE : b.PRICE - a.PRICE);

  // Paginación
  const indexOfLastRoom = currentPage * roomsPerPage;
  const indexOfFirstRoom = indexOfLastRoom - roomsPerPage;
  const currentRooms = filteredAndSortedRooms.slice(indexOfFirstRoom, indexOfLastRoom);
  const totalPages = Math.ceil(filteredAndSortedRooms.length / roomsPerPage);

  if (loading) return <LoadingPage />;

  return (
    <div>
      <Hero
        subtitle="Tu evento, tu espacio"
        title="Transforma tu evento en una experiencia inolvidable"
        message="Creamos momentos únicos con atención personalizada, espacios
          versátiles y todos los servicios que necesitas para hacer realidad
          cualquier tipo de evento."
        imgSrc={heroImage}
      />

      <div className="rooms-client-container">
        <h1 className="client-title">Conoce nuestros espacios</h1>

        {/* Filtros */}
        <div className="filters">
          <label htmlFor="search">Buscar: </label>
          <input
            id="search"
            type="text"
            placeholder="Buscar por nombre..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1); // Reinicia a la primera página
            }}
            className="filter-input"
          />
          <label htmlFor="status">Filtrar: </label>
          <select
            id="status"
            value={filterType}
            onChange={(e) => {
              setFilterType(e.target.value);
              setCurrentPage(1); // Reinicia a la primera página
            }}
            className="filter-select"
          >
            <option value="todos">Todos los tipos</option>
            {uniqueTypes.map((type) => (
              <option key={type} value={type}>
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </option>
            ))}
          </select>
          <label htmlFor="sort">Ordenar: </label>
          <select
            id="sort"
            value={sortOrder}
            onChange={(e) => {
              setSortOrder(e.target.value);
              setCurrentPage(1); // Reinicia a la primera página
            }}
            className="filter-select"
          >
            <option value="asc">Precio: menor a mayor</option>
            <option value="desc">Precio: mayor a menor</option>
          </select>
        </div>

        {/* Sala expandida */}
        {selectedRoom && (
          <div className="room-card expanded" ref={expandedRoomRef}>
            <ExpandedRoom
              room={zones.find((room) => room.ZONE_ID === selectedRoom)}
              onClose={() => setSelectedRoom(null)}
            />
          </div>
        )}

        {/* Salas compactas */}
        <div className="room-grid">
          {currentRooms.map((room) => (
            <div
              key={room.ZONE_ID}
              className="room-card"
              onClick={() => setSelectedRoom(room.ZONE_ID)}
            >
              <CompactRoom room={room} />
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

      <Footer />
    </div>
  );
}

export default RoomsClient;
