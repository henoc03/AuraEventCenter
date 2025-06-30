import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";

function Filters({
  allElements,
  selectedElements,
  currentPage,
  setCurrentPage,
  setCurrentElements,
  setTotalPages,
  getName = el => el.name,
  getType = el => el.type,
  getId = el => el.ID,
  getPrice = el => el.price,
  elementsPerPage = 4,
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("todos");
  const [sortOrder, setSortOrder] = useState("asc");

  // Tipos únicos
  const uniqueTypes = [...new Set(allElements.map(getType).filter(Boolean))];

  // Filtrado y ordenamiento
  const filteredAndSortedElements = allElements
    .filter((element) => {
      const matchesSearch = getName(element)?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = filterType === "todos" || getType(element)?.toLowerCase() === filterType.toLowerCase();
      return getId(element) && matchesSearch && matchesType;
    })
    .sort((a, b) => sortOrder === "asc" ? getPrice(a) - getPrice(b) : getPrice(b) - getPrice(a));

  // Priorizar seleccionados
  const prioritizedElements = [...filteredAndSortedElements].sort((a, b) => {
    const aSelected = selectedElements.includes(getId(a)) ? 0 : 1;
    const bSelected = selectedElements.includes(getId(b)) ? 0 : 1;
    return aSelected - bSelected;
  });

  // Paginación
  const insideCurrentPage = currentPage;
  const indexOfLastElement = insideCurrentPage * elementsPerPage;
  const indexOfFirstElement = indexOfLastElement - elementsPerPage;
  const currentElements = prioritizedElements.slice(indexOfFirstElement, indexOfLastElement);
  const totalPages = Math.ceil(filteredAndSortedElements.length / elementsPerPage);

  // Actualizar elementos actuales
  useEffect(() => {
    setCurrentElements(currentElements);
  }, [currentElements, setCurrentElements]);

  // Actualizar el numero de paginas
  useEffect(() => {
    setTotalPages(totalPages);
  }, [totalPages, setTotalPages]);

  // Actualizar el numero de paginas
  useEffect(() => {
    setCurrentPage(insideCurrentPage);
  }, [insideCurrentPage, setCurrentPage]);

  return (
    <div className="edit-booking-filters">
      <div className="edit-booking-search-input">
        <label htmlFor="search">Buscar: </label>
        <input
          id="search"
          type="text"
          placeholder="Buscar por nombre..."
          value={searchTerm}
          onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
          className="filter-input"
        />
      </div>

      <div className="edit-booking-filter-input">
        <label htmlFor="status">Filtrar: </label>
        <select
          id="status"
          value={filterType}
          onChange={(e) => { setFilterType(e.target.value); setCurrentPage(1); }}
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
      
      <div className="edit-booking-sort-input">
        <label htmlFor="sort">Ordenar: </label>
        <select
          id="sort"
          value={sortOrder}
          onChange={(e) => { setSortOrder(e.target.value); setCurrentPage(1); }}
          className="filter-select"
        >
          <option value="asc">Precio: menor a mayor</option>
          <option value="desc">Precio: mayor a menor</option>
        </select>
      </div>
    </div>
  );
}

Filters.propTypes = {
  allElements: PropTypes.array.isRequired,
  selectedElements: PropTypes.array.isRequired,
  currentPage: PropTypes.number.isRequired,
  setCurrentPage: PropTypes.func.isRequired,
  setCurrentElements: PropTypes.func.isRequired,
  setTotalPages: PropTypes.func.isRequired,
  getName: PropTypes.func,
  getType: PropTypes.func,
  getId: PropTypes.func,
  getPrice: PropTypes.func,
  elementsPerPage: PropTypes.number,
};

export default Filters;