import React, { useState, useEffect } from "react";
import Filters from "../../common/Filters.jsx";
import Pagination from "../../common/Pagination.jsx";
import CompactRoom from "../../common/CompactRoom.jsx";

function RoomSelector({ allZones, selectedRooms, setSelectedRooms, onNext, onBack }) {
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [currentElements, setCurrentElements] = useState([]);

  const handleRoomClicked = (roomID) => {
    setSelectedRooms(prev =>
      prev.includes(roomID)
        ? prev.filter(id => id !== roomID)
        : [...prev, roomID]
    );
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [allZones]);

  return (
    <div className="booking-client-step2">
      <Filters
        allElements={allZones}
        selectedElements={selectedRooms}
        setCurrentElements={setCurrentElements}
        setTotalPages={setTotalPages}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        getName={el => el?.NAME || ""}
        getType={el => el?.TYPE || ""}
        getId={el => el?.ZONE_ID || ""}
        getPrice={el => el?.PRICE || 0}
      />

      <div className="elements-counter">
        <p>Selecciona las salas</p>
        <p>Salas seleccionadas: {selectedRooms.length}</p>
      </div>

      <div className="edit-booking-grid">
        {currentElements.map(room => {
          const isSelected = selectedRooms.includes(room.ZONE_ID);
          const isNew = selectedRooms.includes(room.ZONE_ID);
           let cardStyle = {};
                      if ( !isSelected) {
                        cardStyle = { opacity: "100%" };
                      } else if (isSelected) {
                        cardStyle = { opacity: "50%" };
                      }
          return (
            <div
              key={room.ZONE_ID}
              className={`edit-booking-card${isSelected ? " edit-booking-selected-card" : ""}`}
              onClick={() => handleRoomClicked(room.ZONE_ID)}
              style={cardStyle}
            >
              <CompactRoom
                room={room}
                isBooking={true}
                isSelected={isSelected}
                isNew={isNew}
              />
            </div>
          );
        })}
      </div>

      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem' }}>
        <button
          type="button"
          className="booking-next-step-button active"
          onClick={onBack}
        >
          Volver
        </button>

        <button
          type="button"
          className={`booking-next-step-button ${selectedRooms.length > 0 ? "active" : ""}`}
          onClick={onNext}
          disabled={selectedRooms.length === 0}
        >
          Siguiente
        </button>
      </div>

    </div>
  );
}

export default RoomSelector;
