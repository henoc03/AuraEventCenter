import React, {useEffect, useState } from "react";
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
import CheckoutPayment from "../components/common/CheckoutPayment.jsx";


import useCreateBooking from "../components/utils/useCreateBooking.js";

const DEFAULT_ROUTE = "http://localhost:1522";

function CreateBookingClient({ sections }) {
  const [paymentSummary, setPaymentSummary] = useState(null);
  const [paymentLoading, setPaymentLoading] = useState(false);
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
    try {

      const res = await fetch(`${DEFAULT_ROUTE}/bookings/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.USER_ID,
          bookingInfo: step1Data,
          rooms: selectedRooms,
          services: selectedServices,
          menus: selectedMenus,
          equipments: selectedEquipments,
          currentPayment: paymentSummary.totalConIva // <--- aquí
        })
      });

      if (res.ok) {
        alert("Reserva creada con éxito");
        navigate("/inicio");
      } else {
        alert("Error al crear la reserva");
      }
    } catch (err) {
      console.error("Error al crear reserva:", err);
      alert("Hubo un error al enviar la reserva.");
    }
  };


  // Paso de pago: obtener resumen de precios basado en la selección actual
  useEffect(() => {
    const fetchPaymentSummary = async () => {
      setPaymentLoading(true);
      try {
        // Construir el payload con la selección actual
        const payload = {
          rooms: selectedRooms,
          menus: Object.fromEntries(selectedRooms.map(id => [id, selectedMenus[id] || []])),
          services: Object.fromEntries(selectedRooms.map(id => [id, selectedServices[id] || []])),
          equipments: Object.fromEntries(selectedRooms.map(id => [id, selectedEquipments[id] || []])),
          startTime: step1Data.startTime, // asegúrate que esté en formato "HH:MM"
          endTime: step1Data.endTime
        };
        console.log("Hora inicio;", payload.startTime);
        console.log("Hora fin:", payload.endTime);
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
                  <button type='button' className="back-btn-bookings-client" onClick={() => window.history.back()}>
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
                loading={loading}
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
            <>
              <div className="checkout-container">
                <CheckoutPayment
                  paymentSummary={paymentSummary}
                  paymentLoading={paymentLoading}
                  userEmail={user.EMAIL}
                  userName={`${user.FIRST_NAME} ${user.LAST_NAME_1}`}
                  userID={user.USER_ID}
                  step1Data={step1Data}
                  selectedRooms={selectedRooms}
                  newServices={selectedServices}
                  newMenus={selectedMenus}
                  newEquipments={selectedEquipments}
                  onPaymentSuccess={() => {
                    // Puedes navegar o mostrar un mensaje aquí si quieres
                    navigate("/inicio");
                  }}
                  onPaymentError={() => {
                    // Aquí puedes manejar errores de pago
                  }}
                />
              </div>
            </>
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
