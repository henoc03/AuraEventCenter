import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import AlertMessage from "./AlertMessage.jsx";

import "../../style/AddEditRoomModal.css";

const DEFAULT_ROUTE = "http://localhost:1522";

function AddEditRoomModal({
  isModalOpen,
  onClose,
  onSuccess,
  id = "",
  name = "Ingrese el nombre aquí",
  type = "Ingrese la categoría aquí",
  price = "Ingrese el precio aquí",
  capacity = "Ingrese la capacidad aquí",
  description = "Ingrese la descripción aquí",
  existingImagePath = null,
  isAdd = false,
}) {
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const { register, handleSubmit, formState: { errors, isValid } } = useForm({ mode: 'onChange' });
  const [showCreateSuccess, setShowCreateSuccess] = useState(false);
  const [showUpdateSuccess, setShowUpdateSuccess] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [secondaryFiles, setSecondaryFiles] = useState([]);
  const [showImageUploadSuccess, setShowImageUploadSuccess] = useState(false);
  const [existingSecondaryImages, setExistingSecondaryImages] = useState([]);
  const [primaryImageName, setPrimaryImageName] = useState("");
  const [primaryImageExists, setPrimaryImageExist] = useState(false);
  const [active, setActive] = useState(1);

  
useEffect(() => {
  if (id && !isAdd) {
    fetch(`${DEFAULT_ROUTE}/zones/${id}/images`)
      .then(res => res.json())
      .then(data => {
        setActive(data.active);
        const images = Array.isArray(data) ? data : data.images || [];
        const primaryImage = images.find(img => img.id === "main");
        const secondaryImages = images.filter(img => img.id !== "main");

        if (primaryImage) {
          setPrimaryImageName(primaryImage.path);
          setPrimaryImageExist(true);
        } else {
          setPrimaryImageName("");
        }

        setExistingSecondaryImages(secondaryImages);
      })
      .catch(err => console.error("Error cargando imágenes", err));
  }
}, [id, isAdd]);




  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setPrimaryImageName(file.name);
    }
  };

const handleDeletePrimaryImage = async () => {
  console.log(`${DEFAULT_ROUTE}/zones/${id}/delete-primary-image`);
  if (imageFile) {
    setImageFile(null);
    setPrimaryImageName("");
  } else if (primaryImageExists) {
    try {
      const res = await fetch(`${DEFAULT_ROUTE}/zones/${id}/delete-primary-image`, { method: 'DELETE' });
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



  const handleDeleteSecondaryImage = async (imageId) => {
    
    try {
      const res = await fetch(`${DEFAULT_ROUTE}/zones/images/${imageId}`, {
        method: 'DELETE',
      });
      if (res.ok) {
         setExistingSecondaryImages(prev => prev.filter(img => img.id !== imageId));

      } else {
        throw new Error("No se pudo eliminar");
      }
    } catch (err) {
      console.error(err);
      setErrorMessage("Error al eliminar imagen secundaria");
      setShowError(true);
    }
  };

  const onSubmit = async (data) => {
    let encryptedImagePath = existingImagePath;

    // Subida imagen principal
    if (imageFile) {
      const formData = new FormData();
      formData.append('image', imageFile);

      try {
        const res = await fetch(`${DEFAULT_ROUTE}/zones/upload-primary-image`, {
          method: 'POST',
          body: formData,
        });

        if (!res.ok) throw new Error('Error al subir la imagen');

        const imageData = await res.json();
        encryptedImagePath = imageData.imagePath;
        setShowImageUploadSuccess(true);
      } catch (error) {
        console.error('Error subiendo imagen:', error);
        setErrorMessage("Error al subir imagen");
        setShowError(true);
        return;
      }
    }

    const zoneToSend = {
      name: data.name || name,
      type: data.type || type,
      price: data.price || price,
      capacity: data.capacity || capacity,
      description: data.description || description,
      event_center_id: 1,
      imagePath: encryptedImagePath,
      active:active
    };

    try {
      const res = await fetch(`${DEFAULT_ROUTE}/zones/${isAdd ? '' : id}`, {
        method: isAdd ? 'POST' : 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(zoneToSend),
      });

      if (!res.ok) {
        const errorData = await res.json();
        setErrorMessage(errorData.message || 'Error al guardar la zona');
        setShowError(true);
        return;
      }

      const responseData = await res.json();

      // Subir imágenes secundarias
      if (secondaryFiles.length > 0 && responseData.zone_id) {
        for (const file of secondaryFiles) {
          const formData = new FormData();
          formData.append('image', file);
          formData.append('zoneId', responseData.zone_id);

          try {
            await fetch(`${DEFAULT_ROUTE}/zones/upload-secondary-image`, {
              method: 'POST',
              body: formData,
            });
          } catch (err) {
            console.error('Error subiendo imagen secundaria:', err);
          }
        }
      }

      if (typeof onSuccess === 'function') onSuccess();

    } catch (error) {
      console.error("Error guardando la sala:", error);
      setErrorMessage("Error inesperado al guardar la sala");
      setShowError(true);
    }

    onClose();
  };

  const handleClose = () => {
    onClose();
  };


  return (
    <>
      {showCreateSuccess && (
        <AlertMessage message="Sala agregada con éxito" type="alert-floating" onClose={() => setShowCreateSuccess(false)} duration={3000} className="success" />
      )}
      {showUpdateSuccess && (
        <AlertMessage message="Sala actualizada con éxito" type="alert-floating" onClose={() => setShowUpdateSuccess(false)} duration={3000} className="success" />
      )}
      {showImageUploadSuccess && (
        <AlertMessage message="Imagen subida con éxito" type="alert-floating" onClose={() => setShowImageUploadSuccess(false)} duration={3000} className="success" />
      )}
      {showError && (
        <AlertMessage message={errorMessage} type="alert-floating" onClose={() => setShowError(false)} className="error" />
      )}

      {isModalOpen && (
        <div className="add-edit-modal" onClick={handleClose}>
          <div className="room-modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="room-modal-close" onClick={handleClose}>×</button>
             <h2>{isAdd ? "Agregar Sala" : "Editar Sala"}</h2>
            <p>Los campos marcados con <span style={{ color: "red" }}>*</span> son obligatorios</p>
            <form onSubmit={handleSubmit(onSubmit)} className="room-modal-form">
              <label>Nombre de la sala <span style={{ color: "red" }}>*</span></label>
              <input type="text" placeholder={name} className="input" {...register("name", { required: isAdd && "Nombre de sala requerido" })} />
              {errors.name && <span className="error">{errors.name.message}</span>}

              <label>Categoría <span style={{ color: "red" }}>*</span></label>
              <input type="text" placeholder={type} className="input" {...register("type")} />

              <label>Precio <span style={{ color: "red" }}>*</span></label>
              <input
                type="text"
                placeholder={price}
                className="input"
                {...register("price", {
                  required: isAdd && "Precio requerido",
                  pattern: { value: /^[0-9]+$/, message: "Solo se admiten números" }
                })}
              />
              {errors.price && <span className="error">{errors.price.message}</span>}

              <label>Capacidad <span style={{ color: "red" }}>*</span></label>
              <input
                type="text"
                placeholder={`${capacity} personas`}
                className="input"
                {...register("capacity", {
                  required: isAdd && "Capacidad requerida",
                  pattern: { value: /^[0-9]+$/, message: "Solo se admiten números" }
                })}
              />
              {errors.capacity && <span className="error">{errors.capacity.message}</span>}

              <label>Descripción <span style={{ color: "red" }}>*</span></label>
              <textarea type="text" placeholder={description} className="input" {...register("description", { required: isAdd && "Descripción requerida" ,validate: {
                    wordCount: (value) => {
                    const wordCount = value.trim().split(/\s+/).length;
                    if (wordCount < 0) return "La descripción debe tener al menos 50 palabras";
                    if (wordCount > 85) return "La descripción no debe superar las 85 palabras";
                    return true;
                  }
                  } })} />
              {errors.description && <span className="error">{errors.description.message}</span>}
              <label className="form-label">
              Estado:
              <input
                type="checkbox"
                checked={active === 1}
                onChange={(e) => setActive(e.target.checked ? 1 : 0)}
                className="form-checkbox"
                
              />
              
            </label>

              {/* Imagen principal */}
              <label htmlFor="room-image" className="upload-image-button">Subir imagen principal</label>
              <input id="room-image" type="file" accept="image/*" onChange={handleImageChange} style={{ display: "none" }} />
              {primaryImageName && (
                <div className="image-name" style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  Imagen principal seleccionada: {primaryImageName}
                  <button
                    type="button"
                    className="delete-image-button"
                    onClick={handleDeletePrimaryImage}
                  >
                    ✕
                  </button>
                </div>
              )}


              {/* Imágenes secundarias */}
              <label htmlFor="secondary-images" className="upload-image-button">Subir imágenes adicionales</label>
              <input
                id="secondary-images"
                type="file"
                accept="image/*"
                multiple
                onChange={(e) => {
                  const newFiles = Array.from(e.target.files);
                  setSecondaryFiles(prevFiles => [...prevFiles, ...newFiles]);
                }}
                style={{ display: "none" }}
              />
              {secondaryFiles.length > 0 && (
                <div className="image-names">
                  Imágenes seleccionadas:
                  <ul>
                    {secondaryFiles.map((file, idx) => (
                      <li key={idx} style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                        {file.name}
                        <button
                          type="button"
                          className="delete-image-button"
                          onClick={() => {
                            setSecondaryFiles(prev => prev.filter((_, i) => i !== idx));
                          }}
                        >
                          ✕
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {existingSecondaryImages.length > 0  && (
                <div className="image-names">
                  Imágenes secundarias existentes:
                  <ul>
                    {existingSecondaryImages
                      .filter(img => img.id !== "main")
                      .map(img => (
                        <li key={img.id} style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                          {img.path}
                          <button
                            type="button"
                            className="delete-image-button"
                            onClick={() => {
                              if (img.id && img.id !== "main") {
                                handleDeleteSecondaryImage(img.id);
                              } else {
                                alert("No se puede eliminar esta imagen");
                              }
                            }}
                          >
                            ✕
                          </button>

                        </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="save-cancel-container">
                <button type="submit" disabled={!isValid} className={`save-button ${isValid ? "active" : ""}`}>{isAdd ? "Registrar" : "Guardar"}</button>
                <button type="button" className="cancel-button" onClick={handleClose}>Cancelar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

export default AddEditRoomModal;
