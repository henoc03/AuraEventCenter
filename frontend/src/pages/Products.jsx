import React, { useEffect, useState } from "react";
import Header from "../components/common/Header";
import SideNav from "../components/common/SideNav";
import AlertMessage from "../components/common/AlertMessage";
import LoadingPage from "../components/common/LoadingPage";
import ProductCard from "../components/common/ProductCard";
import ProductModal from "../components/common/ProductModal";

import "../style/admin-products.css";

const PORT = "http://localhost:1522";

const Products = ({ sections }) => {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("");
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("todos");
  const [sortOrder, setSortOrder] = useState("asc");
  const uniqueTypes = Array.from(new Set(products.map(p => p.type).filter(Boolean)));



  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${PORT}/products`);
      const data = await res.json();
      setProducts(data);
    } catch (err) {
      console.error("Error al obtener productos:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const openModal = (mode, product = null) => {
    setSelectedProduct(product);
    setModalMode(mode);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedProduct(null);
    setModalMode("");
    setIsModalOpen(false);
  };

  const handleDelete = async (product) => {
    try {
      await fetch(`${PORT}/products/${product.id}`, { method: "DELETE" });
      setMessage("Producto eliminado correctamente");
      setMessageType("success");
      fetchProducts();
    } catch (err) {
      console.error("Error al eliminar producto:", err);
      setMessage("Error al eliminar producto");
      setMessageType("error");
    }
  };

  const handleAddOrEdit = async (data) => {
    try {
      const method = modalMode === "edit" ? "PUT" : "POST";
      const url = modalMode === "edit" ? `${PORT}/products/${selectedProduct.id}` : `${PORT}/products`;

      await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });

      setMessage(modalMode === "edit" ? "Producto actualizado" : "Producto creado");
      setMessageType("success");
      fetchProducts();
    } catch (err) {
      console.error("Error al guardar producto:", err);
      setMessage("Error al guardar producto");
      setMessageType("error");
    }
  };

  const filteredProducts = products
    .filter((product) => {
      const matchesSearch =
        product.name.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesType =
      typeFilter === "todos" || product.type?.toLowerCase() === typeFilter;

    return matchesSearch && matchesType;

    })
    .sort((a, b) => {
      const nameA = a.name.toLowerCase();
      const nameB = b.name.toLowerCase();
      return sortOrder === "asc" ? nameA.localeCompare(nameB) : nameB.localeCompare(nameA);
    });

  if (loading) return <LoadingPage />;

  return (
    <div className="products-page">
      <AlertMessage
        message={message}
        type={messageType}
        onClose={() => setMessage('')}
        className="alert-floating"
      />
      <Header />
      <div className="products-dashboard">
        <SideNav sections={sections} />
        <main className="products-dashboard-content">
          <div className="products-content-wrapper">
            <section className="products-section">
            <div className="products-section-header">
            <h2 className="products-section-title">Productos</h2>
            <button className="btn products-section-add-button" onClick={() => openModal("add")}>Agregar Producto</button>
            </div>
            <div className="products-controls">
              <label htmlFor="search">Buscar: </label>
              <input
                id="search"
                type="text"
                placeholder="Buscar producto..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="products-search-input"
              />

              <label htmlFor="type">Filtrar:</label>
              <select
                id="type"
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="products-status-select"
              >
                <option value="todos">Todos</option>
                {uniqueTypes.map(type => (
                  <option key={type} value={type.toLowerCase()}>{type}</option>
                ))}
              </select>


              <label htmlFor="sort">Orden:</label>
              <select
                id="sort"
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
                className="products-sort-select"
              >
                <option value="asc">A-Z</option>
                <option value="desc">Z-A</option>
              </select>
            </div>

            <div className="products-grid">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onView={() => openModal("view", product)}
                  onEdit={() => openModal("edit", product)}
                  onDelete={() => openModal("delete", product)}
                />
              ))}
            </div>
            </section>
          </div>
        </main>
      </div>

      <ProductModal
        isOpen={isModalOpen}
        mode={modalMode}
        product={selectedProduct}
        onClose={closeModal}
        onDelete={handleDelete}
        onSubmit={handleAddOrEdit}
      />
    </div>
  );
};

export default Products;
