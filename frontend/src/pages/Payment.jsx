import React, { useEffect, useState } from "react";
import Nav from "../components/common/Nav";
import StepBar from "../components/common/StepBar";
import PayPalCard from "../assets/images/paypal-card.png";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { useParams, useNavigate } from "react-router-dom";
import "../style/payment-page.css";
import LoadingPage from "../components/common/LoadingPage";

function Payments() {
  const { bookingId } = useParams();
  return <CheckoutPayPal bookingId={bookingId} />;
}

const DEFAULT_ROUTE = "http://localhost:1522";

function CheckoutPayPal({ bookingId }) {
  const [bookingData, setBookingData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Debes iniciar sesión para ver esta reserva.");
      navigate("/iniciar-sesion");
      return;
    }

    getBookingDetail(token);
    // eslint-disable-next-line
  }, []);

  const getBookingDetail = async (token) => {
    try {
      const res = await fetch(`${DEFAULT_ROUTE}/booking/${bookingId}/detail`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        const errorData = await res.json();
        alert(errorData.message || "Error al obtener la reserva");
        navigate("/"); // Redirigir si la reserva no es válida o no le pertenece
        return;
      }

      const data = await res.json();

      const currentUser = JSON.parse(localStorage.getItem("user"));
      if (Number(data.booking.USER_ID) !== Number(currentUser.userId)) {
        alert("No tienes permiso para ver esta reserva. FRONTEND-ERROR-001");
        navigate("/");
        return;
      }


      setBookingData(data);
    } catch (error) {
      console.error("Error al obtener la reserva:", error);
      alert("Ocurrió un error al obtener la reserva.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingPage />;
  if (!bookingData) return <div>No se encontró la reserva.</div>;

  const subtotal = bookingData.total;
  const iva = Math.round(subtotal * 0.13);
  const total = Math.round(subtotal * 1.13);

  return (
    <div className="checkout-container">
      <Nav />
      <div className="checkout-content">
        <div className="step-bar">
          <StepBar currentStep={3} />
        </div>
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
                              value: (total / 540).toFixed(2),
                              currency_code: "USD",
                            },
                          },
                        ],
                      });
                    }}
                    onApprove={(data, actions) => {
                      return actions.order.capture().then((details) => {
                        alert(`Pago completado por ${details.payer.name.given_name}`);
                        // Aquí puedes enviar la confirmación al backend
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
            {bookingData.zonas.map((zona) => (
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
                <span>₡{subtotal.toLocaleString()}</span>
              </div>
              <div className="summary-line">
                <span>Iva (13%):</span>
                <span>₡{iva.toLocaleString()}</span>
              </div>
              <div className="summary-total">
                <span>Total:</span>
                <span>₡{total.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Payments;
