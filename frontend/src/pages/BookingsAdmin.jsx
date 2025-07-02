import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Header from "../components/common/Header";
import SideNav from "../components/common/SideNav";
import AlertMessage from "../components/common/AlertMessage";
import LoadingPage from "../components/common/LoadingPage";
import BookingCard from "../components/common/BookingCard";
import BookingModal from "../components/common/BookingModal";
import Pagination from "../components/common/Pagination";
import { jwtDecode } from 'jwt-decode';
import "../style/admin-bookings.css";

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

  const navigate = useNavigate();
  const location = useLocation();


  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("todos");
  const [sortOrder, setSortOrder] = useState("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const bookingsPerPage = 8;

  const uniqueTypes = Array.from(new Set(bookings.map(b => b.status).filter(Boolean)));

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

  const filteredBookings = bookings
    .filter((b) => {
      const matchesSearch = b.bookingName.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = typeFilter === "todos" || b.status?.toLowerCase() === typeFilter;
      return matchesSearch && matchesType;
    })
    .sort((a, b) => {
      const nameA = a.bookingName.toLowerCase();
      const nameB = b.bookingName.toLowerCase();
      return sortOrder === "asc" ? nameA.localeCompare(nameB) : nameB.localeCompare(nameA);
    });

  const indexOfLastBooking = currentPage * bookingsPerPage;
  const indexOfFirstBooking = indexOfLastBooking - bookingsPerPage;
  const currentBookings = filteredBookings.slice(indexOfFirstBooking, indexOfLastBooking);
  const totalPages = Math.ceil(filteredBookings.length / bookingsPerPage);


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
          <div className="bookings-content-wrapper">
            <section className="bookings-section">
              <div className="bookings-section-header">
                <h2 className="bookings-section-title">Reservas</h2>
                <button className="btn-add-booking" onClick={() => navigate(`${location.pathname.replace(/\/$/, "")}/crear`)}>
                  Agregar
                </button>
              </div>

              <div className="bookings-controls">
                <label htmlFor="search">Buscar:</label>
                <input
                  id="search"
                  type="text"
                  placeholder="Buscar reserva..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="bookings-search-input"
                />

                <label htmlFor="type">Filtrar:</label>
                <select
                  id="type"
                  value={typeFilter}
                  onChange={(e) => {
                    setTypeFilter(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="bookings-status-select"
                >
                  <option value="todos">Todos</option>
                  {uniqueTypes.map(type => (
                    <option key={type} value={type}>{type.charAt(0).toUpperCase() + type.slice(1)}</option>
                  ))}
                </select>

                <label htmlFor="sort">Orden:</label>
                <select
                  id="sort"
                  value={sortOrder}
                  onChange={(e) => {
                    setSortOrder(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="bookings-sort-select"
                >
                  <option value="asc">A-Z</option>
                  <option value="desc">Z-A</option>
                </select>
              </div>

              <div className="bookings-grid">
                {currentBookings.map((booking) => (
                  <BookingCard
                    key={booking.id}
                    booking={booking}
                    onView={() => openModal("view", booking)}
                    onDelete={() => openModal("delete", booking)}
                    onEdit={() => console.log("Hay que implementar")}
                  />
                ))}
              </div>

              {totalPages > 1 && (
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                />
              )}
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
