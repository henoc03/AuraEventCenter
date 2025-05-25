import React from "react";
import {useForm} from 'react-hook-form';
import {useState,useEffect} from 'react';
import { Dropdown } from 'react-bootstrap';
import AlertMessage from "./AlertMessage.jsx"

import '../../style/AddEditRoomModal.css'

const DEFAULT_ROUTE = "http://localhost:1522";

function AddEditRoomModal({ 
  isModalOpen,
  onClose,
  id="",
  name="Ingrese el nombre aquí",
  type="Ingrese la categoría aquí",
  price="Ingresse el precio aquí",
  capacity="Ingrese la capacidad aquí",
  description="Ingrese la descripción aquí",
  isAdd=false}) 
  {

  const [isAddEditOpen, setIsAddEditOpen] = useState(isModalOpen);
  const [ setImage] = useState(null);
  const {register, handleSubmit, formState: { errors, isValid } } = useForm({ mode: 'onChange' });
  const [showCreateSuccess, setShowCreateSuccess] = useState(false);
  const [showUpdateSuccess, setShowUpdateSuccess] = useState(false);
  const [imageFile, setImageFile] = useState(null);

  
  useEffect(() => {
    setIsAddEditOpen(isModalOpen);
  }, [isModalOpen]);

  const onSubmit = async (data) => {
  let encryptedImagePath = null;

  if (imageFile) {
    const formData = new FormData();
    formData.append('image', imageFile);

    try {
      const res = await fetch(`${DEFAULT_ROUTE}/zones/upload-image`, {
        method: 'POST',
        body: formData
      });

      if (!res.ok) {
        throw new Error('Error al subir la imagen');
      }

      const imageData = await res.json();
      console.log("📸 imageData recibido:", imageData);
      encryptedImagePath = imageData.imagePath;
    } catch (error) {
      console.error('❌ Error subiendo imagen:', error);
      alert('Error al subir imagen');
      return;
    }
  }

  const zoneToSend = {
    name: data.name,
    type: data.type,
    price: data.price,
    capacity: data.capacity,
    description: data.description,
    event_center_id: 1,
    imagePath: encryptedImagePath
  };

  try {
    const res = await fetch(`${DEFAULT_ROUTE}/zones/${isAdd ? '' : id}`, {
      method: isAdd ? 'POST' : 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(zoneToSend)
    });

    if (!res.ok) {
      const errorData = await res.json();
      alert(errorData.message || 'Error al guardar la zona');
      return;
    }

    if (isAdd) setShowCreateSuccess(true);
    else setShowUpdateSuccess(true);

    onClose();
  } catch (error) {
    console.error('❌ Error:', error);
    alert('Ocurrió un error al guardar la zona.');
  }
};



  const handleImageChange = (e) => {
    const file = e.target.files[0];
    console.log(file);
    if (file) {
      setImageFile(file); // Guardamos el archivo directamente
    }
  };


  const handleClose = () => {
    setIsAddEditOpen(false);
    if (onClose) {
      onClose();
    }
  };

  return (
    <>
      {showCreateSuccess && (
        <AlertMessage
          message={"Sala agregada con éxito"}
          type={"alert-floating"}
          onClose={() => setShowCreateSuccess(false)}
          duration={3000}
          className={"success"}
        />
      )}

      {showUpdateSuccess && (
        <AlertMessage
          message={"Sala actualizada con éxito"}
          type={"alert-floating"}
          onClose={() => setShowCreateSuccess(false)}
          duration={3000}
          className={"success"}
        />
      )}

      {isAddEditOpen && (
        <div className="add-edit-modal" onClick={handleClose}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="title-close-container">
          <h2>{isAdd ? 'Agregar sala' : 'Editar sala'}</h2>
          <button className="close-x" onClick={handleClose}>×</button>
        </div>

          <form onSubmit={(handleSubmit(onSubmit))} className="auth-form">
            <h3>Los campos marcados con * son obligatorios</h3>
            {/* Nombre de la sala */}
            <label htmlFor="name">Nombre de la sala *</label>
            <input
              type="text"
              placeholder={name}
              className='input'
              {...register('name', { required: 'Nombre de sala requerido' })}
            />
    
            {errors.name && <span className="error">{errors.name.message}</span>}

            <label htmlFor="type">Categoría *</label>
            <input
              type="text"
              placeholder={type}
              className='input'
              {...register('type', {})}
            />
            {errors.type && <span className="error">{errors.type.message}</span>}

      
            
            {/* Precio */}
            <label htmlFor="price">Precio *</label>
            <input
              type="text"
              placeholder={`₡${price}`}
              className='input'
              {...register('price', {
                required: 'Precio requerido',
                pattern: {
                  value: /^[0-9]/,
                  message: 'Solo se admiten números'
                }
              })}
            />
            {errors.price && <span className="error">{errors.price.message}</span>}

            {/* Capacidad */}
            <label htmlFor="capacity">Capacidad *</label>
            <input
              type="text"
              placeholder={`${capacity} personas`}
              className='input'
              {...register('capacity', {
                required: 'Capacidad requerida',
                pattern: {
                  value: /^[0-9]/,
                  message: 'Solo se admiten números'
                }
              })}
            />
            {errors.capacity && <span className="error">{errors.capacity.message}</span>}

            {/* Descripcion */}
            <label htmlFor="description">Descripcion *</label>
            <input
              type="text"
              placeholder={description}
              className='input'
              {...register('description', { required: 'Descripción de la requerido' })}
            />
            {errors.description && <span className="error">{errors.description.message}</span>}

            <label htmlFor="room-image" className="upload-image-button">Subir imagen</label>
            <input
              id="room-image"
              name="image"   // <-- agregar este atributo
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              style={{ display: 'none' }}
            />


            <div className="save-cancel-container">
            <button onSubmit={onSubmit} type="submit" disabled={!isValid} className={`save-button ${isValid ? 'active' : ''}`} >
              Guardar
            </button>

            <button 
              type="button" className={`cancel-button`} onClick={handleClose}>Cancelar</button>
            </div>
          </form>
        </div>
      </div>
      )}
    </>
  )
}

export default AddEditRoomModal;