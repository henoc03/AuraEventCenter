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
import CompactMenu from "../components/common/CompactMenu.jsx";
import CompactEquipment from "../components/common/CompactEquipment.jsx";
import Pagination from "../components/common/Pagination.jsx";
import Filters from "../components/common/Filters.jsx";
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
  const [allMenus, setAllMenus] = useState([]);
  const [selectedMenus, setSelectedMenus] = useState({});
  const [newMenus, setNewMenus] = useState({});
  const [allEquipments, setAllEquipments] = useState([]);
  const [selectedEquipments, setSelectedEquipments] = useState({});
  const [newEquipments, setNewEquipments] = useState({});
  const [showMenusModal, setShowMenusModal] = useState(false);
  const [showEquipmentsModal, setShowEquipmentsModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [modalCurrentPage, setModalCurrentPage] = useState(1);
  const [modalTotalPages, setModalTotalPages] = useState(1);
  const [currentElements, setCurrentElements] = useState([]);
  const elementsPerPage = 4;
  const navigate = useNavigate();

  // Obtener informacion de usuario para el header
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

  // Obtener informacion de la reserva para el formulario
  useEffect(() => {
    const getBookingInfo = async () => {
      try {
        //TODO: Cambiar por el ID de la reserva que se esta editando
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

  // Obtener todas las zonas disponiles para agendar
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

  // Obtener las zonas que se habian seleccionado para la reserva
  useEffect(() => {
    const getSelectedZones = async () => {
      try {
        //TODO: Cambiar por el ID de la reserva que se esta editando
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

  // Obtener todos los servicios disponibles
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

  // Obtener los servicios que se habian seleccionado para la reserva
  useEffect(() => {
    const getSelectedServices = async () => {
      try {
        // TODO: Cambiar por el ID de la reserva que se esta editando
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

  // Obtener todos los menus disponibles
  useEffect(() => {
    const getAllMenus= async () => {
      try {
        const res = await fetch(`${DEFAULT_ROUTE}/menus/`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });

        if (!res.ok) {
          const errorData = await res.json();
          alert(errorData.message || "Error al obtener los menus");
          return;
        }

        const menusData = await res.json();
        setAllMenus(menusData);
      } catch (error) {
        console.error("Error al obtener los menus:", error);
        alert("Ocurrió un error al obtener los menus.");
      }
    };

    getAllMenus();
  }, []);

  // Obtener los menús que se habían seleccionado para la reserva
  useEffect(() => {
    const getSelectedMenus = async () => {
      try {
        // TODO: Cambiar por el ID del menu que se está editando
        const bookingId = 1;
        const menusByRoom = {};

        for (const roomId of selectedRooms) {
          const res = await fetch(`${DEFAULT_ROUTE}/bookings/menus`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ bookingId, roomId }),
          });

          if (!res.ok) {
            const errorData = await res.json();
            alert(errorData.message || "Error al obtener los menús");
            continue;
          }

          const menusData = await res.json();

          let ids = [];
          if (menusData.length > 0 && typeof menusData[0] === 'object') {
            const key = Object.keys(menusData[0]).find(k => k.toLowerCase().includes('id'));
            ids = menusData.map(m => m[key]);
          } else {
            ids = menusData;
          }
          menusByRoom[roomId] = ids;
        }
        setSelectedMenus(menusByRoom);
      } catch (error) {
        console.error("Error al obtener los menús de la sala:", error);
        alert("Ocurrió un error al obtener los menús.");
      }
    };

    if (selectedRooms.length > 0) {
      getSelectedMenus();
    }
  }, [selectedRooms]);

  // Obtener todos los equipos disponibles
  useEffect(() => {
    const getAllEquipments= async () => {
      try {
        const res = await fetch(`${DEFAULT_ROUTE}/equipments/`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });

        if (!res.ok) {
          const errorData = await res.json();
          alert(errorData.message || "Error al obtener los equipos");
          return;
        }

        const equipmentsData = await res.json();
        setAllEquipments(equipmentsData);
      } catch (error) {
        console.error("Error al obtener los equipos:", error);
        alert("Ocurrió un error al obtener los equipos.");
      }
    };

    getAllEquipments();
  }, []);

  // Obtener los equipos que se habían seleccionado para la reserva
  useEffect(() => {
    const getSelectedEquipments = async () => {
      try {
        // TODO: Cambiar por el ID del equipo que se está editando
        const bookingId = 1;
        const equipmentsByRoom = {};

        for (const roomId of selectedRooms) {
          const res = await fetch(`${DEFAULT_ROUTE}/bookings/equipments`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ bookingId, roomId }),
          });

          if (!res.ok) {
            const errorData = await res.json();
            alert(errorData.message || "Error al obtener los equipos");
            continue;
          }

          const equipmentsData = await res.json();

          let ids = [];
          if (equipmentsData.length > 0 && typeof equipmentsData[0] === 'object') {
            const key = Object.keys(equipmentsData[0]).find(k => k.toLowerCase().includes('id'));
            ids = equipmentsData.map(m => m[key]);
          } else {
            ids = equipmentsData;
          }
          equipmentsByRoom[roomId] = ids;
        }
        setSelectedEquipments(equipmentsByRoom);
      } catch (error) {
        console.error("Error al obtener los equipos de la sala:", error);
        alert("Ocurrió un error al obtener los equipos.");
      }
    };

    if (selectedRooms.length > 0) {
      getSelectedEquipments();
    }
  }, [selectedRooms]);

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
  // const currentElements = prioritizedRooms.slice(indexOfFirstElement, indexOfLastElement);
  const currentServices = prioritizedServices.slice(indexOfFirstElement, indexOfLastElement);
  // const totalPages = Math.ceil(filteredAndSortedRooms.length / elementsPerPage);

  // Manejar cambio al sigueinte paso
  const handleNextStep = (data) => {
    setStep1Data(data);
    setStep(prev => prev + 1);
  };

  // Manejar el eleccion de una sala
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

  const handleServiceClicked = (service) => {
    const isCatering = service.name.toLowerCase().includes("catering");
    const isEquipos = service.name.toLowerCase().includes("equipos");

    const serviceID = service.ID;
    const roomId = selectedRooms[currentRoomIndex];
    const isOriginal = (selectedServices[roomId] || []).includes(serviceID);
    const isNew = (newServices[roomId] || []).includes(serviceID);

    // Si es catering o equipos y ya está seleccionado, no permitir quitarlo
    if ((isCatering || isEquipos) && (isOriginal || isNew)) {
      // Abrir el modal si corresponde, pero no quitar de la selección
      if (isCatering) setShowMenusModal(true);
      if (isEquipos) setShowEquipmentsModal(true);
      return;
    }

    if (isCatering) setShowMenusModal(true);
    if (isEquipos) setShowEquipmentsModal(true);

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

  const handleMenuClicked = (menu) => {
    const menuID = menu.MENU_ID;
    const roomId = selectedRooms[currentRoomIndex];
    const isOriginal = (selectedMenus[roomId] || []).includes(menuID);
    const isNew = (newMenus[roomId] || []).includes(menuID);

    // Si es original y no es nuevo, no permitir quitarlo
    if (isOriginal && !isNew) {
      return;
    }

    setSelectedMenus(prev => {
      const current = prev[roomId] || [];
      if (current.includes(menuID)) {
        return { ...prev, [roomId]: current.filter(id => id !== menuID) };
      } else {
        return { ...prev, [roomId]: [...current, menuID] };
      }
    });

    setNewMenus(prev => {
      const current = prev[roomId] || [];
      if (current.includes(menuID)) {
        return { ...prev, [roomId]: current.filter(id => id !== menuID) };
      } else {
        return { ...prev, [roomId]: [...current, menuID] };
      }
    });
  };

  const handleEquipmentClicked = (equipment) => {
    const equipmentID = equipment.ID;
    const roomId = selectedRooms[currentRoomIndex];
    const isOriginal = (selectedEquipments[roomId] || []).includes(equipmentID);
    const isNew = (newEquipments[roomId] || []).includes(equipmentID);

    if (isOriginal && !isNew) {
      return;
    }

    setSelectedEquipments(prev => {
      const current = prev[roomId] || [];
      if (current.includes(equipmentID)) {
        return { ...prev, [roomId]: current.filter(id => id !== equipmentID) };
      } else {
        return { ...prev, [roomId]: [...current, equipmentID] };
      }
    });

    setNewEquipments(prev => {
      const current = prev[roomId] || [];
      if (current.includes(equipmentID)) {
        return { ...prev, [roomId]: current.filter(id => id !== equipmentID) };
      } else {
        return { ...prev, [roomId]: [...current, equipmentID] };
      }
    });
  };

  const handleCloseModal = () => {
    setShowMenusModal(false);
    setShowEquipmentsModal(false);
    setModalCurrentPage(1);
    setModalTotalPages(1);

    const roomId = selectedRooms[currentRoomIndex];
    // Manejar quitar catering si no hay menús seleccionados
    const cateringService = allServices.find(
      s => s.name?.toLowerCase().includes("catering")
    );
    if (
      cateringService &&
      (selectedMenus[roomId]?.length === 0 || !selectedMenus[roomId])
    ) {
      const cateringId = cateringService.ID;
      setSelectedServices(prev => ({
      ...prev,
      [roomId]: (prev[roomId] || []).filter(id => id !== cateringId)
      }));
      setNewServices(prev => ({
      ...prev,
      [roomId]: (prev[roomId] || []).filter(id => id !== cateringId)
      }));
    }

    // Manejar quitar equipos si no hay equipos seleccionados
    const equipmentService = allServices.find(
      s => s.name?.toLowerCase().includes("equipos")
    );
    // Suponiendo que tienes un estado selectedEquipments similar a selectedMenus
    if (
      equipmentService &&
      (selectedEquipments?.[roomId]?.length === 0 || !selectedEquipments?.[roomId])
    ) {
      const equipmentId = equipmentService.ID;
      setSelectedServices(prev => ({
      ...prev,
      [roomId]: (prev[roomId] || []).filter(id => id !== equipmentId)
      }));
      setNewServices(prev => ({
      ...prev,
      [roomId]: (prev[roomId] || []).filter(id => id !== equipmentId)
      }));
    }
  }

  // Manejar el click en el botón para regresar
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

  const selectedEquipmentsForRoom = selectedEquipments[selectedRooms[currentRoomIndex]] || [];
  const selectedMenusForRoom = selectedMenus[selectedRooms[currentRoomIndex]] || []

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
              {/* Paso 1 (formulario) */}
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

              {/*Paso 2 (salas)*/}
              {step === 1 &&
                <div className="booking-client-step2">
                  <Filters
                    allElements={allZones}
                    selectedElements={selectedRooms}
                    setCurrentElements={setCurrentElements}
                    setTotalPages={setTotalPages}
                    currentPage={currentPage}
                    setCurrentPage={setCurrentPage}
                    getName={el => el.NAME}
                    getType={el => el.TYPE}
                    getId={el => el.ZONE_ID}
                    getPrice={el => el.PRICE}
                  />

                  <div className="elements-counter">
                    <p>Selecciona las salas</p>
                    <p>Salas seleccionadas: {selectedRooms.length}</p>
                  </div>

                  {/* Salas compactas */}
                  <div className="edit-booking-grid">
                    {currentElements.map((room) => {
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

              {/* Paso 3 (servicios) */}
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
                          onClick={() => handleServiceClicked(service)}
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

                  {showMenusModal && (
                    <div className="booking-menus-modal">
                      <div className="booking-menus-content">
                        <div className="booking-menus-title-x">
                          <h1>Selecciona los menús</h1>
                          <button type="button" onClick={() => handleCloseModal()}> x </button>
                        </div>

                        <Filters
                          allElements={allMenus}
                          selectedElements={selectedMenusForRoom}
                          setCurrentElements={setCurrentElements}
                          setTotalPages={setModalTotalPages}
                          currentPage={modalCurrentPage}
                          setCurrentPage={setModalCurrentPage}
                          getName={el => el?.NAME || ""}
                          getType={el => el?.TYPE || ""}
                          getId={el => el?.MENU_ID || ""}
                          getPrice={el => el?.PRICE || 0}
                        />

                        <div className="elements-counter">
                          <p>Selecciona los menus</p>
                          <p>Menus seleccionados: {selectedMenusForRoom.length}</p>
                        </div>

                        {/* menus compactos */}
                        <div className="edit-booking-grid">
                          {currentElements.map((menu) => {
                            const isSelected = selectedMenusForRoom.includes(menu.MENU_ID);
                            const isNew = selectedMenusForRoom.includes(menu.MENU_ID);
                            let cardStyle = {};
                            if (isNew && !isSelected) {
                              cardStyle = { opacity: "100%" };
                            } else if (isSelected) {
                              cardStyle = { opacity: "50%" };
                            }
                            return (
                              <div
                                key={menu.MENU_ID}
                                className={`edit-booking-card${isSelected ? " edit-booking-selected-card" : "" }`}
                                onClick={() => handleMenuClicked(menu)}
                                style={cardStyle}
                              >
                                <CompactMenu
                                  menu={menu}
                                  isBooking={true}
                                  isSelected={isSelected}
                                  isNew={isNew}
                                />
                              </div>
                            );
                          })}
                        </div>

                        {/* Paginación */}
                        {modalTotalPages > 1 && (
                          <Pagination
                            currentPage={modalCurrentPage}
                            totalPages={modalTotalPages}
                            onPageChange={setModalCurrentPage}
                          />
                        )}
                      </div>
                    </div>
                  )}

                  {showEquipmentsModal && (
                    <div className="booking-menus-modal">
                      <div className="booking-menus-content">
                        <div className="booking-menus-title-x">
                          <h1>Selecciona los equipos</h1>
                          <button type="button" onClick={() => handleCloseModal()}> x </button>
                        </div>

                        <Filters
                          allElements={allEquipments}
                          selectedElements={selectedEquipmentsForRoom}
                          setCurrentElements={setCurrentElements}
                          setTotalPages={setModalTotalPages}
                          currentPage={modalCurrentPage}
                          setCurrentPage={setModalCurrentPage}
                          getName={el => el?.name || ""}
                          getType={el => el?.type || ""}
                          getId={el => el?.ID || ""}
                          getPrice={el => el?.unitaryPrice || 0}
                        />

                        <div className="elements-counter">
                          <p>Selecciona los equipos</p>
                          <p>Equipos seleccionados: {selectedEquipmentsForRoom.length}</p>
                        </div>

                        {/* equipos compactos */}
                        <div className="edit-booking-grid">
                          {currentElements.map((equipment) => {
                              const isSelected = selectedEquipmentsForRoom.includes(equipment.ID);
                              const isNew = selectedEquipmentsForRoom.includes(equipment.ID);
                              let cardStyle = {};
                              if (isNew && !isSelected) {
                                cardStyle = { opacity: "100%" };
                              } else if (isSelected) {
                                cardStyle = { opacity: "50%" };
                              }
                              return (
                                <div
                                  key={equipment.ID}
                                  className={`edit-booking-card${isSelected ? " edit-booking-selected-card" : ""}`}
                                  onClick={() => handleEquipmentClicked(equipment)}
                                  style={cardStyle}
                                >
                                  <CompactEquipment
                                    equipment={equipment}
                                    isBooking={true}
                                    isSelected={isSelected}
                                    isNew={isNew}
                                  />
                                </div>
                              );
                            })}
                        </div>

                        {/* Paginación */}
                        {modalTotalPages > 1 && (
                          <Pagination
                            currentPage={modalCurrentPage}
                            totalPages={modalTotalPages}
                            onPageChange={setModalCurrentPage}
                          />
                        )}
                      </div>
                    </div>
                  )}

                  {/* Paginación */}
                  {totalPages > 1 && (
                    <Pagination
                      currentPage={currentPage}
                      totalPages={totalPages}
                      onPageChange={setCurrentPage}
                    />
                  )}

                  <div className = "" style={{ display: 'flex', justifyContent: 'space-between', marginTop: 16 }}>
                    <button
                      type="button"
                      className="booking-next-step-button active"
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