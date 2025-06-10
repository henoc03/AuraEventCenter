import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {jwtDecode} from "jwt-decode";

import Header from "../components/common/Header.jsx";
import SideNav from "../components/common/SideNav.jsx";
import RoomCard from "../components/common/RoomCard.jsx";
import AddEditRoomModal from "../components/common/AddEditRoomModal.jsx";
import AlertMessage from "../components/common/AlertMessage.jsx";
import LoadingPage from "../components/common/LoadingPage.jsx";
import DefaultRoom from "../assets/images/salas/default_zone.jpg";

import "../style/rooms-admin.css";

const DEFAULT_ROUTE = "http://localhost:1522";

function RoomsAdmin({ sections }) {
  const [isAddEditOpen, setIsAddEditOpen] = useState(false);
  const [isAddMode, setIsAddMode] = useState(true);
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [zones, setZones] = useState([]);
  const [roomTypes, setRoomTypes] = useState([]);

  // Estados para usuario
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [lastname, setLastname] = useState("");
  const [role, setRole] = useState("");

  // Estados para mensajes
  const [showSuccess, setShowSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showError, setShowError] = useState(false);

  // Estados para filtros y orden
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("todos");
  const [sortOrder, setSortOrder] = useState("asc");
  const [priceOrder, setPriceOrder] = useState("none");

  const navigate = useNavigate();

  useEffect(() => {
    getSetUserInfo();
    getZones();
  }, []);

  const getSetUserInfo = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const sessionUserData = jwtDecode(token);
      const res = await fetch(`${DEFAULT_ROUTE}/users/${sessionUserData.id}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      if (!res.ok) {
        const errorData = await res.json();
        showErrorAlert(errorData.message || "Error al obtener la información del usuario");
        return;
      }

      const userData = await res.json();
      setName(userData.FIRST_NAME);
      setEmail(userData.EMAIL);
      setLastname(userData.LAST_NAME_1);
      setRole(userData.USER_TYPE);
    } catch (err) {
      showErrorAlert("Ocurrió un error al obtener la información de usuario.");
      navigate("/iniciar-sesion");
    }
  };
const extractRoomTypes = (zonesData) => {
  const types = zonesData.map(zone => zone.TYPE).filter(Boolean);
  const uniqueTypes = [...new Set(types)];
  return uniqueTypes;
};

  const getZones = async () => {
    try {
      const res = await fetch(`${DEFAULT_ROUTE}/zones/`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      if (!res.ok) {
        const errorData = await res.json();
        showErrorAlert(errorData.message || "Error al obtener las zonas");
        return;
      }

      const zonesData = await res.json();
      setZones(zonesData);

      const extractedTypes = extractRoomTypes(zonesData);
      setRoomTypes(extractedTypes);
    } catch (err) {
      showErrorAlert("Ocurrió un error al obtener las zonas.");
      navigate("/iniciar-sesion");
    } finally {
      setLoading(false);
    }
  };

  const showErrorAlert = (message) => {
    setErrorMessage(message);
    setShowError(true);
    setTimeout(() => {
      setShowError(false);
      setErrorMessage("");
    }, 4000);
  };

  const handleSuccess = (msg = "Sala agregada con éxito") => {
    setIsAddEditOpen(false);
    getZones();
    setSuccessMessage(msg);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 2000);
  };

  const handleError = (msg = "Ocurrió un error") => {
    setErrorMessage(msg);
    setShowError(true);
    setTimeout(() => {
      setShowError(false);
      setErrorMessage("");
    }, 4000);
  };

  const filteredZones = zones
    .filter((zone) =>
      zone.NAME.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (typeFilter === "todos" || zone.TYPE === typeFilter)
    )
    .sort((a, b) => {
      let result = 0;
      if (priceOrder !== "none") {
        result = priceOrder === "asc" ? a.PRICE - b.PRICE : b.PRICE - a.PRICE;
      } else {
        const nameA = a.NAME.toLowerCase();
        const nameB = b.NAME.toLowerCase();
        result = sortOrder === "asc" ? nameA.localeCompare(nameB) : nameB.localeCompare(nameA);
      }
      return result;
    });

  if (loading) return <LoadingPage />;

  return (
    <div className="rooms-admin-page">
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

      <Header name={name} lastname={lastname} role={role} email={email} />

      <div className={`room-main-container ${isAddEditOpen ? "modal-open" : ""}`}>
        <SideNav className="zones-nav" sections={sections} />

        <main className="rooms-content">
          <div className="title-button-container">
            <h1>Salas</h1>
            <button
              className="add-room-button"
              onClick={() => {
                setIsAddEditOpen(true);
                setIsAddMode(true);
              }}
            >
              Agregar
            </button>
          </div>
          
          <div className="filter-controls">
            <label htmlFor="search">Buscar: </label>
            <input
              id="search"
              type="text"
              placeholder="Buscar..."
              className="filter-search-input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <label htmlFor="type">Filtrar: </label>
            <select
            id="type"
            className="sort-select"
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
          >
            <option value="todos">Todos</option>
            {roomTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>

            <label htmlFor="order">Ordenar: </label>
            <select
              id="order"
              className="sort-select"
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
            >
              <option value="asc">A-Z</option>
              <option value="desc">Z-A</option>
            </select>
          </div>

          <div className="rooms-container">
            {filteredZones.map((zone) => (
              <RoomCard
                key={zone.ZONE_ID}
                id={zone.ZONE_ID}
                name={zone.NAME}
                image={
                  zone.IMAGE_PATH && zone.IMAGE_PATH.trim() !== ""
                    ? `${DEFAULT_ROUTE}/${zone.IMAGE_PATH}`
                    : DefaultRoom
                }
                state={zone.ACTIVE}
                capacity={zone.CAPACITY}
                price={zone.PRICE}
                type={zone.TYPE}
                description={zone.DESCRIPTION}
                onSuccess={(msg) => handleSuccess(msg)}
                onError={(msg) => handleError(msg)}
              />
            ))}
          </div>
        </main>
      </div>

      {isAddEditOpen && (
        <AddEditRoomModal
          isModalOpen={true}
          onClose={() => setIsAddEditOpen(false)}
          onSuccess={() => handleSuccess()}
          isAdd={true}
        />
      )}
    </div>
  );
}

export default RoomsAdmin;
