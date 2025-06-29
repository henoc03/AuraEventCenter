import React, {useEffect, useState } from "react";
import PropTypes from 'prop-types';
import {jwtDecode} from 'jwt-decode';
import { useNavigate } from "react-router-dom";
import LoadingPage from "../components/common/LoadingPage.jsx";
import Header from "../components/common/Header.jsx";
import SideNav from "../components/common/SideNav.jsx"
import StepBar from "../components/common/StepBar.jsx";
import BookingForm from "../components/common/BookingForm.jsx";
import CompactRoom from "../components/common/CompactRoom";
import Pagination from "../components/common/Pagination";
import '../style/edit-booking-client.css'


const DEFAULT_ROUTE = "http://localhost:1522";

// Componente para la página de edición de reservas para el cliente
function EditBookingClient({ sections }) {
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [lastname, setLastname] = useState("");
  const [role, setRole] = useState("");
  const [step, setStep] = useState(0);
  const [step1Data, setStep1Data] = useState({});
  const [allZones, setAllZones] = useState([]);
  const [selectedRooms, setSelectedRooms] = useState([]);
  const [newRooms, setNewRooms] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("todos");
  const [sortOrder, setSortOrder] = useState("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const roomsPerPage = 4;
  const navigate = useNavigate();

  useEffect(() => {
    const getSetUserInfo = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        return;
      }

      const sessionUserData = jwtDecode(token);

      try {
        const res = await fetch(`${DEFAULT_ROUTE}/users/${sessionUserData.id}`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        });

        if (!res.ok) {
          const errorData = await res.json();
          alert(errorData.message || 'Error traer la información de usuario');
          return;
        }

        const userData = await res.json();

        // Guarda los datos traidos
        setName(userData.FIRST_NAME)
        setEmail(userData.EMAIL)
        setLastname(userData.LAST_NAME_1)
        setRole(userData.USER_TYPE)
      } catch {
        alert('Ocurrió un error al obtener la información de usuario.');
        navigate('/login');
      } finally {
        setLoading(false);
      }
    };

    getSetUserInfo();
  }, [navigate]);

  useEffect(() => {
    const getBookingInfo = async () => {
      try {
        const res = await fetch(`${DEFAULT_ROUTE}/bookings/1`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        });

        if (!res.ok) {
          const errorData = await res.json();
          alert(errorData.message || 'Error traer la información de la reserva');
          return;
        }

        const bookingData = await res.json();

        setStep1Data(bookingData);
      } catch {
        alert('Ocurrió un error al obtener la información de la reserva.');
      } finally {
        setLoading(false);
      }
    };

    getBookingInfo();
  }, [navigate]);

  useEffect(() => {
    const getAllZones = async () => {
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
        setAllZones(zonesData);
      } catch (error) {
        console.error("Error al obtener salas:", error);
        alert("Ocurrió un error al obtener las salas.");
      } finally {
        setLoading(false);
      }
    };

    getAllZones();
  }, []);

  useEffect(() => {
    const getSelectedZones = async () => {
      try {
        const res = await fetch(`${DEFAULT_ROUTE}/bookings/zones/1`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        });

        if (!res.ok) {
          const errorData = await res.json();
          alert(errorData.message || 'Error traer la información de las salas seleccionadas');
          return;
        }

        const selectedRooms = await res.json();

        setSelectedRooms(selectedRooms.map(room => room.ZONE_ID));
      } catch {
        alert('Ocurrió un error al obtener la información de la reserva.');
      } finally {
        setLoading(false);
      }
    };

    getSelectedZones();
  }, [navigate]);

  const uniqueTypes = [...new Set(allZones.map((room) => room.TYPE))];

  const filteredAndSortedRooms = allZones
    .filter((room) => {
      const matchesSearch = room.NAME.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = filterType === "todos" || room.TYPE.toLowerCase() === filterType.toLowerCase();
      return room.ZONE_ID && matchesSearch && matchesType;
    })
    .sort((a, b) => sortOrder === "asc" ? a.PRICE - b.PRICE : b.PRICE - a.PRICE);

  // Ordenar para que las salas seleccionadas aparezcan primero
  const prioritizedRooms = [...filteredAndSortedRooms].sort((a, b) => {
    const aSelected = selectedRooms.includes(a.ZONE_ID) ? 0 : 1;
    const bSelected = selectedRooms.includes(b.ZONE_ID) ? 0 : 1;
    return aSelected - bSelected;
  });

  // Paginación
  const indexOfLastRoom = currentPage * roomsPerPage;
  const indexOfFirstRoom = indexOfLastRoom - roomsPerPage;
  const currentRooms = prioritizedRooms.slice(indexOfFirstRoom, indexOfLastRoom);
  const totalPages = Math.ceil(filteredAndSortedRooms.length / roomsPerPage);

  const handleNextStep = (data) => {
    setStep1Data(data);
    setStep(prev => prev + 1);
  };

  const handleRoomClicked = (roomID) => {
    // Si la sala ya estaba seleccionada desde el inicio, no se puede quitar
    if (selectedRooms.includes(roomID) && !newRooms.includes(roomID)) {
      return;
    }

    // Si la sala es nueva (agregada en esta edición)
    if (newRooms.includes(roomID)) {
      setNewRooms(prev => prev.filter(id => id !== roomID));
      setSelectedRooms(prev => prev.filter(id => id !== roomID));
    } else {
      // Si la sala no estaba seleccionada, agregarla como nueva
      setNewRooms(prev => [...prev, roomID]);
      setSelectedRooms(prev => [...prev, roomID]);
    }
  };

  const handleReturn = () => {
    if (step > 0) {
      setStep(prev => prev - 1);
    } else {
      window.history.back()
    }
  }

  if (loading) return <LoadingPage />;

  // Nombres de los pasos
  const steps = [
    "Seleccionar sala",
    "Detalles de reserva",
    "Confirmar datos",
    "Finalizar"
  ];

  return (
    <>
      <div className="booking-header-container">
        <Header name={name} lastname={lastname} role={role} email={email}>
          {/*Menu de hamburguesa*/}
          <SideNav id="booking-sidenav-mobile" sections={sections} />
        </Header>
      </div>  

      <div className="booking-client-sidenav-main">
        <div id="booking-sidenav-desktop">
          <SideNav className="booking-sidenav" sections={sections} />
        </div>

        <div className="booking-client-content">
          <button type='button' className="back-btn-bookings-client" onClick={() => handleReturn()}>
            <i className="bi bi-arrow-left"></i> Regresar
          </button>

          <h1>Editar reserva</h1>

          <div className="booking-client-steps">
            {/* Barra de pasos */}
            <StepBar steps={steps} currentStep={step} />

            <div className="booking-client-step-content">
              {/* Contenido del paso actual */}
              {step === 0 && 
                <div className="booking-client-step1">
                  <p>Los campos marcados con <span style={{ color: 'red' }}>*</span> son obligatorios</p>
                  <BookingForm
                    onNextStep={handleNextStep}
                    isEditMode={true}
                    bookingInfo={step1Data}
                  />
                </div>
              }
              {step === 1 &&
                <div className="booking-client-step2">
                  {/* Filtros */}
                  <div className="edit-booking-filters">
                    <div className="edit-booking-search-input">
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

                    <div className="edit-booking-filter-input">
                      <label htmlFor="status">Filtrar: </label>
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
                    
                    <div className="edit-booking-sort-input">
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

                  <div className="rooms-counter">
                    <p>Selecciona las salas</p>
                    <p>Salas seleccionadas: {selectedRooms.length}</p>
                  </div>

                  {/* Salas compactas */}
                  <div className="edit-booking-room-grid">
                    {currentRooms.map((room) => {
                      const isSelected = selectedRooms.includes(room.ZONE_ID);
                      const isNew = newRooms.includes(room.ZONE_ID);
                      let cardStyle = {};
                      if (isNew && !isSelected) {
                        cardStyle = { opacity: "100%" };
                      } else if (isSelected) {
                        cardStyle = { opacity: "50%" };
                      }
                      return (
                        <div
                          key={room.ZONE_ID}
                          className={`edit-booking-room-card${isSelected ? " selected-room" : "" }`}
                          onClick={() => handleRoomClicked(room.ZONE_ID)}
                          style={cardStyle}
                        >
                          <CompactRoom
                            room={room}
                            isBooking={true}
                            isSelected={isSelected}
                            isNew={isNew}
                          />
                        </div>
                      );
                    })}
                  </div>

                  {/* Paginación */}
                  {totalPages > 1 && (
                    <Pagination
                      currentPage={currentPage}
                      totalPages={totalPages}
                      onPageChange={setCurrentPage}
                    />
                  )}

                  <button
                    type="button"
                    className={`booking-step2-next-button ${selectedRooms.length != 0 ? "active" : ""}`}
                    onClick={() => setStep(prev => prev + 1)}
                  >
                    Siguiente
                  </button>
                </div>
              }
              {step === 2 && <div>Confirmar datos</div>}
              {step === 3 && <div>Finalizar</div>}

            </div>
          </div> 
        </div>   
      </div>  
    </>
  );
}

EditBookingClient.propTypes = {
  sections: PropTypes.array.isRequired,
};

export default EditBookingClient;