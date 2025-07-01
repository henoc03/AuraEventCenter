import React from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/common/Header.jsx";
import SideNav from "../components/common/SideNav.jsx";
import StepBar from "../components/common/StepBar.jsx";
import Footer from '../components/common/Footer';
import LoadingPage from "../components/common/LoadingPage.jsx";

import Step1Form from "../components/sections/bookings/Step1Form.jsx";
import RoomSelector from "../components/sections/bookings/RoomSelector.jsx";
import ServiceSelector from "../components/sections/bookings/ServiceSelector.jsx";
import ConfirmBooking from "../components/sections/bookings/ConfirmBooking.jsx";


import useCreateBooking from "../components/utils/useCreateBooking.js";

const DEFAULT_ROUTE = "http://localhost:1522";

function CreateBookingClient({ sections }) {
  const navigate = useNavigate();
  const {
    user,
    step,
    setStep,
    step1Data,
    setStep1Data,
    allZones,
    selectedRooms,
    setSelectedRooms,
    allServices,
    selectedServices,
    setSelectedServices,
    allMenus,
    selectedMenus,
    setSelectedMenus,
    allEquipments,
    selectedEquipments,
    setSelectedEquipments,
    loading
  } = useCreateBooking();

const handleSubmit = async () => {
  const res = await fetch(`${DEFAULT_ROUTE}/bookings/create`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      userId: user?.ID,
      bookingInfo: step1Data,
      rooms: selectedRooms,
      services: selectedServices,
      menus: selectedMenus,
      equipments: selectedEquipments
    })
  });

  if (res.ok) {
    alert("Reserva creada con éxito");
    navigate("/inicio");
  } else {
    alert("Error al crear la reserva");
  }
};


  if (loading || !user) return <LoadingPage />;

  const steps = ["Detalles", "Salas", "Servicios", "Confirmar"];

  return (
    <>
      <Header name={user.FIRST_NAME} lastname={user.LAST_NAME_1} role={user.USER_TYPE} email={user.EMAIL}>
        <SideNav id="booking-sidenav-mobile" sections={sections} />
      </Header>

      <div className="booking-client-sidenav-main">
        <div id="booking-sidenav-desktop">
                  <SideNav className="booking-sidenav" sections={sections} />
                </div>
        
                <div className="booking-client-content">
                  <button type='button' className="back-btn-bookings-client" onClick={() => navigate("/inicio")}>
                    <i className="bi bi-arrow-left"></i> Regresar
                  </button>
        <div className="booking-client-content">
          <h1>Crear nueva reserva</h1>
          <StepBar steps={steps} currentStep={step} />

          <div className="booking-client-step-content">
            {step === 0 && (
              <Step1Form
                onNext={(data) => {
                  setStep1Data(data);
                  setStep(1);
                }}
                bookingInfo={step1Data}
              />
            )}

            {step === 1 && (
              <RoomSelector
                allZones={allZones}
                selectedRooms={selectedRooms}
                setSelectedRooms={setSelectedRooms}
                onNext={() => setStep(2)}
                onBack={() => setStep(0)}
              />
            )}

            {step === 2 && (
              <ServiceSelector
                allServices={allServices}
                allZones={allZones}
                selectedRooms={selectedRooms}
                selectedServices={selectedServices}
                setSelectedServices={setSelectedServices}
                allMenus={allMenus}
                selectedMenus={selectedMenus}
                setSelectedMenus={setSelectedMenus}
                allEquipments={allEquipments}
                selectedEquipments={selectedEquipments}
                setSelectedEquipments={setSelectedEquipments}
                onNext={() => setStep(3)}
                onBack={() => setStep(1)}
              />
            )}

            {step === 3 && (
            <ConfirmBooking
              userId={user.USER_ID}
              step1Data={step1Data}
              selectedRooms={selectedRooms}
              selectedServices={selectedServices}
              selectedMenus={selectedMenus}
              selectedEquipments={selectedEquipments}
              onBack={() => setStep(2)}
            />
          )}

            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default CreateBookingClient;
