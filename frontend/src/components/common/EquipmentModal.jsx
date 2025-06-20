import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import AlertMessage from "./AlertMessage.jsx";
import { useNavigate } from "react-router-dom";
import "../../style/equipment-admin.css";
import DefaultRoom from "../../assets/images/salas/default_zone.jpg";

const DEFAULT_ROUTE = "http://localhost:1522";

const EquipmentModal = ({ isOpen, mode, equipment, onClose, onDelete, onSave }) => {
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
      type: "",
      description: "",
      quantity: 0,
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
      reset({ name: "", type: "", description: "", quantity: 0 });
      setImageFile(null);
      setImagePath(null);
      setImageName("");
    } else if ((isEditMode || isViewMode || isDeleteMode) && equipment) {
      reset({
        name: equipment.name,
        type: equipment.type,
        description: equipment.description,
        quantity: equipment.quantity,
      });
      setImagePath(equipment.imagePath || null);
    }
  }, [mode, equipment, reset]);

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
      let encryptedImagePath = equipment?.imagePath || null;

      if (imageFile) {
        const formData = new FormData();
        formData.append("image", imageFile);
        const res = await fetch(`${DEFAULT_ROUTE}/equipments/upload-image`, {
          method: "POST",
          body: formData,
        });
        const result = await res.json();
        encryptedImagePath = result.imagePath;
      }

      const parsedData = {
        ...data,
        quantity: parseInt(data.quantity),
        imagePath: encryptedImagePath,
      };

      await onSave(parsedData);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
      onClose();
    } catch (error) {
      setErrorMessage("Error al guardar el equipo");
      setShowError(true);
    }
  };

  const handleDelete = async () => {
    try {
      await onDelete(equipment);
      onClose();
    } catch (err) {
      setErrorMessage("No se pudo eliminar el equipo");
      setShowError(true);
    }
  };

  if (!isOpen || (isViewMode && !equipment)) return null;

  return (
    <>
      {showSuccess && <AlertMessage message="Equipo guardado con éxito" type="alert-floating" className="success" onClose={() => setShowSuccess(false)} />}
      {showError && <AlertMessage message={errorMessage} type="alert-floating" className="error" onClose={() => setShowError(false)} />}

      <div className="equipment-modal-overlay" onClick={onClose}>
        <div className="equipment-modal-content" onClick={(e) => e.stopPropagation()}>
          <button className="equipment-modal-close" onClick={onClose}>×</button>

          {(isAddMode || isEditMode) && (
            <form onSubmit={handleSubmit(onSubmit)} className="equipment-modal-form">
              <h2>{isAddMode ? "Agregar Equipo" : "Editar Equipo"}</h2>
               <p>
                Los campos marcados con <span className="required">*</span> son obligatorios
              </p>
              <label>
                  Nombre <span className="required">*</span>
                </label>
              <input className="input" {...register("name", { required: "Nombre requerido" })} />
              {errors.name && <span className="error">{errors.name.message}</span>}

              <label>
                  Tipo <span className="required">*</span>
                </label>
              <input className="input" {...register("type", { required: "Tipo requerido" })} />
              {errors.type && <span className="error">{errors.type.message}</span>}
             
              <label htmlFor="unitaryPrice">Precio unitario:</label>
              <input
                type="number"
                id="unitaryPrice"
                step="0.01"
                {...register("unitaryPrice", { required: true, min: 0 })}
              />

              <label>
                  Descripción <span className="required">*</span>
                </label>
              <textarea className="input" {...register("description")} />

              <label>
                  Cantidad <span className="required">*</span>
                </label>
              <input type="number" className="input" {...register("quantity", { required: true, min: 0 })} />
              {errors.quantity && <span className="error">Cantidad inválida</span>}

              <label htmlFor="equipment-image" className="upload-image-button">Subir imagen principal</label>
              <input id="equipment-image" type="file" accept="image/*" style={{ display: "none" }} onChange={handleImageChange} />

              {(imagePath || imageFile) && (
                <div className="image-name">
                  Imagen seleccionada: {imageName || imagePath}
                  <button type="button" className="delete-image-button" onClick={handleRemoveImage}>✕</button>
                </div>
              )}

              <div className="save-cancel-container">
                <button type="submit" className="btn" disabled={!isValid}>{isAddMode ? "Registrar" : "Guardar"}</button>
                <button type="button" className="cancel-button" onClick={onClose}>Cerrar</button>
              </div>
            </form>
          )}

          {isViewMode && equipment && (
            <div className="equipment-info-modal">
              <div className="modal-equipment-info-content" onClick={(e) => e.stopPropagation()}>
                <button className="close-button" type="button" onClick={onClose}>
                  <i className="bi bi-x-lg"></i>
                </button>

                <div className="equipment-info-photo-container"> 
                <img src={equipment.imagePath ? `${DEFAULT_ROUTE}/${equipment.imagePath}` : DefaultRoom} alt={equipment.name} />
                <div className="equipment-info-content">
                  <h2>{equipment.name}</h2>
                  <p><strong>Tipo:</strong> {equipment.type}</p>
                  <p><strong>Precio: </strong> ₡{parseFloat(equipment.unitaryPrice).toLocaleString()}</p>
                  <p><strong>Cantidad:</strong> {equipment.quantity}</p>
                  <p><strong>Descripción:</strong> {equipment.description}</p>
                </div>
                </div>
              </div>
            </div>
          )}

          {isDeleteMode && equipment && (
            <>
              <h2>¿Eliminar equipo?</h2>
              <p><strong>{equipment.name}</strong> será eliminado permanentemente.</p>
              <div className="equipment-modal-actions">
                <button className="btn btn-delete" style={{ color: "red" }} onClick={handleDelete}>Eliminar</button>
                <button className="btn" onClick={onClose}>Cancelar</button>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default EquipmentModal;