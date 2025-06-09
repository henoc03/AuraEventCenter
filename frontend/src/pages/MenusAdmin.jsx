import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

import Header from "../components/common/Header.jsx";
import SideNav from "../components/common/SideNav.jsx";
import MenuAdminCard from "../components/common/MenuAdminCard.jsx";
import AddEditMenuModal from "../components/common/AddEditMenuModal.jsx";
import AlertMessage from "../components/common/AlertMessage.jsx";
import LoadingPage from "../components/common/LoadingPage.jsx";

import "../style/menus-admin.css";

const DEFAULT_ROUTE = "http://localhost:1522";

// Componente para la página de servicios del administrador
function MenusAdmin({ sections }) {
  const [isAddEditOpen, setIsAddEditOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [menus, setMenus] = useState([]);
  const [showSuccess, setShowSuccess] = useState(false);

  // Estados para información de usuario
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [lastname, setLastname] = useState("");
  const [role, setRole] = useState("");

  // Estados para los filtros y búsqueda
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("todos");
  const [sortOrder, setSortOrder] = useState("asc");

  const navigate = useNavigate();

  useEffect(() => {
    getSetUserInfo();
    getMenus();
  }, []);

  // Obtener información de usuario para el header
  const getSetUserInfo = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      // Obtener token de sesión
      const sessionUserData = jwtDecode(token);
      const res = await fetch(`${DEFAULT_ROUTE}/users/${sessionUserData.id}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      if (!res.ok) {
        const errorData = await res.json();
        alert(errorData.message || "Error al obtener la información del usuario");
        return;
      }

      // Almacenar datos de usuario
      const userData = await res.json();
      setName(userData.FIRST_NAME);
      setEmail(userData.EMAIL);
      setLastname(userData.LAST_NAME_1);
      setRole(userData.USER_TYPE);

    } catch {
      alert("Ocurrió un error al obtener la información de usuario.");
      navigate("/login");
    }
  };

  // Obtener información de menús
  const getMenus = async () => {
    try {
      const res = await fetch(`${DEFAULT_ROUTE}/menus/`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      if (!res.ok) {
        const errorData = await res.json();
        alert(errorData.message || "Error al obtener los menús");
        return;
      }

      const menusData = await res.json();
      setMenus(menusData);
    } catch {
      alert("Ocurrió un error al obtener los servicios menús.");
      navigate("/login");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingPage />;

  const uniqueTypes = [...new Set(menus.map((menu) => menu.TYPE))];

  const filteredAndSortedMenus = menus
  .filter((menu) => {
    const matchesSearch = menu.NAME.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === "todos" || menu.TYPE.toLowerCase() === filterType.toLowerCase();
    return matchesSearch && matchesType;
  })
  .sort((a, b) => {
    return sortOrder === "asc" ? a.PRICE - b.PRICE : b.PRICE - a.PRICE;
  });

  return (
    <div className="menus-admin-page">
      {showSuccess && (
        <AlertMessage
          message="Información actualizada con éxito"
          type="alert-floating"
          onClose={() => setShowSuccess(false)}
          className="success"
        />
      )}

      <Header
        name={name}
        lastname={lastname}
        role={role}
        email={email}
      />

      <div className={`menus-admin-container ${isAddEditOpen ? "modal-open" : ""}`}>
        <SideNav className= "menus-admin-nav" sections={sections} />

        <main className="menus-admin-main">
          <div className="title-add-menu-cont">
            <h1>Menús</h1>
            <button
              className="add-menu-button"
              onClick={() => setIsAddEditOpen(true)}
            >
              Agregar
            </button>
          </div>

          {/* Filtros */}
          <div className="filters">
            <div className="menu-search-input">
              <label htmlFor="search">Buscar: </label>
              <input
                id="search"
                type="text"
                placeholder="Buscar por nombre..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="filter-input"
              />
            </div>

            <div className="menu-filter-input">
              <label htmlFor="active">Filtrar: </label>
              <select
                id="active"
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="filter-select"
              >
                <option value="todos">Todos los tipos</option>
                {uniqueTypes.map((type) => (
                <option key={type} value={type}>
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                </option>
                ))}
              </select>
            </div>

            <div className="menu-sort-input">
              <label htmlFor="sort">Ordenar: </label>
              <select
                id="sort"
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
                className="filter-select"
              >
                <option value="asc">Precio: menor a mayor</option>
                <option value="desc">Precio: mayor a menor</option>
              </select>
            </div>
          </div>

          <div className="menus-admin-cards">
            {filteredAndSortedMenus.map((menu) => (
              <MenuAdminCard className="menu-admin-card" menu={menu} />
            ))}
          </div>
        </main>
      </div>

      {isAddEditOpen && (
        <AddEditMenuModal
          isModalOpen={true}
          onClose={() => setIsAddEditOpen(false)}
          onSuccess={() => {
            getMenus();
            setShowSuccess(true);
          }}
        />
      )}
    </div>
  );
}

export default MenusAdmin;
