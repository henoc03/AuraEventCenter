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
import CompactService from "../components/common/CompactService.jsx";
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
  const [currentRoomIndex, setCurrentRoomIndex] = useState(0);
  const [allServices, setAllServices] = useState([]);
  const [selectedServices, setSelectedServices] = useState({});
  const [newServices, setNewServices] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("todos");
  const [sortOrder, setSortOrder] = useState("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const elementsPerPage = 4;
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
      }
    };

    getSelectedZones();
  }, [navigate]);

  useEffect(() => {
    const getAllServices = async () => {
      try {
        const res = await fetch(`${DEFAULT_ROUTE}/services/`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });

        if (!res.ok) {
          const errorData = await res.json();
          alert(errorData.message || "Error al obtener los servicios");
          return;
        }

        const servicesData = await res.json();
        setAllServices(servicesData);
      } catch (error) {
        console.error("Error al obtener salas:", error);
        alert("Ocurrió un error al obtener los servicios.");
      }
    };

    getAllServices();
  }, []);

  useEffect(() => {
    const getSelectedServices = async () => {
      try {
        const bookingId = 1;
        const servicesByRoom = {};

        for (const roomId of selectedRooms) {
          const res = await fetch(`${DEFAULT_ROUTE}/bookings/services`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ bookingId, roomId }),
          });

          if (!res.ok) {
            const errorData = await res.json();
            alert(errorData.message || "Error al obtener los servicios");
            continue;
          }

          const servicesData = await res.json();

          let ids = [];
          if (servicesData.length > 0 && typeof servicesData[0] === 'object') {
            const key = Object.keys(servicesData[0]).find(k => k.toLowerCase().includes('id'));
            ids = servicesData.map(s => s[key]);
          } else {
            ids = servicesData;
          }
          servicesByRoom[roomId] = ids;
        }
        setSelectedServices(servicesByRoom);
      } catch (error) {
        console.error("Error al obtener los servicios de la sala:", error);
        alert("Ocurrió un error al obtener los servicios.");
      } finally {
        setLoading(false);
      }
    };

    if (selectedRooms.length > 0) {
      getSelectedServices();
    }
  }, [selectedRooms]);

  useEffect(() => {
    console.log("Servicios seleccionados:", selectedServices);
  }, [selectedServices]);

  // Filtros para las salas
  const uniqueRoomTypes = [...new Set(allZones.map((room) => room.TYPE))];

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

  // Filtros para los servicios
  const filteredAndSortedServices = allServices
    .filter((service) => {
      const matchesSearch = service.name.toLowerCase().includes(searchTerm.toLowerCase());
      return service.ID && matchesSearch;
    })
    .sort((a, b) => sortOrder === "asc" ? a.price - b.price : b.price - a.price);

  // Ordenar para que los servicios seleccionados para la sala actual aparezcan primero
  const currentRoomId = selectedRooms[currentRoomIndex];
  const selectedForRoom = selectedServices[currentRoomId] || [];
  const prioritizedServices = [...filteredAndSortedServices].sort((a, b) => {
    const aSelected = selectedForRoom.includes(a.ID) ? 0 : 1;
    const bSelected = selectedForRoom.includes(b.ID) ? 0 : 1;
    return aSelected - bSelected;
  });

  // Paginación
  const indexOfLastElement = currentPage * elementsPerPage;
  const indexOfFirstElement = indexOfLastElement - elementsPerPage;
  const currentRooms = prioritizedRooms.slice(indexOfFirstElement, indexOfLastElement);
  const currentServices = prioritizedServices.slice(indexOfFirstElement, indexOfLastElement);
  const totalPages = Math.ceil(filteredAndSortedRooms.length / elementsPerPage);

  const handleNextStep = (data) => {
    setStep1Data(data);
    setStep(prev => prev + 1);
  };

  const handleRoomClicked = (roomID) => {
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

  const handleServiceClicked = (serviceID) => {
    const roomId = selectedRooms[currentRoomIndex];
    const isOriginal = (selectedServices[roomId] || []).includes(serviceID);
    const isNew = (newServices[roomId] || []).includes(serviceID);

    // Si es original y no es nuevo, no permitir quitarlo
    if (isOriginal && !isNew) {
      return;
    }

    setSelectedServices(prev => {
      const current = prev[roomId] || [];
      if (current.includes(serviceID)) {
        return { ...prev, [roomId]: current.filter(id => id !== serviceID) };
      } else {
        return { ...prev, [roomId]: [...current, serviceID] };
      }
    });
    setNewServices(prev => {
      const current = prev[roomId] || [];
      if (current.includes(serviceID)) {
        return { ...prev, [roomId]: current.filter(id => id !== serviceID) };
      } else {
        return { ...prev, [roomId]: [...current, serviceID] };
      }
    });
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
                        {uniqueRoomTypes.map((type) => (
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

                  <div className="elements-counter">
                    <p>Selecciona las salas</p>
                    <p>Salas seleccionadas: {selectedRooms.length}</p>
                  </div>

                  {/* Salas compactas */}
                  <div className="edit-booking-grid">
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
                          className={`edit-booking-card${isSelected ? " edit-booking-selected-card" : "" }`}
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
                    className={`booking-next-step-button ${selectedRooms.length != 0 ? "active" : ""}`}
                    onClick={() => setStep(prev => prev + 1)}
                  >
                    Siguiente
                  </button>
                </div>
              }

              {step === 2 && selectedRooms.length > 0 && (
                <div className="booking-client-step3">
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

                  <div className="elements-counter">
                    <p>Selecciona los servicios para la sala:
                      {' '}
                      <b>
                        {allZones.find(z => z.ZONE_ID === selectedRooms[currentRoomIndex])?.NAME || ("Sala " + (currentRoomIndex + 1))}
                      </b>
                    </p>
                    <p>Servicios seleccionados: {(selectedServices[selectedRooms[currentRoomIndex]] || []).length}</p>
                  </div>

                  {/* Servicios compactos */}
                  <div className="edit-booking-grid">
                    {currentServices.map((service) => {
                      const isSelected = (selectedServices[selectedRooms[currentRoomIndex]] || []).includes(service.ID);
                      const isNew = (newServices[selectedRooms[currentRoomIndex]] || []).includes(service.ID);
                      let cardStyle = {};
                      if (isNew && !isSelected) {
                        cardStyle = { opacity: "100%" };
                      } else if (isSelected) {
                        cardStyle = { opacity: "50%" };
                      }
                      return (
                        <div
                          key={service.ID}
                          className={`edit-booking-card${isSelected ? " edit-booking-selected-card" : "" }`}
                          onClick={() => handleServiceClicked(service.ID)}
                          style={cardStyle}
                        >
                          <CompactService
                            service={service}
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

                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 16 }}>
                    <button
                      type="button"
                      className="booking-next-step-button"
                      disabled={currentRoomIndex === 0}
                      onClick={() => setCurrentRoomIndex(i => i - 1)}
                    >
                      Anterior sala
                    </button>
                    <button
                      type="button"
                      className={`booking-next-step-button active`}
                      onClick={() => {
                        if (currentRoomIndex < selectedRooms.length - 1) {
                          setCurrentRoomIndex(i => i + 1);
                        } else {
                          setStep(prev => prev + 1);
                        }
                      }}
                    >
                      {currentRoomIndex < selectedRooms.length - 1 ? 'Siguiente sala' : 'Siguiente'}
                    </button>
                  </div>
                </div>
              )}

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