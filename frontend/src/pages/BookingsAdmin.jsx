import React, { useEffect, useState } from "react";
import Header from "../components/common/Header";
import SideNav from "../components/common/SideNav";
import AlertMessage from "../components/common/AlertMessage";
import LoadingPage from "../components/common/LoadingPage";
import BookingCard from "../components/common/BookingCard";
import BookingModal from "../components/common/BookingModal";
import { jwtDecode } from 'jwt-decode';

const PORT = "http://localhost:1522";

const Bookings = ({ sections }) => {
  const [bookings, setBookings] = useState([]);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [modalMode, setModalMode] = useState("");
  const [messageType, setMessageType] = useState('');
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const fetchUserInfo = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const { id } = jwtDecode(token);
        const res = await fetch(`${PORT}/users/${id}`);
        const user = await res.json();
        setCurrentUser(user);
      } catch (err) {
        console.error("Error al obtener usuario:", err);
      }
    };

    fetchUserInfo();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${PORT}/bookings`);
      const data = await res.json();
      setBookings(data);
    } catch (err) {
      console.error("Error al obtener reservas:", err);
      setMessage("Error al cargar las reservas");
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const openModal = (mode, booking) => {
    setModalMode(mode);
    setSelectedBooking(booking);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedBooking(null);
    setIsModalOpen(false);
  };

  const handleDelete = async (booking) => {
  try {
    await fetch(`${PORT}/bookings/${booking.id}`, {
      method: "DELETE"
    });
    setMessage("Reserva eliminada correctamente");
    setMessageType("success");
    fetchBookings();
  } catch (err) {
    console.error("Error al eliminar reserva:", err);
    setMessage("Error al eliminar reserva");
    setMessageType("error");
  }
};

  if (loading) return <LoadingPage />;

  return (
    <div className="bookings-page">
      <AlertMessage
        message={message}
        type={messageType}
        onClose={() => setMessage('')}
        className="alert-floating"
      />

      <Header
        name={currentUser?.FIRST_NAME}
        lastname={currentUser?.LAST_NAME_1}
        role={currentUser?.USER_TYPE}
        email={currentUser?.EMAIL}
      />
      <div className="bookings-dashboard">
        <SideNav sections={sections} />
        <main className="bookings-dashboard-content">
          <button type='button' className="back-btn" onClick={() => window.history.back()}>
            <i className="bi bi-arrow-left"></i> Regresar
          </button>
          <div className="bookings-content-wrapper">
            <section className="bookings-section">
              <h2 className="bookings-section-title">Reservas registradas</h2>

              <div className="bookings-grid">
                {bookings.map((booking) => (
                  <BookingCard
                    key={booking.id}
                    booking={booking}
                    onView={() => openModal(booking)}
                    onDelete={() => openModal("delete", booking)}
                    onEdit={() => console.log("Editar aún no implementado")}
                  />
                ))}
              </div>
            </section>
          </div>
        </main>
      </div>

      <BookingModal
        isOpen={isModalOpen}
        mode={modalMode}
        booking={selectedBooking}
        onClose={closeModal}
        onDelete={handleDelete}
      />
    </div>
  );
};

export default Bookings;
