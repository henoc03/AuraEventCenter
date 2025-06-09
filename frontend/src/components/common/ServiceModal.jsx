import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import AlertMessage from "./AlertMessage.jsx";
import "../../style/AddEditRoomModal.css";


const DEFAULT_ROUTE = "http://localhost:1522";

const ServiceModal = ({ isOpen, mode, service, onClose, onDelete, onSave }) => {
  const isEditMode = mode === "edit";
  const isAddMode = mode === "add";
  const isViewMode = mode === "view";
  const isDeleteMode = mode === "delete";

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = useForm({
    mode: "onChange",
    defaultValues: {
      name: "",
      description: "",
      price: "",
    },
  });

  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [imageFile, setImageFile] = useState(null);
  const [imagePath, setImagePath] = useState(null);
  const [imageName, setImageName] = useState("");

  useEffect(() => {
    if (isAddMode) {
      reset({ name: "", description: "", price: "" });
      setImageFile(null);
      setImagePath(null);
      setImageName("");
    } else if ((isEditMode || isViewMode || isDeleteMode) && service) {
      reset({
        name: service.name || "",
        description: service.description || "",
        price: service.price || "",
      });
      setImagePath(service.imagePath || null);
      setImageFile(null);
      setImageName("");
    }
  }, [mode, service, reset]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImageName(file.name);
      setImagePath(URL.createObjectURL(file));
    }
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImageName("");
    setImagePath(null);
  };

  const onSubmit = async (data) => {
    try {
      let encryptedImagePath = service?.imagePath || null;

      if (imageFile) {
        const formData = new FormData();
        formData.append("image", imageFile);

        const res = await fetch("http://localhost:1522/services/upload-image", {
          method: "POST",
          body: formData,
        });

        if (!res.ok) {
          const errorText = await res.text();
          throw new Error("Error al subir la imagen: " + errorText);
        }

        const imageData = await res.json();
        encryptedImagePath = imageData.imagePath;
      } else if (!imageFile && !imagePath) {
        encryptedImagePath = null;
      }

      const parsedData = {
        ...data,
        price: parseFloat(data.price),
        imagePath: encryptedImagePath,
        active: 1,
      };
      await onSave(parsedData);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
      onClose();
    } catch (error) {
      console.error("Error al guardar el servicio", error);
      setErrorMessage("Error al guardar el servicio");
      setShowError(true);
    }
  };

  const handleDelete = async () => {
    try {
      await onDelete(service);
      onClose();
    } catch (err) {
      console.error("Error eliminando servicio", err);
      setErrorMessage("No se pudo eliminar el servicio");
      setShowError(true);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {showSuccess && (
        <AlertMessage
          message="Servicio guardado con éxito"
          type="alert-floating"
          onClose={() => setShowSuccess(false)}
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

      <div className="add-edit-modal" onClick={onClose}>
        <div className="room-modal-content" onClick={(e) => e.stopPropagation()}>
          <button className="room-modal-close" onClick={onClose}>
            ×
          </button>

          {(isAddMode || isEditMode) && (
            <>
              <p>
                Los campos marcados con <span className="required">*</span> son obligatorios
              </p>
              <form onSubmit={handleSubmit(onSubmit)} className="service-modal-form">
                <label>
                  Nombre <span className="required">*</span>
                </label>
                <input
                  type="text"
                  className="input"
                  {...register("name", { required: "Nombre requerido" })}
                />
                {errors.name && <span className="error">{errors.name.message}</span>}

                <label>
                  Descripción <span className="required">*</span>
                </label>
                <textarea
                  className="input"
                  {...register("description", { required: "Descripción requerida" })}
                />
                {errors.description && <span className="error">{errors.description.message}</span>}

                <label>
                  Precio (₡) <span className="required">*</span>
                </label>
                <input
                  type="number"
                  step="0.01"
                  className="input"
                  {...register("price", {
                    required: "Precio requerido",
                    min: { value: 0, message: "El precio debe ser mayor o igual a 0" },
                  })}
                />
                {errors.price && <span className="error">{errors.price.message}</span>}
                <label htmlFor="room-image" className="upload-image-button"  style={{ marginBottom: "20px" }}>Subir imagen principal</label>
                <label>Imagen Principal</label>
                <input
                  id="room-image"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                   style={{ display: "none" }}
                />

                {(imagePath || imageFile) && (
                  <div className="image-name" style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  Imagen principal seleccionada: {imageName || imagePath}
                  <button
                    type="button"
                    className="delete-image-button"
                    onClick={handleRemoveImage}
                  >
                    ✕
                  </button>
                  </div>
                )}

                <div className="save-cancel-container">
                  <button type="submit" className="btn" disabled={!isValid}>
                    {isAddMode ? "Registrar Servicio" : "Guardar Cambios"}
                  </button>
                  <button type="button" className="cancel-button" onClick={onClose}>
                    Cerrar
                  </button>
                </div>
              </form>
            </>
          )}

          {isViewMode && service && (
          <div className="room-info-modal" onClick={onClose}>
          <div className="modal-room-info-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-button" type="button" onClick={onClose}><i className="bi bi-x-lg"></i></button>
             
            <div className='room-info-photo-container'>
              <img src={service.imagePath && service.imagePath.trim() !== ""
                                  ? `${DEFAULT_ROUTE}/${service.imagePath}`: defaultImage} alt={`Foto de la sala ${service.name}`}/>
              <div className='room-info-content'>
              <h2>Detalle del Servicio</h2>
             <p><strong>Nombre:</strong> {service.name}</p>
              <p><strong>Descripción:</strong> {service.description}</p>
              <p><strong>Precio:</strong> ₡{service.price}</p>

                          </div>
            </div>
          </div>
        </div>
          )}

          {isDeleteMode && service && (
            <>
              <h2>¿Eliminar servicio?</h2>
              <p>
                <strong>{service.name}</strong> será eliminado permanentemente.
              </p>
              <div className="modal-buttons">
                <button className="btn btn-delete" onClick={handleDelete}>
                  Eliminar
                </button>
                <button className="btn" onClick={onClose}>
                  Cancelar
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default ServiceModal;
