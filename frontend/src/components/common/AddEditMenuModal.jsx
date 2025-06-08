import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import AlertMessage from "./AlertMessage.jsx";
import "../../style/AddEditRoomModal.css";
import "../../style/add-edit-menu-modal.css";

const DEFAULT_ROUTE = "http://localhost:1522";

function AddEditMenuModal({ isModalOpen, onClose, onSuccess }) {
  const { register, handleSubmit, formState: { errors, isValid } } = useForm({ mode: "onChange" });

  const [products, setProducts] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [imageFile, setImageFile] = useState(null);
  const [primaryImageName, setPrimaryImageName] = useState("");
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    fetch(`${DEFAULT_ROUTE}/products/`)
      .then(res => res.json())
      .then(data => setProducts(data))
      .catch(() => {
        setErrorMessage("Error al cargar productos");
        setShowError(true);
      });
  }, []);

  const handleAddProduct = () => {
    const input = document.getElementById("product-input");
    const searchValue = input?.value?.trim().toLowerCase();

    if (!searchValue) return alert("Escriba un nombre válido");

    const found = products.find(
      p => p.name && p.name.toLowerCase() === searchValue
    );

    if (found && !selectedProducts.some(p => p.id === found.id)) {
      setSelectedProducts(prev => [...prev, found]);
    } else {
      alert("Producto no encontrado o ya agregado");
    }

    input.value = "";
  };

  const handleRemoveProduct = (productToRemove) => {
    setSelectedProducts(prev => prev.filter(p => p !== productToRemove));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setPrimaryImageName(file.name);
    }
  };

  const onSubmit = async (data) => {
    let imagePath = null;

    if (imageFile) {
      const formData = new FormData();
      formData.append("image", imageFile);
      try {
        const res = await fetch(`${DEFAULT_ROUTE}/menus/upload-image`, {
          method: "POST",
          body: formData,
        });
        const result = await res.json();
        imagePath = result.imagePath;
      } catch {
        setErrorMessage("Error al subir imagen");
        setShowError(true);
        return;
      }
    }

    const menuData = {
      name: data.name,
      description: data.description,
      type: data.type,
      price: parseFloat(data.price),
      available: data.available,
      products: selectedProducts.map(p => p.ID || p.id),
      imagePath,
    };

    try {
      const res = await fetch(`${DEFAULT_ROUTE}/menus/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(menuData),
      });
      if (!res.ok) throw new Error();
      if (onSuccess) onSuccess();
      onClose();
    } catch {
      setErrorMessage("Error al guardar menú");
      setShowError(true);
    }
  };

  return isModalOpen ? (
    <div className="add-edit-modal" onClick={onClose}>
      <div className="room-modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="room-modal-close" onClick={onClose}>×</button>
        <h2>Agregar Menú</h2>

				<p>Los campos marcados con <span style={{ color: "red" }}>*</span> son obligatorios</p>

        {showError && (
          <AlertMessage
            message={errorMessage}
            type="alert-floating"
            onClose={() => setShowError(false)}
            className="error"
          />
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="room-modal-form">
          <label>Nombre <span style={{ color: "red" }}>*</span></label>
          <input type="text" className="input" {...register("name", { required: "Nombre requerido" })} />
          {errors.name && <span className="error">{errors.name.message}</span>}

          <label>Descripción <span style={{ color: "red" }}>*</span></label>
          <input type="text" className="input" {...register("description", { required: "Descripción requerida" })} />
          {errors.description && <span className="error">{errors.description.message}</span>}

          <label>Tipo de menú <span style={{ color: "red" }}>*</span></label>
          <input type="text" className="input"{...register("type", { required: "Tipo requerido" })}/>
          {errors.type && <span className="error">{errors.type.message}</span>}

          <label>Precio Unitario <span style={{ color: "red" }}>*</span></label>
          <input type="text" className="input" {...register("price", {
            required: "Precio requerido",
            pattern: { value: /^[0-9]+(\.[0-9]{1,2})?$/, message: "Debe ser un número válido" }
          })} />
          {errors.price && <span className="error">{errors.price.message}</span>}

          <label>Productos <span style={{ color: "red" }}>*</span></label>
          <div className="input-add-container">
            <input id="product-input" type="text" className="input" placeholder="Buscar producto..." />
            <button type="button" onClick={handleAddProduct} className="input-add-button">Agregar</button>
          </div>

          {selectedProducts.length > 0 && (
						<div className="tag-container">
							{selectedProducts.map((p) => (
								<div key={p.ID} className="tag">
									{p.name}
									<button type="button" onClick={() => handleRemoveProduct(p)}>×</button>
								</div>
							))}
						</div>
					)}
					<div className="available-checkbox">
						<label>
							Disponible
							<input type="checkbox" {...register("available")} />
						</label>
					</div>
          <label htmlFor="menu-image" className="upload-image-button">Subir imagen principal</label>
          <input id="menu-image" type="file" accept="image/*" onChange={handleImageChange} style={{ display: "none" }} />
          {primaryImageName && (
            <p className="image-name">Imagen seleccionada: {primaryImageName}</p>
          )}

          <div className="save-cancel-container">
            <button type="submit" className={`save-button ${isValid ? "active" : ""}`} disabled={!isValid}>Guardar</button>
            <button type="button" className="cancel-button" onClick={onClose}>Cancelar</button>
          </div>
        </form>
      </div>
    </div>
  ) : null;
}

export default AddEditMenuModal;
