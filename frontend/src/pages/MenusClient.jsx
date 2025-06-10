import React, { useEffect, useState, useRef } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import "../style/menus-client.css";
import Footer from "../components/common/Footer";
import Navigation from '../components/common/Navigation';
import LoadingPage from "../components/common/LoadingPage";
import CompactMenu from "../components/common/CompactMenu";
import ExpandedMenu from "../components/common/ExpandedMenu";
import Hero from "../components/sections/ClientDefaultHero"
import heroImage from "../assets/images/menus_hero.jpg"
import Pagination from "../components/common/Pagination";

const DEFAULT_ROUTE = "http://localhost:1522";

function MenusClient() {
  const [menus, setMenus] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMenu, setSelectedMenu] = useState(null);
  const expandedMenuRef = useRef(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("todos");
  const [sortOrder, setSortOrder] = useState("asc");

  // Paginación
  const [currentPage, setCurrentPage] = useState(1);
  const menusPerPage = 4;

  useEffect(() => {
    AOS.init();
  }, []);

  useEffect(() => {
    getMenus();
  }, []);

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
    } catch (error) {
      console.error("Error al obtener menús:", error);
      alert("Ocurrió un error al obtener los menús.");
    } finally {
      setLoading(false);
    }
  };

  const uniqueTypes = [...new Set(menus.map((menu) => menu.TYPE))];

  const filteredAndSortedMenus = menus
    .filter((menu) => {
      const matchesSearch = menu.NAME.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = filterType === "todos" || menu.TYPE.toLowerCase() === filterType.toLowerCase();
      return menu.MENU_ID !== selectedMenu && matchesSearch && matchesType;
    })
    .sort((a, b) => sortOrder === "asc" ? a.PRICE - b.PRICE : b.PRICE - a.PRICE);

  // Paginación
  const indexOfLastMenu = currentPage * menusPerPage;
  const indexOfFirstMenu = indexOfLastMenu - menusPerPage;
  const currentMenus = filteredAndSortedMenus.slice(indexOfFirstMenu, indexOfLastMenu);
  const totalPages = Math.ceil(filteredAndSortedMenus.length / menusPerPage);

  if (loading) return <LoadingPage />;

  return (
    <div className="menus-client-page">
      <Hero
        subtitle="Descubre nuestros sabores"
        title="Menús deliciosos para cada ocasión"
        message="Explora nuestra variedad de menús cuidadosamente seleccionados para satisfacer todos los gustos y necesidades. Encuentra la opción perfecta para tu evento y sorprende a tus invitados con una experiencia culinaria inolvidable."
        imgSrc={heroImage}
      />
      <div className="menus-navigation-container">
        <Navigation />
      </div>

      <main className="menus-client-main">
        <button type="button" onClick={() => window.history.back()}>
          <i className="bi bi-arrow-left"></i> Regresar
        </button>
        <h2>Conoce nuestros menús</h2>

        {/* Filtros */}
        <div className="menus-client-filters">
          <div className="menus-search-input">
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

          <div className="menus-filter-input">
            <label htmlFor="status">Filtrar: </label>
            <select
              id="status"
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
          
          <div className="menus-sort-input">
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

        <div className="client-menus-container">
          {menus.length === 0 && <p>No hay menús disponibles</p>}

          {/* Menú expandido */}
          {selectedMenu && (
            <div className="menu-client-card expanded" ref={expandedMenuRef}>
              <ExpandedMenu
                menu={menus.find((menu) => menu.MENU_ID === selectedMenu)}
                onClose={() => setSelectedMenu(null)}
              />
            </div>
          )}

          {/* Menús compactos */}
          <div className="menu-grid">
            {currentMenus.map((menu) => (
              <div
                key={menu.MENU_ID}
                className="menu-client-card"
                onClick={() => setSelectedMenu(menu.MENU_ID)}
              >
                <CompactMenu menu={menu} />
              </div>
            ))}
          </div>

          {/* Paginación */}
          {totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default MenusClient;
