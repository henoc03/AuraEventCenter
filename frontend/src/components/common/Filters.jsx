import React from "react";

/**
 * Filtro reutilizable para cualquier tipo de elemento.
 * Props:
 * - elements: array de elementos a filtrar
 * - typeField: string, nombre del campo para filtrar por tipo
 * - searchField: string, nombre del campo para búsqueda por texto
 * - sortField: string, nombre del campo para ordenar
 * - selectedIds: array de ids seleccionados (opcional, para priorizar)
 * - filterType: valor actual del filtro de tipo
 * - setFilterType: setter para filtro de tipo
 * - searchTerm: valor actual del input de búsqueda
 * - setSearchTerm: setter para búsqueda
 * - sortOrder: 'asc' | 'desc'
 * - setSortOrder: setter para orden
 */
function Filters({
  elements = [],
  typeField = "type",
  searchField = "name",
  sortField = "price",
  selectedIds = [],
  filterType = "todos",
  setFilterType = () => {},
  searchTerm = "",
  setSearchTerm = () => {},
  sortOrder = "asc",
  setSortOrder = () => {}
}) {
  // Tipos únicos
  const uniqueTypes = [...new Set(elements.map((el) => el[typeField]))];

  // Filtrado y ordenamiento
  const filteredAndSorted = elements
    .filter((el) => {
      const matchesSearch = (el[searchField] || "").toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = filterType === "todos" || (el[typeField] || "").toLowerCase() === filterType.toLowerCase();
      return matchesSearch && matchesType;
    })
    .sort((a, b) => sortOrder === "asc" ? a[sortField] - b[sortField] : b[sortField] - a[sortField]);

  // Priorizar seleccionados si se provee selectedIds
  const prioritized = selectedIds && selectedIds.length > 0
    ? [...filteredAndSorted].sort((a, b) => {
        const aSel = selectedIds.includes(a.id) ? 0 : 1;
        const bSel = selectedIds.includes(b.id) ? 0 : 1;
        return aSel - bSel;
      })
    : filteredAndSorted;

  return (
    <div className="edit-booking-filters">
      <div className="edit-booking-search-input">
        <label htmlFor="search">Buscar: </label>
        <input
          id="search"
          type="text"
          placeholder={`Buscar por ${searchField}...`}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="filter-input"
        />
      </div>

      <div className="edit-booking-filter-input">
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
              {type && type.charAt(0).toUpperCase() + type.slice(1)}
            </option>
          ))}
        </select>
      </div>
      
      <div className="edit-booking-sort-input">
        <label htmlFor="sort">Ordenar: </label>
        <select
          id="sort"
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
          className="filter-select"
        >
          <option value="asc">{sortField}: menor a mayor</option>
          <option value="desc">{sortField}: mayor a menor</option>
        </select>
      </div>
    </div>
  );
}

export default Filters;