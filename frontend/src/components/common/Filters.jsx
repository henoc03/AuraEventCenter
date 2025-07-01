import React, { useState, useEffect, useMemo } from "react";
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

  const filteredAndSortedElements = useMemo(() => {
    return allElements
      .filter((element) => {
        const matchesSearch = getName(element)?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesType =
          filterType === "todos" || getType(element)?.toLowerCase() === filterType.toLowerCase();
        return getId(element) && matchesSearch && matchesType;
      })
      .sort((a, b) =>
        sortOrder === "asc" ? getPrice(a) - getPrice(b) : getPrice(b) - getPrice(a)
      );
  }, [allElements, searchTerm, filterType, getName, getType, getId, getPrice, sortOrder]);

  const prioritizedElements = useMemo(() => {
    return [...filteredAndSortedElements].sort((a, b) => {
      const aSelected = selectedElements.includes(getId(a)) ? 0 : 1;
      const bSelected = selectedElements.includes(getId(b)) ? 0 : 1;
      return aSelected - bSelected;
    });
  }, [filteredAndSortedElements, selectedElements, getId]);

  useEffect(() => {
    const indexOfLastElement = currentPage * elementsPerPage;
    const indexOfFirstElement = indexOfLastElement - elementsPerPage;
    const newCurrentElements = prioritizedElements.slice(indexOfFirstElement, indexOfLastElement);
    const newTotalPages = Math.ceil(filteredAndSortedElements.length / elementsPerPage);

    setCurrentElements((prev) => {
      const same = JSON.stringify(prev) === JSON.stringify(newCurrentElements);
      return same ? prev : newCurrentElements;
    });

    setTotalPages((prev) => (prev === newTotalPages ? prev : newTotalPages));
  }, [
    currentPage,
    elementsPerPage,
    prioritizedElements,
    filteredAndSortedElements.length,
    setCurrentElements,
    setTotalPages
  ]);

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