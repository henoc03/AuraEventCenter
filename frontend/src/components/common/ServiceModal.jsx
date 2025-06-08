import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import AlertMessage from "./AlertMessage.jsx";
import "../../style/AddEditRoomModal.css"; // Reutilizamos estilos modernos

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

  useEffect(() => {
    if (isAddMode) {
      reset({ name: "", description: "", price: "" });
    } else if ((isEditMode || isViewMode || isDeleteMode) && service) {
      reset(service);
    }
  }, [mode, service, reset]);

  const onSubmit = async (data) => {
    try {
      const parsedData = { ...data, price: parseFloat(data.price) };
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
          <button className="room-modal-close" onClick={onClose}>×</button>

          {(isAddMode || isEditMode) && (
            <>
              <p>Los campos marcados con <span style={{ color: "red" }}>*</span> son obligatorios</p>
              <form onSubmit={handleSubmit(onSubmit)} className="service-modal-form">
                <label>Nombre <span style={{ color: "red" }}>*</span></label>
                <input
                  type="text"
                  className="input"
                  {...register("name", { required: "Nombre requerido" })}
                />
                {errors.name && <span className="error">{errors.name.message}</span>}

                <label>Descripción <span style={{ color: "red" }}>*</span></label>
                <textarea
                  className="input"
                  {...register("description", { required: "Descripción requerida" })}
                />
                {errors.description && <span className="error">{errors.description.message}</span>}

                <label>Precio (₡) <span style={{ color: "red" }}>*</span></label>
                <input
                  type="number"
                  step="0.01"
                  className="input"
                  {...register("price", {
                    required: "Precio requerido",
                    min: { value: 0, message: "El precio debe ser mayor o igual a 0" }
                  })}
                />
                {errors.price && <span className="error">{errors.price.message}</span>}

                <div className="modal-buttons">
                  <button type="submit" className="btn" disabled={!isValid}>
                    {isAddMode ? "Registrar Servicio" : "Guardar Cambios"}
                  </button>
                  <button type="button" className="btn-text-close" onClick={onClose}>Cerrar</button>
                </div>
              </form>
            </>
          )}

          {isViewMode && service && (
            <div className="info-container">
              <h2>Detalle del Servicio</h2>
              <p><strong>Nombre:</strong> {service.name}</p>
              <p><strong>Descripción:</strong> {service.description}</p>
              <p><strong>Precio:</strong> ₡{service.price}</p>
            </div>
          )}

          {isDeleteMode && service && (
            <>
              <h2>¿Eliminar servicio?</h2>
              <p><strong>{service.name}</strong> será eliminado permanentemente.</p>
              <div className="modal-buttons">
                <button className="btn" onClick={handleDelete} style={{ color: "red" }}>
                  Eliminar
                </button>
                <button className="btn" onClick={onClose}>Cancelar</button>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default ServiceModal;
