import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

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

  // Estados para usuario
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [lastname, setLastname] = useState("");
  const [role, setRole] = useState("");

  // Estados para mensajes
  const [showSuccess, setShowSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showError, setShowError] = useState(false);

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
      navigate("/login");
    }
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
    } catch (err) {
      showErrorAlert("Ocurrió un error al obtener las zonas.");
      navigate("/login");
    } finally {
      setLoading(false);
    }
  };

  const showErrorAlert = (message) => {
    setErrorMessage(message);
    setShowError(true);
s
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
            <button className="add-room-button" onClick={() => {setIsAddEditOpen(true); setIsAddMode(true)}}>
              Agregar Sala
            </button>
          </div>

          <div className="rooms-container">
            {zones.map((zone) => (
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
