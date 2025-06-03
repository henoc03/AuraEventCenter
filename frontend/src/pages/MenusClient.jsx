import React, {useEffect, useState, useRef} from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
// import "../style/menus-client.css";
import Footer from "../components/common/Footer";
import Navigation from '../components/common/Navigation';
import LoadingPage from "../components/common/LoadingPage";

const DEFAULT_ROUTE = "http://localhost:1522";

// Componente de la pagina de menus para el cliente
function MenusClient() {
  const [menus, setMenus] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMenu, setSelectedMenu] = useState(null);
  const expandedMenuRef = useRef(null);

  // Estados para los filtros y búsqueda
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("todos");
  const [sortOrder, setSortOrder] = useState("asc");

  useEffect(() => {
    AOS.init();
  }, []);

  useEffect(() => {
    getMenus();
  }, []);

  // Función pra traer los menús de la base de datos
  const getMenus = async () => {
    try {
      // Solicitud de todos los menus al backend
      const res = await fetch(`${DEFAULT_ROUTE}/menus/`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      if (!res.ok) {
        const errorData = await res.json();
        alert(errorData.message || "Error al obtener los menus");
        return;
      }

      // Almacenar respuesta con los menus
      const menusData = await res.json();
      setMenus(menusData);
    } catch (error) {
      console.error("Error al obtener menus:", error);
      alert("Ocurrió un error al obtener los menus.");
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
    .sort((a, b) => {
      return sortOrder === "asc" ? a.PRICE - b.PRICE : b.PRICE - a.PRICE;
    });

  if (loading) return <LoadingPage />;

  return (
    <div className="menus-client-page">
      <head className="menus-navigation-container">
        <Navigation/>
      </head>

      <main className="menus-client-main">
        <h2>Conoce nuestros menús</h2>

        {/* Filtros */}
        <div className="filters">
          <label htmlFor="search">Buscar: </label>
          <input
            id="search"
            type="text"
            placeholder="Buscar por nombre..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="filter-input"
          />
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

        {/* Menu expandido */}
        {selectedMenu && (
          <div className="menu-card expanded" ref={expandedMenuRef}>
            <ExpandedMenu
              menu={menus.find((menu) => menu.MENU_ID === selectedMenu)}
              onClose={() => setSelectedMenu(null)}
            />
          </div>
        )}

        {/* Menus compactados */}
        <div className="menu-grid">
          {filteredAndSortedMenus.map((menu) => (
            <div
              key={menu.MENU_ID}
              className="menu-card"
              onClick={() => setSelectedMenu(menu.MENU_ID)}
            >
              <CompactMenu menu={menu} />
            </div>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default MenusClient;