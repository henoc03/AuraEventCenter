import React, { useState } from "react";
import UserCard from "../common/UserCard";
import "../../style/admin-users.css";

const UsersPage = ({ title, users, onView, onEdit, onDelete, onAdd }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("todos");
  const [sortOrder, setSortOrder] = useState("asc");

  const filteredUsers = users
    .filter((user) => {
      const matchesSearch =
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus =
        statusFilter === "todos" ||
        user.status.toLowerCase() === statusFilter;

      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      const nameA = a.name.toLowerCase();
      const nameB = b.name.toLowerCase();
      if (sortOrder === "asc") {
        return nameA.localeCompare(nameB);
      } else {
        return nameB.localeCompare(nameA);
      }
    });

  return (
    <section className="users-section">
      <div className="users-section-header">
        <h1 className="users-section-title">{title}</h1>
        <button className="btn users-section-add-button" onClick={onAdd}>Agregar</button>
      </div>

      <div className="users-section-search">
        <label htmlFor="search">Buscar: </label>
        <input
          id="search"
          type="text"
          placeholder="Buscar usuario por nombre o correo..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="users-search-input"
        />

        <label htmlFor="status">Filtrar:</label>
        <select
          id="status"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="users-status-select"
        >
          <option value="todos">Todos</option>
          <option value="activo">Activo</option>
          <option value="inactivo">Inactivo</option>
        </select>

        <label htmlFor="sort">Orden:</label>
        <select
          id="sort"
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
          className="users-sort-select"
        >
          <option value="asc">A-Z</option>
          <option value="desc">Z-A</option>
        </select>
      </div>

      <div className="users-section-grid">
        {filteredUsers.map((user) => (
          <UserCard
            key={user.email}
            user={user}
            onView={onView}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </div>
    </section>
  );
};

export default UsersPage;
