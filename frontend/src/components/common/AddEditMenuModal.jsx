import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import AlertMessage from "./AlertMessage.jsx";
import "../../style/AddEditRoomModal.css";
import "../../style/add-edit-menu-modal.css";

const DEFAULT_ROUTE = "http://localhost:1522";

function AddEditMenuModal({
    menu = null,
    isModalOpen,
    onClose,
    onSuccess,
    existingImagePath = null,
    isAdd = false
  }) {
  const { register, handleSubmit, formState: { errors, isValid } } = useForm({ mode: "onChange" });

  const [products, setProducts] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [imageFile, setImageFile] = useState(null);
  const [secondaryFiles, setSecondaryFiles] = useState([]);
  const [primaryImageName, setPrimaryImageName] = useState("");
  const [primaryImageExists, setPrimaryImageExist] = useState(false);
  const [showImageUploadSuccess, setShowImageUploadSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showUpdateSuccess, setShowUpdateSuccess] = useState(false);

  // Obtener todas imagenes de los menús
  useEffect(() => {
    if (!isAdd && menu && menu.MENU_ID) {
      fetch(`${DEFAULT_ROUTE}/menus/${menu.MENU_ID}/images`)
        .then(res => res.json())
        .then(data => {
          const images = Array.isArray(data) ? data : data.images || [];
          const primaryImage = images.find(img => img.id === "main");
  
          if (primaryImage) {
            setPrimaryImageName(primaryImage.path);
            setPrimaryImageExist(true);
          } else {
            setPrimaryImageName("");
          }
        })
      .catch(err => console.error("Error cargando imágenes", err));
    }
  }, [menu?.MENU_ID, isAdd]);

  // Obtener todos los productos existentes
  useEffect(() => {
    fetch(`${DEFAULT_ROUTE}/products/`)
      .then(res => res.json())
      .then(data => setProducts(data))
      .catch(() => {
        setErrorMessage("Error al cargar productos");
        setShowError(true);
      });
  }, []);

  // Setear lista de producto seleccionados para el modal de editar
  useEffect(() => {
    if (!isAdd && menu && Array.isArray(menu.PRODUCTS)) {
      // Mapear los productos para cambiar NAME por name
      const mappedProducts = menu.PRODUCTS.map(prod => ({
        ...prod,
        name: prod.NAME || prod.name,
        id: prod.PRODUCT_ID || prod.id,
      }));
      setSelectedProducts(mappedProducts);
    }
  }, [menu, isAdd]);

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

  const handleDeletePrimaryImage = async () => {
    console.log(`${DEFAULT_ROUTE}/menus/${menu.MENU_ID}/delete-primary-image`);
    if (imageFile) {
      setImageFile(null);
      setPrimaryImageName("");
      
    } else if (primaryImageExists) {
      try {
        const res = await fetch(`${DEFAULT_ROUTE}/menus/${menu.MENU_ID}/delete-primary-image`, { method: 'DELETE' });
        if (res.ok) {
          setPrimaryImageName("");
          setImageFile(null);
          setErrorMessage("");
        } else {
          throw new Error("No se pudo eliminar la imagen principal");
        }
      } catch (err) {
        console.error(err);
        setErrorMessage("Error al eliminar la imagen principal");
        setShowError(true);
      }
    }
  };

  const onSubmit = async (data) => {
    let imagePath = existingImagePath;
    let isEncrypted = false;

    if (primaryImageName === "") {
      imagePath = null;
      isEncrypted = true;
    }

    if (imageFile) {
      const formData = new FormData();
      formData.append("image", imageFile);

      try {
        const res = await fetch(`${DEFAULT_ROUTE}/menus/upload-primary-image`, {
          method: "POST",
          body: formData,
        });

        if (!res.ok) throw new Error("Error al subir imagen principal");

        const imageData = await res.json();
        imagePath = imageData.imagePath;
        setShowImageUploadSuccess(true);
        isEncrypted = true;
      } catch {
        setErrorMessage("Error al subir imagen principal");
        setShowError(true);
        return;
      }
    }


    const menuData = {
      name: data.name,
      description: data.description,
      type: data.type,
      available: data.available ? 1 : 0,
      products: selectedProducts.map(p => p.ID || p.id),
      imagePath: imagePath,
      isEncrypted: isEncrypted
    };

    try {
      const res = await fetch(`${DEFAULT_ROUTE}/menus/${isAdd ? '' : menu.MENU_ID}`, {
        method: isAdd ? 'POST' : 'PUT',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(menuData),
      });

      if (!res.ok) {
        const errorData = await res.json();
        setErrorMessage(errorData.message || 'Error al guardar el menú');
        setShowError(true);
        return;
      }

      const responseData = await res.json();

      // Subir imágenes secundarias
      if (secondaryFiles.length > 0 && responseData.menu_id) {
        for (const file of secondaryFiles) {
          const formData = new FormData();
          formData.append('image', file);
          formData.append('menuId', responseData.menu_id);

          try {
            await fetch(`${DEFAULT_ROUTE}/menus/upload-secondary-image`, {
              method: 'POST',
              body: formData,
            });
          } catch (err) {
            console.error('Error subiendo imagen secundaria:', err);
          }
        }
      }

      if (typeof onSuccess === 'function') onSuccess();
    } catch {
      setErrorMessage("Error al guardar menú");
      setShowError(true);
    }

    onClose();
  };

  return isModalOpen ? (
    <div className="add-edit-modal" onClick={onClose}>
      <div className="room-modal-content" onClick={(e) => e.stopPropagation()}>
        {showUpdateSuccess && (
          <AlertMessage
            message="Menú actualizado con éxito"
            type="alert-floating"
            onClose={() => setShowUpdateSuccess(false)}
            duration={3000}
            className="success"
          />
        )}
        {showImageUploadSuccess && (
          <AlertMessage
            message="Imagen subida con éxito"
            type="alert-floating"
            onClose={() => setShowImageUploadSuccess(false)}
            duration={3000}
            className="success"
          />
        )}
        {showError && (
          <AlertMessage
            message={errorMessage}
            type="alert-floating"
            onClose={() => setShowError(false)}
            className="error"
          />
        )}

        <button className="room-modal-close" onClick={onClose}>×</button>
        <h2>Agregar Menú</h2>

        <p>Los campos marcados con <span style={{ color: "red" }}>*</span> son obligatorios</p>

        <form onSubmit={handleSubmit(onSubmit)} className="room-modal-form">
          <label>Nombre <span style={{ color: "red" }}>*</span></label>
          <input
            type="text"
            className="input"
            defaultValue={menu && !isAdd ? menu.NAME : ""}
            {...register("name", { required: "Nombre requerido" })}
          />
          {errors.name && <span className="error">{errors.name.message}</span>}

          <label>Descripción <span style={{ color: "red" }}>*</span></label>
          <input
            type="text"
            className="input"
            defaultValue={menu && !isAdd ? menu.DESCRIPTION : ""}
            {...register("description", { required: "Descripción requerida" })}
          />
          {errors.description && <span className="error">{errors.description.message}</span>}

          <label>Tipo de menú <span style={{ color: "red" }}>*</span></label>
          <input
            type="text"
            className="input"
            defaultValue={menu && !isAdd ? menu.TYPE : ""}
            {...register("type", { required: "Tipo requerido" })}
          />
          {errors.type && <span className="error">{errors.type.message}</span>}

          <label>Productos <span style={{ color: "red" }}>*</span></label>
          <div className="input-add-container">
            <input id="product-input" type="text" className="input" placeholder="Buscar producto..." />
            <button type="button" onClick={handleAddProduct} className="input-add-button">Agregar</button>
          </div>

          {selectedProducts.length > 0 && (
            <div className="tag-container">
              {selectedProducts.map((p) => (
                <div key={p.id} className="tag">
                  {p.name}
                  <button type="button" onClick={() => handleRemoveProduct(p)}>×</button>
                </div>
              ))}
            </div>
          )}

          <div className="available-checkbox">
            <label>
              Disponible
              <input
                type="checkbox"
                defaultChecked={menu && !isAdd ? menu.AVAILABLE === 1 : false}
                {...register("available")}
              />
            </label>
          </div>

          <label htmlFor="menu-image" className="upload-image-button">Subir imagen principal</label>
          <input id="menu-image" type="file" accept="image/*" onChange={handleImageChange} style={{ display: "none" }} />
          {primaryImageName && (
            <div className="image-name" style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginTop: "0.5rem" }}>
              Imagen seleccionada: {primaryImageName}
              <button
                type="button"
                className="delete-image-button"
                onClick={() => {
                  handleDeletePrimaryImage();
                }}
              >
                ✕
              </button>
            </div>
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
