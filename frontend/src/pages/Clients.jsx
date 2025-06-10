import React, { useEffect, useState } from "react";
import UsersPage from "../components/sections/Users";
import SideNav from "../components/common/SideNav";
import Header from "../components/common/Header";
import UserModal from "../components/common/UserModal";
import AlertMessage from '../components/common/AlertMessage';
import LoadingPage from "../components/common/LoadingPage";
import Pagination from "../components/common/Pagination";
import { jwtDecode } from 'jwt-decode';

import "../style/admin-users.css";

const PORT = "http://localhost:1522";

const Clients = ({ sections }) => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');

  // Paginación
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 8;

  useEffect(() => {
    const fetchUserInfo = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const { id } = jwtDecode(token);
        const res = await fetch(`${PORT}/users/${id}`);
        if (!res.ok) throw new Error("No se pudo obtener el usuario");

        const user = await res.json();
        setCurrentUser(user);
      } catch (err) {
        console.error("Error al obtener el usuario:", err);
        localStorage.removeItem("token");
      }
    };

    fetchUserInfo();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${PORT}/dashboard/clients`);
      const data = await res.json();

      const formatted = data.map((u) => ({
        name: `${u.FIRST_NAME} ${u.LAST_NAME_1} ${u.LAST_NAME_2 || ""}`,
        email: u.EMAIL,
        phone: u.PHONE,
        status: u.ACTIVE === 1 ? "activo" : "inactivo",
        id: u.USER_ID,
        image: "/default-image.jpg"
      }));

      setUsers(formatted);
    } catch (err) {
      console.error("Error al obtener usuarios:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const openModal = (mode, user = null) => {
    setSelectedUser(user);
    setModalMode(mode);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedUser(null);
    setModalMode("");
    setIsModalOpen(false);
  };

  const handleDelete = async (user) => {
    try {
      await fetch(`${PORT}/users/${user.id}`, { method: "DELETE" });
      fetchUsers();
      setMessage("Cliente eliminado correctamente");
      setMessageType("success");
    } catch (err) {
      console.error("Error al eliminar usuario:", err);
      setMessage("Error al eliminar cliente");
      setMessageType("error");
    }
  };

  const handleAddOrEdit = async (data) => {
    const body = {
      email: data.email,
      first_name: data.name.split(" ")[0],
      last_name_1: data.name.split(" ")[1] || "",
      last_name_2: data.name.split(" ")[2] || "",
      phone: data.phone,
      password: data.password,
      user_type: "cliente",
      active: data.status === "activo" ? 1 : 0
    };

    if (data.password) {
      body.password = data.password;
    }

    try {
      if (modalMode === "add") {
        await fetch(`${PORT}/users`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body)
        });
        setMessage("Cliente añadido correctamente");
        setMessageType("success");
      } else if (modalMode === "edit") {
        await fetch(`${PORT}/users/${selectedUser.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body)
        });
        setMessage("Cliente modificado correctamente");
        setMessageType("success");
      }

      await fetchUsers();
    } catch (err) {
      console.error("Error al guardar usuario:", err);
      throw err;
    }
  };

  // Lógica de paginación
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(users.length / usersPerPage);

  if (loading) return <LoadingPage />;

  return (
    <div className="clients-page">
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
      <div className="clients-dashboard">
        <SideNav sections={sections} />
        <main className="clients-dashboard-content">
          <div className="clients-content-wrapper">
            <UsersPage
              title="Clientes"
              users={currentUsers}
              onView={(user) => openModal("view", user)}
              onEdit={(user) => openModal("edit", user)}
              onDelete={(user) => openModal("delete", user)}
              onAdd={() => openModal("add")}
            />
            {totalPages > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            )}
          </div>
        </main>
      </div>

      <UserModal
        isOpen={isModalOpen}
        user={selectedUser}
        mode={modalMode}
        onClose={closeModal}
        onDelete={handleDelete}
        onSubmit={handleAddOrEdit}
      />
    </div>
  );
};

export default Clients;
