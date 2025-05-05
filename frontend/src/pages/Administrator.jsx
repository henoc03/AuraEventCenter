import React, { useState } from "react";
import UsersPage from "../components/sections/Users";
import SideNav from "../components/common/SideNav";
import Header from "../components/common/Header";
import UserModal from "../components/common/UserModal";

import "../style/admin-users.css";


const Administrators = ({ sections }) => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState(""); // 'view', 'edit', 'delete', 'add'

  const [users, setUsers] = useState([
    { name: "Daniel Vega Vargas", email: "danielvega@gmail.com", status: "activo", phone: 88888888, image: "/default-image.jpg"},
    { name: "Tomas Castro Rojas", email: "tomascastro@gmail.com", status: "inactivo", phone: 22222222, image: "/default-image.jpg"  },
  ]);

  const openModal = (mode, user = null) => {
    setSelectedUser(user);
    setModalMode(mode);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedUser(null);
    setIsModalOpen(false);
    setModalMode("");
  };

  const handleDelete = (userToDelete) => {
    setUsers((prevUsers) =>
      prevUsers.filter((u) => u.email !== userToDelete.email)
    );
  };
  
  const handleAddOrEdit = (data) => {
    if (modalMode === "add") {
      const newUser = {
        ...data,
        status: "activo", 
      };
      setUsers((prevUsers) => [...prevUsers, newUser]);
    } else if (modalMode === "edit") {
      setUsers((prevUsers) =>
        prevUsers.map((u) =>
          u.email === selectedUser.email ? { ...u, ...data } : u
        )
      );
    }
  
    closeModal();
  };

  return (
    <div className="clients-page">
      <Header />
      <div className="clients-dashboard">
        <SideNav sections={sections} />
        <main className="clients-dashboard-content">
          <div className="clients-content-wrapper">
          <UsersPage
            title="Administradores"
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

export default Administrators;
