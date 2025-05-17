import React, { useEffect, useState } from "react";
import UsersPage from "../components/sections/Users";
import SideNav from "../components/common/SideNav";
import Header from "../components/common/Header";
import UserModal from "../components/common/UserModal";
import AlertMessage from '../components/common/AlertMessage';

import "../style/admin-users.css";

const PORT = "http://localhost:1522";

const Clients = ({ sections }) => {
const [selectedUser, setSelectedUser] = useState(null);
const [isModalOpen, setIsModalOpen] = useState(false);
const [modalMode, setModalMode] = useState("");
const [users, setUsers] = useState([]);
const [currentUser, setCurrentUser] = useState(null);
const [message, setMessage] = useState('');
const [messageType, setMessageType] = useState('');

useEffect(() => {
  const token = localStorage.getItem("token");
  if (token) {
    try {
      const decoded = JSON.parse(atob(token.split('.')[1]));
      const now = Date.now();

      if (
        decoded &&
        decoded.firstName &&
        decoded.lastName1 &&
        decoded.email &&
        decoded.userType &&
        decoded.exp &&
        now < decoded.exp * 1000
      )
       {
        setCurrentUser(decoded);
      } else {
        localStorage.removeItem("token");
        setCurrentUser(null);
      }
    } catch (err) {
      console.error("❌ Error decoding token:", err);
      localStorage.removeItem("token");
      setCurrentUser(null);
    }
  }
}, []);

  const fetchUsers = async () => {
    try {
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
      console.error("❌ Error al obtener usuarios:", err);
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
      console.error("❌ Error al eliminar usuario:", err);
      setMessage("❌ Error al eliminar cliente");
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
      console.error("❌ Error al guardar usuario:", err);
      throw err;
    }
  };

  return (
    <div className="clients-page">
      <AlertMessage
        message={message}
        type={messageType}
        onClose={() => setMessage('')}
        className="alert-floating"
      />
    <Header
      name={currentUser?.firstName}
      lastname={`${currentUser?.lastName1} ${currentUser?.lastName2 || ''}`}
      role={currentUser?.userType}
      email={currentUser?.email}
    />
      <div className="clients-dashboard">
        <SideNav sections={sections} />
        <main className="clients-dashboard-content">
          <div className="clients-content-wrapper">
            <UsersPage
              title="Clientes"
              users={users}
              onView={(user) => openModal("view", user)}
              onEdit={(user) => openModal("edit", user)}
              onDelete={(user) => openModal("delete", user)}
              onAdd={() => openModal("add")}
            />
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
