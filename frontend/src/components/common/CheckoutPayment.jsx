import React from "react";
import PropTypes from "prop-types";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import PayPalCard from "../../assets/images/paypal-card.png";
import "../../style/checkout-payment.css";
import LoadingPage from "./LoadingPage";

const DEFAULT_ROUTE = "http://localhost:1522";

function CheckoutPayment({
  paymentSummary,
  paymentLoading,
  onPaymentSuccess,
  onPaymentError,
  userEmail,
  userName,
  userID,
  bookingId,
  step1Data,
  selectedRooms,
  newServices,
  newMenus,
  newEquipments,
  amountToPay, // <-- Nuevo prop para el monto a pagar
}) {
  if (paymentLoading) return <LoadingPage />;

  if (!paymentSummary) {
    return <div>No se pudo calcular el resumen de pago.</div>;
  }

  // Función para enviar el correo de confirmación
  const sendConfirmationEmail = async () => {
    try {
      console.log("[CheckoutPayment] Enviando correo a:", userEmail, "Nombre:", userName);
      const res = await fetch(`${DEFAULT_ROUTE}/email/send-booking-confirmation`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: userEmail,
          name: userName,
          paymentSummary
        })
      });
      const data = await res.json();
      console.log("[CheckoutPayment] Respuesta backend email:", data);
    } catch (err) {
      console.error("[CheckoutPayment] Error enviando correo de confirmación:", err);
    }
  };

  // Función para actualizar la reserva
  const updateBooking = async () => {
    try {
      console.log("[CheckoutPayment] Actualizando reserva...", {
        userID,
        bookingId,
        step1Data,
        selectedRooms,
        newServices,
        newMenus,
        newEquipments
      });
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
      const data = await res.json();
      console.log("[CheckoutPayment] Respuesta backend update:", data);
      if (!res.ok) {
        alert(data.message || "Error al actualizar la reserva");
      }
    } catch (err) {
      console.error("[CheckoutPayment] Error actualizando la reserva:", err);
      alert("Ocurrió un error al actualizar la reserva.");
    }
  };

  // Función para crear una nueva reserva
  const createBooking = async () => {
    try {
      const res = await fetch("http://localhost:1522/bookings/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: userID,
          bookingInfo: step1Data,
          rooms: selectedRooms,
          services: newServices,
          menus: newMenus,
          equipments: newEquipments,
          currentPayment: paymentSummary.totalConIva
        })
      });
      const data = await res.json();
      console.log("[CheckoutPayment] Respuesta backend create:", data);
      if (!res.ok) {
        alert(data.message || "Error al crear la reserva");
      }
    } catch (err) {
      console.error("[CheckoutPayment] Error creando la reserva:", err);
      alert("Ocurrió un error al crear la reserva.");
    }
  };

  return (
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
                    // Si amountToPay está definido, es edición; si no, es creación
                    const monto = typeof amountToPay === "number"
                      ? amountToPay
                      : paymentSummary?.totalConIva || 0;
                    return actions.order.create({
                      purchase_units: [
                        {
                          amount: {
                            value: (monto / 500).toFixed(2), // en USD
                            currency_code: "USD",
                          },
                        },
                      ],
                    });
                  }}
                  onApprove={async (data, actions) => {
                    return actions.order.capture().then(async (details) => {
                      if (bookingId) {
                        await updateBooking();
                        console.log("[CheckoutPayment] Reserva actualizada con éxito");
                      } else {
                        await createBooking();
                        console.log("[CheckoutPayment] Reserva creada con éxito");
                      }
                      await sendConfirmationEmail();
                      if (onPaymentSuccess) onPaymentSuccess(details);
                      alert(`Pago completado por ${details.payer.name.given_name}`);
                    });
                  }}
                  onError={(err) => {
                    if (onPaymentError) onPaymentError(err);
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
                <p className="room-price">
                  ₡{zona.basePrice.toLocaleString()}{" "}
                  <span style={{ fontSize: "0.95em", color: "#555" }}>
                    ({zona.hours} hora{zona.hours !== 1 ? "s" : ""})
                  </span>
                </p>
              </div>
              <div className="room-options">
                <ul className="room-options-list">
                  {zona.menus.map((menu) => (
                    <li key={menu.MENU_ID}>
                      {menu.NAME}
                      {menu.CANTIDAD ? ` x ${menu.CANTIDAD}` : ""} - ₡
                      {menu.PRICE.toLocaleString()}
                      {menu.CANTIDAD > 1 && (
                        <span style={{ color: "#888", fontSize: "0.95em" }}>
                          {" "}({`₡${(menu.PRICE / menu.CANTIDAD).toLocaleString()} c/u`})
                        </span>
                      )}
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
  );
}

CheckoutPayment.propTypes = {
  paymentSummary: PropTypes.object,
  paymentLoading: PropTypes.bool,
  onPaymentSuccess: PropTypes.func,
  onPaymentError: PropTypes.func,
  userEmail: PropTypes.string.isRequired,
  userName: PropTypes.string,
  userID: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  bookingId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  step1Data: PropTypes.object,
  selectedRooms: PropTypes.array,
  newServices: PropTypes.object,
  newMenus: PropTypes.object,
  newEquipments: PropTypes.object,
};

export default CheckoutPayment;