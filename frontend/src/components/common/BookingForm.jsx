import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import PropTypes from "prop-types";
import '../../style/booking-form.css';

function BookingForm( {onNextStep, isEditMode = false, bookingInfo = {}} ) {
  const { register, handleSubmit, formState: { errors, isValid }, reset } = useForm({
    mode: "onChange",
    defaultValues: {
      owner: isEditMode ? bookingInfo.owner : "",
      event_name: isEditMode ? bookingInfo.bookingName : "",
      id_card: isEditMode ? bookingInfo.idCard : "",
      email: isEditMode ? bookingInfo.email : "",
      phone: isEditMode ? bookingInfo.phone : "",
      event_type: isEditMode ? bookingInfo.eventType : "",
      start_time: isEditMode ? bookingInfo.startTime : "",
      end_time: isEditMode ? bookingInfo.endTime : "",
      date: isEditMode ? bookingInfo.date : "",
      additional_info: isEditMode ? bookingInfo.additionalNote : "",
    }
  });

  useEffect(() => {
    reset({
      owner: isEditMode ? bookingInfo.owner : "",
      event_name: isEditMode ? bookingInfo.bookingName : "",
      id_card: isEditMode ? bookingInfo.idCard : "",
      email: isEditMode ? bookingInfo.email : "",
      phone: isEditMode ? bookingInfo.phone : "",
      event_type: isEditMode ? bookingInfo.eventType : "",
      start_time: isEditMode ? bookingInfo.startTime : "",
      end_time: isEditMode ? bookingInfo.endTime : "",
      date: isEditMode ? bookingInfo.date : "",
      additional_info: isEditMode ? bookingInfo.additionalNote : "",
    });
  }, [isEditMode, bookingInfo, reset]);

  const onSubmit = async (data) => {
    const formData = {
      owner: data.owner,
      bookingName: data.event_name,
      idCard: data.id_card,
      email: data.email,
      phone: data.phone,
      eventType: data.event_type,
      startTime: data.start_time,
      endTime: data.end_time,
      date: data.date,
      additionalNote: data.additional_info,
    };

    onNextStep(formData);
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="booking-form">
      {/* Nombre del propietario */}
      <label htmlFor="owner-input">Nombre del propietario <span style={{ color: "red" }}>*</span></label>
      <input
        id="owner-input"
        type="text"
        className="input"
        {...register("owner", { required: "Nombre del propietario requerido" })}
      />
      {errors.owner && <span className="error">{errors.owner.message}</span>}

      {/* Nombre del evento */}
      <label htmlFor="event-name-input">Nombre del evento<span style={{ color: "red" }}>*</span></label>
      <input
        id="event-name-input"
        type="text"
        className="input"
        {...register("event_name", { required: "Nombre del evento requerido" })}
      />
      {errors.event_name && <span className="error">{errors.event_name.message}</span>}

      {/* Cédula */}
      <label htmlFor="id-card-input">Cédula <span style={{ color: "red" }}>*</span></label>
      <input
        id="id-card-input"
        type="number"
        className="input"
        {...register("id_card", { 
          required: "Cédula requerida",
          pattern: {
            value: /^\d{9}$/,
            message: "La cédula debe tener 9 dígitos"
          }
        })}
      />
      {errors.id_card && <span className="error">{errors.id_card.message}</span>}

      {/* Correo */}
      <label htmlFor="email-input">Correo electrónico <span style={{ color: "red" }}>*</span></label>
      <input
        id="email-input"
        type="email"
        className="input"
        {...register("email", { required: "Correo electrónico requerido" })}
      />
      {errors.email && <span className="error">{errors.email.message}</span>}

      {/* Número de teléfono */}
      <label htmlFor="phone-input">Número de teléfono <span style={{ color: "red" }}>*</span></label>
      <input
        id="phone-input"
        type="tel"
        className="input"
        {...register("phone", { 
          required: "Número de teléfono requerido",
          pattern: {
            value: /^\d{8}$/,
            message: "El número de teléfono debe tener 8 dígitos"
          }
        })}
      />
      {errors.phone && <span className="error">{errors.phone.message}</span>}

      {/* Tipo de evento */}
      <p>Tipo de evento <span style={{ color: "red" }}>*</span></p>
      <div className="event-type-radio-group">
        <label>
          <input
            type="radio"
            value="Conferencia"
            {...register("event_type", { required: "Tipo de evento requerido" })}
          /> Conferencia
        </label>
        <label>
          <input
            type="radio"
            value="Convención"
            {...register("event_type", { required: "Tipo de evento requerido" })}
          /> Convención
        </label>
        <label>
          <input
            type="radio"
            value="Feria cultural"
            {...register("event_type", { required: "Tipo de evento requerido" })}
          /> Feria cultural
        </label>
        <label>
          <input
            type="radio"
            value="Boda"
            {...register("event_type", { required: "Tipo de evento requerido" })}
          /> Boda
        </label>
        <label>
          <input
            type="radio"
            value="Concierto"
            {...register("event_type", { required: "Tipo de evento requerido" })}
          /> Concierto
        </label>
        <label>
          <input
            type="radio"
            value="Otro"
            {...register("event_type", { required: "Tipo de evento requerido" })}
          /> Otro
        </label>
      </div>
      {errors.event_type && <span className="error">{errors.event_type.message}</span>}

      {/* Hora de inicio */}
      <label htmlFor="start-time-input">Hora de inicio<span style={{ color: "red" }}>*</span></label>
      <input
        id="start-time-input"
        type="time"
        className="input"
        {...register("start_time", { required: "Hora de inicio requerida" })}
      />
      {errors.start_time && <span className="error">{errors.start_time.message}</span>}

      {/* Hora de finalización */}
      <label htmlFor="end-time-input">Hora de finalización<span style={{ color: "red" }}>*</span></label>
      <input
        id="end-time-input"
        type="time"
        className="input"
        {...register("end_time", { required: "Hora de finalización requerida" })}
      />
      {errors.end_time && <span className="error">{errors.end_time.message}</span>}

      {/* Fecha */}
      <label htmlFor="date-input">Fecha<span style={{ color: "red" }}>*</span></label>
      <input
        id="date-time-input"
        type="date"
        className="input"
        {...register("date", { required: "Fecha requerida" })}
      />
      {errors.date && <span className="error">{errors.date.message}</span>}

      <button type="submit" className={`booking-next-button ${isValid ? "active" : ""}`} disabled={!isValid}>Siguiente</button>
    </form>
  );
}

BookingForm.propTypes = {
  onNextStep: PropTypes.func.isRequired,
  isEditMode: PropTypes.bool,
  bookingInfo: PropTypes.object,
};

export default BookingForm;