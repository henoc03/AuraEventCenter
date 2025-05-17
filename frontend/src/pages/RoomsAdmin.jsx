import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

import Header from "../components/common/Header.jsx";
import SideNav from "../components/common/SideNav.jsx";
import RoomCard from "../components/common/RoomCard.jsx";
import AddEditRoomModal from "../components/common/AddEditRoomModal.jsx";
import AlertMessage from "../components/common/AlertMessage.jsx";

import RoomPhoto from "../assets/images/salas/sala2.png";
import "../style/rooms-admin.css";

const DEFAULT_ROUTE = "http://localhost:1522";

function RoomsAdmin({ sections }) {
  const [isAddEditOpen, setIsAddEditOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [zones, setZones] = useState([]);
  const [showSuccess, setShowSuccess] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [lastname, setLastname] = useState("");
  const [role, setRole] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    getSetUserInfo();
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
        alert(errorData.message || "Error al obtener la información del usuario");
        return;
      }

      const userData = await res.json();
      setName(userData.FIRST_NAME);
      setEmail(userData.EMAIL);
      setLastname(userData.LAST_NAME_1);
      setRole(userData.USER_TYPE);

      getZones();
    } catch {
      alert("Ocurrió un error al obtener la información de usuario.");
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
        alert(errorData.message || "Error al obtener las zonas");
        return;
      }

      const zonesData = await res.json();
      setZones(zonesData);
    } catch {
      alert("Ocurrió un error al obtener las zonas.");
      navigate("/login");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return null;

  return (
    <div className="rooms-admin-page">
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

      <div className={`room-main-container ${isAddEditOpen ? "modal-open" : ""}`}>
        <SideNav className= "zones-nav" sections={sections} />

        <main className="rooms-content">
          <div className="title-button-container">
            <h1>Salas</h1>
            <button
              className="add-room-button"
              onClick={() => setIsAddEditOpen(true)}
            >
              Agregar Sala
            </button>
          </div>

          <div className="rooms-container">
            {zones.map((zone) => (
              <RoomCard
                key={zone.ZONE_ID}
                id={zone.ZONE_ID}
                name={zone.NAME}
                image={RoomPhoto}
                state={zone.ACTIVE}
                capacity={zone.CAPACITY}
                price={zone.PRICE}
                type={zone.TYPE}
                description={zone.DESCRIPTION}
              />
            ))}
          </div>
        </main>
      </div>

      {isAddEditOpen && (
        <AddEditRoomModal
          isModalOpen={true}
          onClose={() => {
            setIsAddEditOpen(false);
            getZones();
          }}
          isAdd={true}
        />
      )}
    </div>
  );
}

export default RoomsAdmin;
