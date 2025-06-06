import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

import Header from "../components/common/Header.jsx";
import SideNav from "../components/common/SideNav.jsx";
import ServiceCard from "../components/common/ServiceCard.jsx";
// import AddEditRoomModal from "../components/common/AddEditRoomModal.jsx";
import AlertMessage from "../components/common/AlertMessage.jsx";
import LoadingPage from "../components/common/LoadingPage.jsx";


// import "../style/services-admin.css";

const DEFAULT_ROUTE = "http://localhost:1522";

// Componente para la página de servicios del administrador
function ServicesAdmin({ sections }) {
  const [isAddEditOpen, setIsAddEditOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [services, setServices] = useState([]);
  const [showSuccess, setShowSuccess] = useState(false);

  // Estados para información de usuario
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [lastname, setLastname] = useState("");
  const [role, setRole] = useState("");

  // Estados para los filtros y búsqueda
  const [searchTerm, setSearchTerm] = useState("");
  const [filterActive, setFilterActive] = useState("todos");
  const [sortOrder, setSortOrder] = useState("asc");


  const navigate = useNavigate();

  useEffect(() => {
    getSetUserInfo();
    getServices();
  }, []);

  // Obtener información de usuario para el header
  const getSetUserInfo = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      // Obtener token de sesión
      const sessionUserData = jwtDecode(token);
      const res = await fetch(`${DEFAULT_ROUTE}/users/${sessionUserData.id}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      if (!res.ok) {
        const errorData = await res.json();
        alert(errorData.message || "Error al obtener la información del usuario");
        return;
      }

      // Almacenar datos de usuario
      const userData = await res.json();
      setName(userData.FIRST_NAME);
      setEmail(userData.EMAIL);
      setLastname(userData.LAST_NAME_1);
      setRole(userData.USER_TYPE);

    } catch {
      alert("Ocurrió un error al obtener la información de usuario.");
      navigate("/login");
    }
  };

  // Obtener información de servicios
  const getServices = async () => {
    try {
      const res = await fetch(`${DEFAULT_ROUTE}/services/`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      if (!res.ok) {
        const errorData = await res.json();
        alert(errorData.message || "Error al obtener los servicios adicionales");
        return;
      }

      const servicesData = await res.json();
      setServices(servicesData);
    } catch {
      alert("Ocurrió un error al obtener los servicios adicionales.");
      // navigate("/login");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingPage />;

  const filteredAndSortedServices = services
  .filter((service) => {
    const matchesSearch = service.NAME.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesActive =
      filterActive === "todos" ||
      (filterActive === "activos" && service.ACTIVE === 1) ||
      (filterActive === "inactivos" && service.ACTIVE === 0);
    return matchesSearch && matchesActive;
  })
  .sort((a, b) => {
    return sortOrder === "asc" ? a.PRICE - b.PRICE : b.PRICE - a.PRICE;
  });

  return (
    <div className="services-admin-page">
      {showSuccess && (
        <AlertMessage
          message="Información actualizada con éxito"
          type="alert-floating"
          onClose={() => setShowSuccess(false)}
          className="success"
        />
      )}

      <Header
        name={name}
        lastname={lastname}
        role={role}
        email={email}
      />

      <div className={`service-admin-main ${isAddEditOpen ? "modal-open" : ""}`}>
        {/* <SideNav className= "services-admin-nav" sections={sections} /> */}

        <main className="services-admin-main">
          <div className="title-add-service-cont">
            <h1>Salas</h1>
            <button
              className="add-service-button"
              onClick={() => setIsAddEditOpen(true)}
            >
              Agregar Sala
            </button>
          </div>

          {/* Filtros */}
          <div className="filters">
            <label htmlFor="search">Buscar: </label>
            <input
              id="search"
              type="text"
              placeholder="Buscar por nombre..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="filter-input"
            />
            <label htmlFor="active">Filtrar: </label>
            <select
              id="active"
              value={filterActive}
              onChange={(e) => setFilterActive(e.target.value)}
              className="filter-select"
            >
              <option value="todos">Todos</option>
              <option value="activos">Activos</option>
              <option value="inactivos">Inactivos</option>
            </select>
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

          <div className="services-admin-grid">
            {filteredAndSortedServices.map((service) => (
              <ServiceCard service={service} />
            ))}
          </div>
        </main>
      </div>

      {/* {isAddEditOpen && (
        <AddEditRoomModal
          isModalOpen={true}
          onClose={() => {
            setIsAddEditOpen(false);
            getServices();
          }}
          isAdd={true}
        />
      )} */}
    </div>
  );
}

export default ServicesAdmin;
