import React, { useEffect, useState } from "react";
import Header from "../components/common/Header";
import SideNav from "../components/common/SideNav";
import AlertMessage from "../components/common/AlertMessage";
import LoadingPage from "../components/common/LoadingPage";
import EquipmentCard from "../components/common/EquipmentCard";
import EquipmentModal from "../components/common/EquipmentModal";
import Pagination from "../components/common/Pagination";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";

import "../style/equipment-admin.css";

const PORT = "http://localhost:1522";

const EquipmentAdmin = ({ sections }) => {
  const [equipments, setEquipments] = useState([]);
  const [selectedEquipment, setSelectedEquipment] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("");
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("min");
  const [currentPage, setCurrentPage] = useState(1);
  const equipmentsPerPage = 3;
  const navigate = useNavigate();

  useEffect(() => {
    fetchEquipments();
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

  const fetchEquipments = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${PORT}/equipments`);
      const data = await res.json();
      setEquipments(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error al obtener equipos:", err);
    } finally {
      setLoading(false);
    }
  };

  const openModal = (mode, equipment = null) => {
    setSelectedEquipment(equipment);
    setModalMode(mode);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedEquipment(null);
    setModalMode("");
    setIsModalOpen(false);
  };

  const handleDelete = async (equipment) => {
    try {
      await fetch(`${PORT}/equipments/${equipment.ID}`, { method: "DELETE" });
      setMessage("Equipo eliminado correctamente");
      setMessageType("success");
      fetchEquipments();
    } catch (err) {
      console.error("Error al eliminar equipo:", err);
      setMessage("Error al eliminar equipo");
      setMessageType("error");
    }
  };

  const handleAddOrEdit = async (data) => {
    try {
      const method = modalMode === "edit" ? "PUT" : "POST";
      const url = modalMode === "edit"
        ? `${PORT}/equipments/${selectedEquipment.ID}`
        : `${PORT}/equipments`;

      await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      setMessage(modalMode === "edit" ? "Equipo actualizado" : "Equipo creado");
      setMessageType("success");
      fetchEquipments();
    } catch (err) {
      console.error("Error al guardar equipo:", err);
      setMessage("Error al guardar equipo");
      setMessageType("error");
    }
  };

  const filteredEquipments = equipments
    .filter((eq) => eq.name.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) =>
      sortOrder === "min" ? a.quantity - b.quantity : b.quantity - a.quantity
    );

  const indexOfLast = currentPage * equipmentsPerPage;
  const indexOfFirst = indexOfLast - equipmentsPerPage;
  const currentItems = filteredEquipments.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredEquipments.length / equipmentsPerPage);

  if (loading) return <LoadingPage />;

  return (
    <div className="equipment-page">
      {message && (
        <AlertMessage
          message={message}
          type="alert-floating"
          onClose={() => setMessage('')}
          className={messageType}
        />
      )}

      <Header
        name={currentUser?.FIRST_NAME}
        lastname={currentUser?.LAST_NAME_1}
        role={currentUser?.USER_TYPE}
        email={currentUser?.EMAIL}
      />

      <div className="equipment-dashboard">
        <SideNav sections={sections} />
        <main className="equipment-dashboard-content">
          <button type='button' className="back-btn-equipment" onClick={() => window.history.back()}>
            <i className="bi bi-arrow-left"></i> Regresar
          </button>
          <div className="equipment-content-wrapper">
            <section className="equipment-section">
              <div className="equipment-section-header">
                <h2 className="equipment-section-title">Equipos</h2>
                <button
                  className="btn-equipment-section-add-button"
                  onClick={() => openModal("add")}
                >
                  Agregar
                </button>
              </div>

              <div className="equipment-controls">
                <label htmlFor="search">Buscar: </label>
                <input
                  id="search"
                  type="text"
                  placeholder="Buscar equipo..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="equipment-search-input"
                />

                <label htmlFor="sort">Orden:</label>
                <select
                  id="sort"
                  value={sortOrder}
                  onChange={(e) => {
                    setSortOrder(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="equipment-sort-select"
                >
                  <option value="max">Cantidad: mayor a menor</option>
                  <option value="min">Cantidad: menor a mayor</option>
                </select>
              </div>

              <div className="equipment-grid">
                {currentItems.map((equipment) => (
                  <EquipmentCard
                    key={equipment.ID}
                    equipment={equipment}
                    onView={() => openModal("view", equipment)}
                    onEdit={() => openModal("edit", equipment)}
                    onDelete={() => openModal("delete", equipment)}
                  />
                ))}
              </div>

              {totalPages > 1 && (
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                />
              )}
            </section>
          </div>
        </main>
      </div>

      <EquipmentModal
        isOpen={isModalOpen}
        mode={modalMode}
        equipment={selectedEquipment}
        onClose={closeModal}
        onDelete={handleDelete}
        onSave={handleAddOrEdit}
      />
    </div>
  );
};

export default EquipmentAdmin;
