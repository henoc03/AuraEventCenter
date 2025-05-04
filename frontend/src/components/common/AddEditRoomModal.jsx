import React from "react";
import {useForm} from 'react-hook-form';
import {useState} from 'react';
import { Dropdown } from 'react-bootstrap';
import '../../style/AddEditRoomModal.css'

function AddEditRoomModal({ isModalOpen, onClose }) {
  const [isAddEditOpen, setIsAddEditOpen] = useState(isModalOpen);
  const [image, setImage] = useState(null);
  
  const {register, handleSubmit, formState: { errors, isValid } } = useForm({ mode: 'onChange' });

  const onSubmit = (data) => {
    console.log('Profile:', data);
  };

  // const roomsTypes = [
  //   { value: 'Recreativa', label: 'Recreativa' },
  //   { value: 'Conferencias', label: 'Conferencias' },
  //   { value: 'Reuniones', label: 'Reuniones' },
  // ];

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(URL.createObjectURL(file)); // Mostrar imagen cargada
    }
  };

  const [selected, setSelected] = useState('Seleccione una categoría');

  const handleSelect = (eventKey) => {
    setSelected(eventKey);
  };

  const handleClose = () => {
    setIsAddEditOpen(false);
    if (onClose) {
      onClose();
    }
  };

  return (
    <>
      {isAddEditOpen && (
        <div className="add-edit-modal" onClick={handleClose}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          <div className="title-close-container">
            <h2>Agregar sala</h2>
            <button className="close-button" type="button" onClick={handleClose}><i class="bi bi-x-lg"></i></button>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="auth-form">
            <h3>Los campos marcados con * son obligatorios</h3>
            {/* Nombre de la sala */}
            <label htmlFor="name">Nombre de la sala *</label>
            <input
              type="text"
              placeholder="Ingrese el nombre aquí"
              className='input'
              {...register('name', { required: 'Nombre de sala requerido' })}
            />
            {errors.name && <span className="error">{errors.name.message}</span>}

            {/* Tipo de sala */}
            {/* <label htmlFor="category">Categoría *</label>
            <select id="category" class="form-select" aria-label="Categories">
              <option className='option'selected></option>
              <option className='option' value="Recreativa">Recreativa</option>
              <option className='option' value="Conferencias">Conferencias</option>
              <option className='option' value="Reuniones">Reuniones</option>
            </select> */}

            <label htmlFor="category">Categoría *</label>
            <div className="mb-3 categories-dropdown">
              <Dropdown className="categories" onSelect={handleSelect}>
                <Dropdown.Toggle
                id="category-drop-down"
                className="text-start"
                >
                  {selected}
                </Dropdown.Toggle>

                <Dropdown.Menu>
                  <Dropdown.Item eventKey="Recreativa">Recreativa</Dropdown.Item>
                  <Dropdown.Item eventKey="Conferencias">Conferencias</Dropdown.Item>
                  <Dropdown.Item eventKey="Reuniones">Reuniones</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </div>
      
            
            {/* Precio */}
            <label htmlFor="price">Precio *</label>
            <input
              type="text"
              placeholder="Ingrese el precio aquí"
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
              placeholder="Ingrese la capacidad aquí"
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
              placeholder="Ingrese la descripción aquí"
              className='input'
              {...register('description', { required: 'Descripción de la requerido' })}
            />
            {errors.description && <span className="error">{errors.description.message}</span>}

            <label htmlFor="room-image" className="upload-image-button">Subir imagen</label>
            <input
              id="room-image"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              style={{ display: 'none' }}
            />

            <button 
              type="submit" 
              disabled={!isValid} 
              className={`save-button ${isValid ? 'active' : ''}`} 
              onClick={handleClose}>
                Guardar
            </button>
          </form>
        </div>
      </div>
      )}
    </>
  )
}

export default AddEditRoomModal;