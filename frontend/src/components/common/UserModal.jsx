import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import "../../style/user-modal.css";

const UserModal = ({ isOpen, mode, user, onClose, onDelete, onSubmit: onSubmitProp }) => {
  const isEditMode = mode === "edit";
  const isAddMode = mode === "add";
  const isViewMode = mode === "view";
  const isDeleteMode = mode === "delete";

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isValid },
  } = useForm({
    mode: "onChange",
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
    },
  });

  const password = watch("password");

  useEffect(() => {
    if ((isEditMode || isViewMode) && user) {
      reset({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        password: "",
        confirmPassword: "",
      });
    } else {
      reset();
    }
  }, [user, isEditMode, isViewMode, reset]);

  const onSubmit = async (data) => {
    try {
      await onSubmitProp(data);
      onClose();
    } catch (err) {
      console.error("❌ Error en envío de formulario:", err);
    }
  };
  

  const handleDelete = () => {
    if (user && onDelete) {
      onDelete(user);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="user-modal-overlay">
      <div className="user-modal-content">
        <button className="user-modal-close" onClick={onClose}>×</button>

        {(isAddMode || isEditMode) && (
          <>
            <h2>{isAddMode ? "Agregar Usuario" : "Editar Usuario"}</h2>
            <p>Los campos marcados con <span style={{ color: "red" }}>*</span> son obligatorios</p>
            <form onSubmit={handleSubmit(onSubmit)} className="user-modal-form">
              <label>Nombre completo<span style={{ color: "red" }}>*</span></label>
              <input
                type="text"
                {...register("name", { required: "Nombre requerido" })}
              />
              {errors.name && <span className="error">{errors.name.message}</span>}

              <label>Correo electrónico <span style={{ color: "red" }}>*</span></label>
              <input
                type="email"
                {...register("email", {
                  required: "Email requerido",
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: "Formato de email inválido",
                  },
                })}
              />
              {errors.email && <span className="error">{errors.email.message}</span>}

              <label>Número telefónico <span style={{ color: "red" }}>*</span></label>
              <input
                type="tel"
                {...register("phone", {
                  required: "Teléfono requerido",
                  pattern: {
                    value: /^[0-9]{8}$/,
                    message: "Solo números (8 dígitos)",
                  },
                })}
              />
              {errors.phone && <span className="error">{errors.phone.message}</span>}

              <label>Contraseña <span style={{ color: "red" }}>*</span></label>
              <input
                type="password"
                placeholder={mode === "edit" ? "Dejar en blanco para mantener actual" : ""}
                {...register("password", {
                  required: mode === "create" ? "Contraseña requerida" : false,  // Solo requerido en modo "create"
                  pattern: {
                    value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[\W_]).{8,}$/,
                    message: "Mínimo 8 caracteres, 1 mayúscula, 1 número, 1 símbolo",
                  },
                })}
              />
              {errors.password && <span className="error">{errors.password.message}</span>}

              {isAddMode && (
                 <>
                <label>Confirmar contraseña <span style={{ color: "red" }}>*</span></label>
                <input
                type="password"
                {...register("confirmPassword", {
                    required: "Confirmación requerida",
                    validate: (value) =>
                    value === password || "Las contraseñas no coinciden",
                })}
                />
                {errors.confirmPassword && (
                <span className="error">{errors.confirmPassword.message}</span>
                )}
            </>
             )}

             <div className="modal-btns">
              <button
                type="submit"
                disabled={!isValid}
                className={`btn ${isValid ? "active" : ""}`}
              >
                {isAddMode ? "Registrar Usuario" : "Guardar Cambios"}
              </button>
              
            <button className="btn-text-close" onClick={onClose}>Cerrar</button>
            </div>
            </form>
          </>
        )}

        {isViewMode && user && (
          <>
  {user?.image && (
      <div className="user-image-container">
        <img src={user.image} alt="Foto de perfil" className="user-profile-image" />
      </div>
    )}
    <div className="info-container">
      <div>
          <label>Nombre:</label>
          <p>{user.name}</p>
        </div>
        <div>
          <label>Email:</label>
          <p>{user.email}</p>
        </div>
        <div>
          <label>Teléfono:</label>
          <p>{user.phone}</p>
        </div>
        <div>
          <label>Estado:</label>
          <p>{user.status}</p>
        </div>
    </div>

    </>
        )}

        {isDeleteMode && user && (
          <>
            <h2 className="modal-title">¿Eliminar Usuario?</h2>
            <p><strong>{user.name}</strong> será eliminado permanentemente.</p>
            <div className="user-modal-actions">
              <button className="btn" onClick={handleDelete} style={{ color: "red" }}>Eliminar</button>
              <button className="btn" onClick={onClose}>Cancelar</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default UserModal;
