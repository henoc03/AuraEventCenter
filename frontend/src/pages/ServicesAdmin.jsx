import React, { useEffect, useState } from "react";
import Header from "../components/common/Header";
import SideNav from "../components/common/SideNav";
import AlertMessage from "../components/common/AlertMessage";
import LoadingPage from "../components/common/LoadingPage";
import ServiceCard from "../components/common/ServiceCard";
import ServiceModal from "../components/common/ServiceModal";
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from "react-router-dom";


import "../style/services-admin.css";

const PORT = "http://localhost:1522";

const ServicesAdmin = ({ sections }) => {
  const [services, setServices] = useState([]);
  const [selectedService, setSelectedService] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("");
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [loading, setLoading] = useState(true);

  const [currentUser, setCurrentUser] = useState(null);
  
    // Estados para mensajes
  const [showSuccess, setShowSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showError, setShowError] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const [filterActive, setFilterActive] = useState("todos");


  useEffect(() => {
    fetchServices();

  }, []);

  useEffect(() => {
    const fetchUserInfo = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const { id } = jwtDecode(token);
        const res = await fetch(`${PORT}/users/${id}`);
        const user = await res.json();
        setCurrentUser(user);
      } catch (err) {
        console.error("Error al obtener usuario:", err);
      }
    };

    fetchUserInfo();
  }, []);


  const fetchServices = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${PORT}/services`);
      const data = await res.json();
      setServices(data);
    } catch (err) {
      console.error("Error al obtener servicios:", err);
    } finally {
      setLoading(false);
    }
  };
  const openModal = (mode, service = null) => {
    setSelectedService(service);
    setModalMode(mode);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedService(null);
    setModalMode("");
    setIsModalOpen(false);
  };

  const handleDelete = async (service) => {
    try {
      await fetch(`${PORT}/services/${service.ID}`, { method: "DELETE" });
      setMessage("Servicio eliminado correctamente");
      setMessageType("success");
      fetchServices();
    } catch (err) {
      console.error("Error al eliminar servicio:", err);
      setMessage("Error al eliminar servicio");
      setMessageType("error");
    }
  };

  const handleAddOrEdit = async (data) => {
    try {
      const method = modalMode === "edit" ? "PUT" : "POST";
      const url = modalMode === "edit"
        ? `${PORT}/services/${selectedService.ID}`
        : `${PORT}/services`;

      await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });

      setMessage(modalMode === "edit" ? "Servicio actualizado" : "Servicio creado");
      setMessageType("success");
      fetchServices();
    } catch (err) {
      console.error("Error al guardar servicio:", err);
      setMessage("Error al guardar servicio");
      setMessageType("error");
    }
  };

  const filteredServices = services
    .filter((service) => {
      const matchesSearch = service.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesActive =
        filterActive === "todos" ||
        (filterActive === "activos" && service.active === 1) ||
        (filterActive === "inactivos" && service.active === 0);
      return matchesSearch && matchesActive;
    })
    .sort((a, b) => {
        return sortOrder === "asc"
          ? a.name.localeCompare(b.name)
          : b.name.localeCompare(a.name);
      });



  if (loading) return <LoadingPage />;

  return (
    <div className="services-page">
    {showSuccess && (
      <AlertMessage
        message={successMessage}
        type="alert-floating"
        onClose={() => setShowSuccess(false)}
        className="success"
      />
    )}

      {showError && (
        <AlertMessage
          message={errorMessage}
          type="alert-floating"
          onClose={() => setShowError(false)}
          className="error"
        />
      )}
      <Header
        name={currentUser?.FIRST_NAME}
        lastname={currentUser?.LAST_NAME_1}
        role={currentUser?.USER_TYPE}
        email={currentUser?.EMAIL}
      />

      <div className="services-dashboard">
        <SideNav sections={sections} />
        <main className="services-dashboard-content">
          <div className="services-content-wrapper">
            <section className="services-section">
              <div className="services-section-header">
                <h2 className="services-section-title">Servicios</h2>
                <button className="btn services-section-add-button" onClick={() => openModal("add")}>
                  Agregar
                </button>
              </div>

              <div className="services-controls">
                <label htmlFor="search">Buscar: </label>
                <input
                  id="search"
                  type="text"
                  placeholder="Buscar servicio..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="services-search-input"
                />
                <label htmlFor="filterActive">Filtrar:</label>
                <select
                  id="filterActive"
                  value={filterActive}
                  onChange={(e) => setFilterActive(e.target.value)}
                  className="services-filter-select"
                >
                  <option value="todos">Todos</option>
                  <option value="activos">Activos</option>
                  <option value="inactivos">Inactivos</option>
                </select>

                <label htmlFor="sort">Orden:</label>
                <select
                  id="sort"
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value)}
                  className="services-sort-select"
                >
                  <option value="asc">Precio (mayor a menor)</option>
                  <option value="desc">Precio (menor a mayor)</option>
                </select>
              </div>

              <div className="services-grid">
                {filteredServices.map((service) => (
                  <ServiceCard
                    key={service.ID}
                    service={service}
                    onView={() => openModal("view", service)}
                    onEdit={() => openModal("edit", service)}
                    onDelete={() => openModal("delete", service)}
                  />
                ))}
              </div>
            </section>
          </div>
        </main>
      </div>

      <ServiceModal
        isOpen={isModalOpen}
        mode={modalMode}
        service={selectedService}
        onClose={closeModal}
        onDelete={handleDelete}
        onSave={handleAddOrEdit}
      />
    </div>
  );
};

export default ServicesAdmin;
