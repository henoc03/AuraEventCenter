import React, {useEffect, useState } from "react";
import PropTypes from 'prop-types';
import {jwtDecode} from 'jwt-decode';
import { useNavigate, useParams } from "react-router-dom";
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
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import PayPalCard from "../assets/images/paypal-card.png";
import '../style/edit-booking-client.css'

const DEFAULT_ROUTE = "http://localhost:1522";

// Componente para la página de edición de reservas para el cliente
function EditBookingClient({ sections }) {
  // Estados para información del header
  const [userID, setUserID] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [lastname, setLastname] = useState("");
  const [role, setRole] = useState("");

  // Estados para guardar toda la informacion de la reserva
  const [allZones, setAllZones] = useState([]);
  const [selectedRooms, setSelectedRooms] = useState([]);
  const [newRooms, setNewRooms] = useState([]);
  const [allServices, setAllServices] = useState([]);
  const [selectedServices, setSelectedServices] = useState({});
  const [newServices, setNewServices] = useState({});
  const [allMenus, setAllMenus] = useState([]);
  const [selectedMenus, setSelectedMenus] = useState({});
  const [newMenus, setNewMenus] = useState({});
  const [allEquipments, setAllEquipments] = useState([]);
  const [selectedEquipments, setSelectedEquipments] = useState({});
  const [newEquipments, setNewEquipments] = useState({});

  // Estados para manejar la indexación de las páginas
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [modalCurrentPage, setModalCurrentPage] = useState(1);
  const [modalTotalPages, setModalTotalPages] = useState(1);
  const [currentElements, setCurrentElements] = useState([]);
  const [modalCurrentElements, setModalCurrentElements] = useState([])

  // Otros estados
  const [showMenusModal, setShowMenusModal] = useState(false);
  const [showEquipmentsModal, setShowEquipmentsModal] = useState(false);
  const [currentRoomIndex, setCurrentRoomIndex] = useState(0);
  const [loading, setLoading] = useState(true)
  const [step, setStep] = useState(0);
  const [step1Data, setStep1Data] = useState({});
  const { bookingId } = useParams();
  const [paymentSummary, setPaymentSummary] = useState(null);
  const [paymentLoading, setPaymentLoading] = useState(false);
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
        setUserID(userData.USER_ID)
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
  }, [navigate, bookingId]);

  // Obtener informacion de la reserva para el formulario
  useEffect(() => {
    const getBookingInfo = async () => {
      try {
        const res = await fetch(`${DEFAULT_ROUTE}/bookings/${bookingId}`, {
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
      }
    };

    getBookingInfo();
  }, [navigate, bookingId]);

  // Obtener todas las zonas disponiles para agendar
  useEffect(() => {
    const getAllAvailableZones = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${DEFAULT_ROUTE}/zones/available`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ 
            date: step1Data.date, 
            startTime: step1Data.startTime, 
            endTime: step1Data.endTime,
            bookingId: bookingId
          }),
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

    if (step1Data.date && step1Data.startTime && step1Data.endTime) {
      getAllAvailableZones();
    }
  }, [step1Data.date, step1Data.startTime, step1Data.endTime, bookingId]);

  // Obtener las zonas que se habian seleccionado para la reserva
  useEffect(() => {
    const getSelectedZones = async () => {
      try {
        const res = await fetch(`${DEFAULT_ROUTE}/bookings/zones/${bookingId}`, {
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
  }, [navigate, bookingId]);

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
  }, [selectedRooms, bookingId]);

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
  }, [selectedRooms, bookingId]);

  // Obtener todos los equipos disponibles
  useEffect(() => {
    const getAllEquipments= async () => {
      try {
        const res = await fetch(`${DEFAULT_ROUTE}/equipments/available`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ 
            date: step1Data.date, 
            startTime: step1Data.startTime, 
            endTime: step1Data.endTime,
            bookingId: bookingId
          }),
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
      } finally {
        setLoading(false);
      }
    };

    if (step1Data.date && step1Data.startTime && step1Data.endTime) {
      getAllEquipments();
    }
  }, [bookingId, step1Data.date, step1Data.startTime, step1Data.endTime]);

  // Obtener los equipos que se habían seleccionado para la reserva
  useEffect(() => {
    const getSelectedEquipments = async () => {
      try {
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
  }, [selectedRooms, bookingId]);

  const handleUpdate = async () => {
    const res = await fetch(`${DEFAULT_ROUTE}/bookings/update`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: userID,
        bookingId: bookingId,
        bookingInfo: step1Data,
        rooms: selectedRooms,
        services: newServices,
        menus: newMenus,
        equipments: newEquipments
      })
    });

    if (res.ok) {
      alert("Reserva actualizada con éxito");
      navigate("/inicio");
    } else {
      alert("Error al actualizar la reserva");
    }
  };

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

    // Si la sala es nueva
    if (newRooms.includes(roomID)) {
      setNewRooms(prev => prev.filter(id => id !== roomID));
      setSelectedRooms(prev => prev.filter(id => id !== roomID));
    } else {
      // Si la sala no estaba seleccionada
      setNewRooms(prev => [...prev, roomID]);
      setSelectedRooms(prev => [...prev, roomID]);
    }
  };

  // Manejar la selección
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

  // Paso de pago: obtener resumen de precios basado en la selección actual
  useEffect(() => {
    const fetchPaymentSummary = async () => {
      setPaymentLoading(true);
      try {
        // Construir el payload con la selección actual
        const payload = {
          rooms: selectedRooms,
          menus: selectedMenus,
          services: selectedServices,
          equipments: selectedEquipments,
        };
        console.log("PAYMENT PAYLOAD:", payload); // <-- Agrega esto
        // Llama a un endpoint backend que calcule el resumen de precios
        const res = await fetch(`${DEFAULT_ROUTE}/bookings/payment-summary`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!res.ok) {
          const errorData = await res.json();
          alert(errorData.message || "Error al calcular el resumen de pago");
          setPaymentSummary(null);
          return;
        }
        const summary = await res.json();
        console.log("PAYMENT SUMMARY RESPONSE:", summary);
        setPaymentSummary(summary);
      } catch (err) {
        setPaymentSummary(null);
        alert("Ocurrió un error al calcular el resumen de pago.");
      } finally {
        setPaymentLoading(false);
      }
    };

    // Solo cargar si estamos en el paso de pago
    if (step === 3) {
      fetchPaymentSummary();
    }
    // eslint-disable-next-line
  }, [step, selectedRooms, selectedMenus, selectedServices, selectedEquipments]);

  if (loading) return <LoadingPage />;

  // Nombres de los pasos
  const steps = [
    "Seleccionar sala",
    "Detalles de reserva",
    "Confirmar datos",
    "Finalizar",
    "Pago"
  ];

  const selectedEquipmentsForRoom = selectedEquipments[selectedRooms[currentRoomIndex]] || [];
  const selectedMenusForRoom = selectedMenus[selectedRooms[currentRoomIndex]] || []
  const selectedServicesForRoom = selectedServices[selectedRooms[currentRoomIndex]] || []

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
                    getName={el => el?.NAME || ""}
                    getType={el => el?.TYPE || ""}
                    getId={el => el?.ZONE_ID || ""}
                    getPrice={el => el?.PRICE || ""}
                  />

                  <div className="elements-counter">
                    <p>Selecciona las salas, las que no estén disponibles en la fecha y horario especifícados no aparecen.</p>
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
                  <Filters
                    allElements={allServices}
                    selectedElements={selectedServicesForRoom}
                    setCurrentElements={setCurrentElements}
                    setTotalPages={setTotalPages}
                    currentPage={currentPage}
                    setCurrentPage={setCurrentPage}
                    getName={el => el?.name|| ""}
                    getType={el => el?.type || ""}
                    getId={el => el?.ID || ""}
                    getPrice={el => el?.price || ""}
                  />

                  <div className="elements-counter">
                    <p>Selecciona los servicios para la sala:
                      {' '}
                      <b>
                        {allZones.find(z => z.ZONE_ID === selectedRooms[currentRoomIndex])?.NAME || ("Sala " + (currentRoomIndex + 1))}
                      </b>
                    </p>
                    <p>Servicios seleccionados: {selectedServicesForRoom.length}</p>
                  </div>

                  {/* Servicios compactos */}
                  <div className="edit-booking-grid">
                    {currentElements.map((service) => {
                      const isSelected = selectedServicesForRoom.includes(service.ID);
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
                          setCurrentElements={setModalCurrentElements}
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
                          {modalCurrentElements.map((menu) => {
                            const isSelected = selectedMenusForRoom.includes(menu.MENU_ID);
                            const isNew = (newMenus[selectedRooms[currentRoomIndex]] || []).includes(menu.MENU_ID);
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
                          setCurrentElements={setModalCurrentElements}
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
                          {modalCurrentElements.map((equipment) => {
                              const isSelected = selectedEquipmentsForRoom.includes(equipment.ID);
                              const isNew = (newEquipments[selectedRooms[currentRoomIndex]] || []).includes(equipment.ID);
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

                    <button onClick={() => handleUpdate()}>actualizar</button>
                  </div>
                </div>
              )}

              {/* Paso de pago */}
              {step === 3 && (
                <div className="checkout-container">
                  {paymentLoading ? (
                    <LoadingPage />
                  ) : paymentSummary ? (
                    <div className="checkout-content">
                      <div className="checkout-grid">
                        <div className="checkout-main">
                          <h2 className="checkout-subtitle">Proceder al pago</h2>
                          <h1 className="checkout-title">PayPal</h1>
                          <div className="paypal-box">
                            <img src={PayPalCard} alt="PayPal Card" className="paypal-image" />
                            <p className="paypal-description">
                              Después de hacer clic en "Pagar",<br />
                              serás redirigido a PayPal para completar<br />
                              tu compra de forma segura.
                            </p>
                            <div className="paypal-buttons">
                              <PayPalScriptProvider options={{ "client-id": import.meta.env.VITE_PAYPAL_CLIENT_ID }}>
                                <PayPalButtons
                                  style={{ layout: "horizontal", label: "pay" }}
                                  createOrder={(data, actions) => {
                                    return actions.order.create({
                                      purchase_units: [
                                        {
                                          amount: {
                                            value: (paymentSummary.total / 540).toFixed(2),
                                            currency_code: "USD",
                                          },
                                        },
                                      ],
                                    });
                                  }}
                                  onApprove={(data, actions) => {
                                    return actions.order.capture().then((details) => {
                                      alert(`Pago completado por ${details.payer.name.given_name}`);
                                      // Aquí puedes enviar la confirmación al backend si lo necesitas
                                    });
                                  }}
                                  onError={(err) => {
                                    console.error(err);
                                    alert("Error en el pago con PayPal");
                                  }}
                                />
                              </PayPalScriptProvider>
                            </div>
                          </div>
                        </div>
                        <div className="checkout-sidebar">
                          {paymentSummary.zonas.map((zona) => (
                            <div key={zona.zoneId} className="room-summary">
                              <div className="room-info">
                                <h3 className="room-title">{zona.name}</h3>
                                <p className="room-price">₡{zona.basePrice.toLocaleString()}</p>
                              </div>
                              <div className="room-options">
                                <ul className="room-options-list">
                                  {zona.menus.map((menu) => (
                                    <li key={menu.MENU_ID}>
                                      {menu.NAME} - ₡{menu.PRICE.toLocaleString()}
                                    </li>
                                  ))}
                                  {zona.services.map((s) => (
                                    <li key={s.ADDITIONAL_SERVICE_ID}>
                                      {s.NAME} - ₡{s.PRICE.toLocaleString()}
                                    </li>
                                  ))}
                                  {zona.equipments.map((e) => (
                                    <li key={e.EQUIPMENT_ID}>
                                      {e.NAME} - ₡{e.UNITARY_PRICE.toLocaleString()}
                                    </li>
                                  ))}
                                </ul>
                                <p><strong>Subtotal zona:</strong> ₡{zona.subtotal.toLocaleString()}</p>
                              </div>
                            </div>
                          ))}
                          <div className="checkout-summary">
                            <div className="summary-line">
                              <span>Subtotal:</span>
                              <span>₡{paymentSummary.total.toLocaleString()}</span>
                            </div>
                            <div className="summary-line">
                              <span>Iva (13%):</span>
                              <span>₡{paymentSummary.iva.toLocaleString()}</span>
                            </div>
                            <div className="summary-total">
                              <span>Total:</span>
                              <span>₡{paymentSummary.totalConIva.toLocaleString()}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div>No se pudo calcular el resumen de pago.</div>
                  )}
                </div>
              )}
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