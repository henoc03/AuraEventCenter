import React from "react";
import BookingForm from "../../common/BookingForm.jsx";

function Step1Form({ onNext, bookingInfo }) {
  return (
    <div className="booking-client-step1">
      <p>
        Los campos marcados con <span style={{ color: 'red' }}>*</span> son obligatorios
      </p>
      <BookingForm
        onNextStep={onNext}
        isEditMode={false}
        bookingInfo={bookingInfo}
      />
    </div>
  );
}

export default Step1Form;
