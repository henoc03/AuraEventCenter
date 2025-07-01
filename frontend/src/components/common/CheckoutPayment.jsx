import React from "react";
import PropTypes from "prop-types";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import PayPalCard from "../../assets/images/paypal-card.png";
import "../../style/checkout-payment.css";
import LoadingPage from "./LoadingPage";

// Ejemplo de datos enviados al backend para ese componente
        // const payload = {
        //   rooms: selectedRooms,
        //   menus: Object.fromEntries(selectedRooms.map(id => [id, selectedMenus[id] || []])),
        //   services: Object.fromEntries(selectedRooms.map(id => [id, selectedServices[id] || []])),
        //   equipments: Object.fromEntries(selectedRooms.map(id => [id, selectedEquipments[id] || []])),
        //   startTime: step1Data.startTime, // asegúrate que esté en formato "HH:MM"
        //   endTime: step1Data.endTime
        // };
function CheckoutPayment({ paymentSummary, paymentLoading, onPaymentSuccess, onPaymentError }) {
  if (paymentLoading) return <LoadingPage />;

  if (!paymentSummary) {
    return <div>No se pudo calcular el resumen de pago.</div>;
  }

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
                      if (onPaymentSuccess) onPaymentSuccess(details);
                      alert(`Pago completado por ${details.payer.name.given_name}`);
                    });
                  }}
                  onError={(err) => {
                    if (onPaymentError) onPaymentError(err);
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
  );
}

CheckoutPayment.propTypes = {
  paymentSummary: PropTypes.object,
  paymentLoading: PropTypes.bool,
  onPaymentSuccess: PropTypes.func,
  onPaymentError: PropTypes.func,
};

export default CheckoutPayment;