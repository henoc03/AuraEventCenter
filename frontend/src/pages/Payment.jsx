import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import Nav from "../components/common/Nav";
import "../style/payment-page.css";
import PayPalCard from "../assets/images/paypal-card.png";
import StepBar from "../components/common/StepBar";

const CheckoutPayPal = () => {
  const totalCRC = 1728900;
  const exchangeRate = 530; // 1 USD = 530 CRC (ejemplo)
  const totalUSD = (totalCRC / exchangeRate).toFixed(2);

  return (
    <div className="checkout-container">
      <Nav />
      <div className="checkout-content">
        <div className="step-bar">
          <StepBar currentStep={3} />
        </div>
        <div className="checkout-grid">
          {/* Columna principal */}
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
                            amount: { value: totalUSD },
                          },
                        ],
                      });
                    }}
                    onApprove={(data, actions) => {
                      return actions.order.capture().then((details) => {
                        alert(`Pago completado por ${details.payer.name.given_name}`);
                      });
                    }}
                    onError={(err) => {
                      console.error("Error en el pago:", err);
                    }}
                  />
                </PayPalScriptProvider>
              </div>
            </div>
          </div>

          {/* Columna lateral */}
          <div className="checkout-sidebar">
            <div className="room-summary">
              <img src="/room.jpg" alt="Sala Chacia" className="room-image" />
              <div className="room-info">
                <h3 className="room-title">Sala Chacia</h3>
                <p className="room-price">₡400,000</p>
              </div>
            </div>

            <div className="room-options">
              <p className="room-options-label">Opciones seleccionadas para la sala:</p>
              <ul className="room-options-list">
                <li>Menú Gourmet</li>
                <li>₡11,300 por persona</li>
                <li>Subtotal: ₡1,130,000</li>
              </ul>
            </div>

            <div className="checkout-summary">
              <div className="summary-line">
                <span>Subtotal:</span>
                <span>₡1,530,000</span>
              </div>
              <div className="summary-line">
                <span>Iva (13%):</span>
                <span>₡198,900</span>
              </div>
              <div className="summary-total">
                <span>Total:</span>
                <span>₡1,728,900</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPayPal;
