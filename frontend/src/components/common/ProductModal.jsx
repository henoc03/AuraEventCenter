import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import "../../style/product-modal.css";

const ProductModal = ({ isOpen, mode, product, onClose, onDelete, onSubmit: onSubmitProp }) => {
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
      type: "",
    },
  });

  useEffect(() => {
  if (isAddMode) {
    reset({
      name: "",
      description: "",
      price: "",
      type: "",
    });
  } else if ((isEditMode || isViewMode) && product) {
    reset(product);
  }
}, [mode, product, reset]);


  const onSubmit = async (data) => {
    const mappedData = {
    name: data.name,
    unitary_price: parseFloat(data.price),
    description: data.description,
    type: data.type,
    };
    await onSubmitProp(mappedData);
    onClose();
  };

  const handleDelete = () => {
    onDelete(product);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="product-modal-overlay">
      <div className="product-modal-content">
        <button className="product-modal-close" onClick={onClose}>×</button>

        {(isAddMode || isEditMode) && (
        <>
        <h2>{isAddMode ? "Agregar Servicio" : "Editar Servicio"}</h2>
        <p>Los campos marcados con <span style={{ color: "red" }}>*</span> son obligatorios</p>
          <form onSubmit={handleSubmit(onSubmit)} className="product-modal-form">
            <label>Nombre<span style={{ color: "red" }}>*</span></label>
            <input 
              type="text"
              className="input"
              {...register("name", { required: "Nombre requerido" })} />
              {errors.name && <span>{errors.name.message}</span>}

            <label>Tipo<span style={{ color: "red" }}>*</span></label>
            <input
              {...register("type", { required: "Tipo requerido" })}
            />
            {errors.type && <span>{errors.type.message}</span>}

            <label>Descripción<span>*</span></label>
            <textarea 
            className="input"
            {...register("description", { required: "Descripción requerida" })} />
            {errors.description && <span>{errors.description.message}</span>}

            <label>Precio<span>*</span></label>
            <input 
            type="number" 
            step="0.01" 
            className="input"
            {...register("price", { required: "Precio requerido" })} />
            {errors.price && <span>{errors.price.message}</span>}

            <div className="modal-btns">
              <button type="submit" className="btn" disabled={!isValid}>
                {isAddMode ? "Registrar Producto" : "Guardar Cambios"}
              </button>
              <button type="button" className="btn-text-close" onClick={onClose}>Cerrar</button>
            </div>
          </form>
          </>
        )}

        {isViewMode && product && (
          <div className="info-container">
            <h3><strong> {product.name}</strong></h3>
            <p><strong>Tipo: </strong> {product.type} | <strong>Precio: </strong> ₡{parseFloat(product.price).toLocaleString()}</p>
             <p><strong>Descripción: </strong> {product.description}</p>
          </div>
        )}

        {isDeleteMode && product && (
          <>
            <h2>¿Eliminar producto?</h2>
            <p><strong>{product.name}</strong> será eliminado permanentemente.</p>
            <div className="product-modal-actions">
              <button className="btn" onClick={handleDelete} style={{ color: "red" }}>Eliminar</button>
              <button className="btn" onClick={onClose}>Cancelar</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ProductModal;
