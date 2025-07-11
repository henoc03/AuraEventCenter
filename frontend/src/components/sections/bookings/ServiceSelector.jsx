import React, { useState, useEffect } from "react";
import Filters from "../../common/Filters.jsx";
import Pagination from "../../common/Pagination.jsx";
import CompactService from "../../common/CompactService.jsx";
import CompactMenu from "../../common/CompactMenu.jsx";
import CompactEquipment from "../../common/CompactEquipment.jsx";

function ServiceSelector({
  allServices,
  allZones,
  allMenus,
  allEquipments,
  selectedRooms,
  selectedServices,
  setSelectedServices,
  selectedMenus,
  setSelectedMenus,
  selectedEquipments,
  setSelectedEquipments,
  onNext,
  onBack,
}) {
  const [currentRoomIndex, setCurrentRoomIndex] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [currentElements, setCurrentElements] = useState([]);

  const [showMenusModal, setShowMenusModal] = useState(false);
  const [showEquipmentsModal, setShowEquipmentsModal] = useState(false);
  const [modalCurrentElements, setModalCurrentElements] = useState([]);
  const [modalTotalPages, setModalTotalPages] = useState(1);
  const [modalCurrentPage, setModalCurrentPage] = useState(1);

  const [newServices, setNewServices] = useState({});
  const [newMenus, setNewMenus] = useState({});
  const [newEquipments, setNewEquipments] = useState({});

  const currentRoom = String(selectedRooms[currentRoomIndex] || "");
  const currentServices = selectedServices?.[currentRoom] || [];
  const currentMenus = selectedMenus?.[currentRoom] || [];
  const currentEquipments = selectedEquipments?.[currentRoom] || [];


const handleIncrease = (id) => {
  const roomId = selectedRooms[currentRoomIndex];
  setSelectedMenus((prev) => {
    const roomMenus = prev[roomId] || [];
    const found = roomMenus.find((m) => m.ID_MENU === id);
    let updatedRoomMenus;

    if (found) {
      updatedRoomMenus = roomMenus.map((m) =>
        m.ID_MENU === id ? { ...m, CANTIDAD: m.CANTIDAD + 1 } : m
      );
    } else {
      updatedRoomMenus = [...roomMenus, { ID_MENU: id, CANTIDAD: 1 }];
    }

    return {
      ...prev,
      [roomId]: updatedRoomMenus,
    };
  });
};


const handleDecrease = (id) => {
  const roomId = selectedRooms[currentRoomIndex];
  setSelectedMenus((prev) => {
    const roomMenus = prev[roomId] || [];
    const found = roomMenus.find((m) => m.ID_MENU === id);
    let updatedRoomMenus;

    if (found && found.CANTIDAD > 1) {
      updatedRoomMenus = roomMenus.map((m) =>
        m.ID_MENU === id ? { ...m, CANTIDAD: m.CANTIDAD - 1 } : m
      );
    } else {
      updatedRoomMenus = roomMenus.filter((m) => m.ID_MENU !== id);
    }

    return {
      ...prev,
      [roomId]: updatedRoomMenus,
    };
  });
};



    useEffect(() => {
    const roomId = selectedRooms[currentRoomIndex];
    const cateringService = allServices.find(s => s.name?.toLowerCase().includes("catering"));
    if (cateringService) {
        const hasMenus = selectedMenus[roomId]?.length > 0;
        const isSelected = selectedServices[roomId]?.includes(cateringService.ID);
        if (!hasMenus && isSelected) {
        setSelectedServices(prev => ({
            ...prev,
            [roomId]: prev[roomId].filter(id => id !== cateringService.ID)
        }));
        }
    }
    }, [selectedMenus, currentRoomIndex]);

    useEffect(() => {
    const roomId = selectedRooms[currentRoomIndex];
    const equipmentService = allServices.find(s => s.name?.toLowerCase().includes("equipos"));
    if (equipmentService) {
        const hasEquipments = selectedEquipments[roomId]?.length > 0;
        const isSelected = selectedServices[roomId]?.includes(equipmentService.ID);
        if (!hasEquipments && isSelected) {
        setSelectedServices(prev => ({
            ...prev,
            [roomId]: prev[roomId].filter(id => id !== equipmentService.ID)
        }));
        }
    }
    }, [selectedEquipments, currentRoomIndex]);


  const handleServiceClicked = (service) => {
    const isCatering = service.name.toLowerCase().includes("catering");
    const isEquipos = service.name.toLowerCase().includes("equipos");

    const serviceID = service.ID;
    const roomId = selectedRooms[currentRoomIndex];
    const isOriginal = (selectedServices[roomId] || []).includes(serviceID);
    const isNew = (newServices[roomId] || []).includes(serviceID);

    if ((isCatering || isEquipos) && (isOriginal || isNew)) {
      if (isCatering) setShowMenusModal(true);
      if (isEquipos) setShowEquipmentsModal(true);
      return;
    }

    if (isCatering) setShowMenusModal(true);
    if (isEquipos) setShowEquipmentsModal(true);

    setSelectedServices(prev => {
      const current = prev[roomId] || [];
      if (current.includes(serviceID)) {
        return { ...prev, [roomId]: current.filter(id => id !== serviceID) };
      } else {
        return { ...prev, [roomId]: [...current, serviceID] };
      }
    });
    setNewServices(prev => {
      const current = prev[roomId] || [];
      if (current.includes(serviceID)) {
        return { ...prev, [roomId]: current.filter(id => id !== serviceID) };
      } else {
        return { ...prev, [roomId]: [...current, serviceID] };
      }
    });
  };

const handleMenuClicked = (menuID) => {
  const roomId = selectedRooms[currentRoomIndex];
  const current = selectedMenus[roomId] || [];
  const exists = current.find((m) => m.ID_MENU === menuID);

  if (!exists) {
    setSelectedMenus(prev => ({
      ...prev,
      [roomId]: [...current, { ID_MENU: menuID, CANTIDAD: 1 }]
    }));
  }
  
  // También activar el servicio de catering si no está
  const cateringService = allServices.find(s => s.name?.toLowerCase().includes("catering"));
  if (cateringService) {
    setSelectedServices(prev => {
      const current = prev[roomId] || [];
      if (!current.includes(cateringService.ID)) {
        return { ...prev, [roomId]: [...current, cateringService.ID] };
      }
      return prev;
    });
  }
};

const handleQuantityChange = (menuID, newQuantity) => {
  const roomId = selectedRooms[currentRoomIndex];
  if (newQuantity < 1) {
    // Si cantidad es menor que 1, eliminar menú
    setSelectedMenus(prev => {
      const roomMenus = prev[roomId] || [];
      return {
        ...prev,
        [roomId]: roomMenus.filter((m) => m.ID_MENU !== menuID),
      };
    });
  } else {
    // Actualizar cantidad
    setSelectedMenus(prev => {
      const roomMenus = prev[roomId] || [];
      const found = roomMenus.find((m) => m.ID_MENU === menuID);
      if (found) {
        return {
          ...prev,
          [roomId]: roomMenus.map((m) =>
            m.ID_MENU === menuID ? { ...m, CANTIDAD: newQuantity } : m
          ),
        };
      } else {
        // Si no existe, agregarlo con la cantidad
        return {
          ...prev,
          [roomId]: [...roomMenus, { ID_MENU: menuID, CANTIDAD: newQuantity }],
        };
      }
    });
  }
};

  const handleEquipmentClicked = (equipmentID) => {
    const roomId = selectedRooms[currentRoomIndex];
    const isOriginal = (selectedEquipments[roomId] || []).includes(equipmentID);
    const isNew = (newEquipments[roomId] || []).includes(equipmentID);

    setSelectedEquipments(prev => {
    const current = prev[roomId] || [];
    if (current.includes(equipmentID)) {
    return { ...prev, [roomId]: current.filter(id => id !== equipmentID) };
    } else {
    return { ...prev, [roomId]: [...current, equipmentID] };
    }
    });
    setNewEquipments(prev => {
      const current = prev[roomId] || [];
      if (current.includes(equipmentID)) {
        return { ...prev, [roomId]: current.filter(id => id !== equipmentID) };
      } else {
        return { ...prev, [roomId]: [...current, equipmentID] };
      }
    });
    if (!isOriginal && !isNew) {
  const equipmentService = allServices.find(s => s.name?.toLowerCase().includes("equipos"));
  if (equipmentService) {
    setSelectedServices(prev => {
      const current = prev[roomId] || [];
      if (!current.includes(equipmentService.ID)) {
        return { ...prev, [roomId]: [...current, equipmentService.ID] };
      }
      return prev;
    });
  }
}

  };

  const handleCloseModal = () => {
    setShowMenusModal(false);
    setShowEquipmentsModal(false);
    setModalCurrentPage(1);
    setModalTotalPages(1);
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [currentRoomIndex, allServices]);

  return (
    <div className="booking-client-step3">
      <p>Servicios para: <strong>{allZones.find(z => z.ZONE_ID === selectedRooms[currentRoomIndex])?.NAME || `Sala ${currentRoomIndex + 1}`}</strong></p>


      <Filters
        allElements={allServices}
        selectedElements={currentServices}
        setCurrentElements={setCurrentElements}
        setTotalPages={setTotalPages}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        getName={(el) => el?.name || ""}
        getType={(el) => el?.type || ""}
        getId={(el) => el?.ID || ""}
        getPrice={(el) => el?.price || 0}
      />

      <div className="elements-counter">
        <p>Selecciona los servicios para esta sala.</p>
        <p>Servicios seleccionados: {currentServices.length}</p>
      </div>

      <div className="edit-booking-grid">
        {currentElements.map((service) => {
          const isSelected = currentServices.includes(service.ID);
          const isNew = currentServices.includes(service.ID);
                let cardStyle = {};
                            if (!isSelected) {
                              cardStyle = { opacity: "100%" };
                            } else if (isSelected) {
                              cardStyle = { opacity: "50%" };
                            }
          return (
            <div
              key={service.ID}
              className={`edit-booking-card${isSelected ? " edit-booking-selected-card" : ""}`}
              onClick={() => handleServiceClicked(service)}
              style={cardStyle}
            >
              <CompactService service={service} isBooking={true} isSelected={isSelected} isNew={isNew}/>
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

      {showMenusModal && (
        <div className="booking-menus-modal">
          <div className="booking-menus-content">
            <div className="booking-menus-title-x">
              <h1>Selecciona los menús</h1>
              <button onClick={handleCloseModal}>x</button>
            </div>

            <Filters
              allElements={allMenus}
              selectedElements={currentMenus}
              setCurrentElements={setModalCurrentElements}
              setTotalPages={setModalTotalPages}
              currentPage={modalCurrentPage}
              setCurrentPage={setModalCurrentPage}
              getName={(el) => el?.NAME || ""}
              getType={(el) => el?.TYPE || ""}
              getId={(el) => el?.MENU_ID || ""}
              getPrice={(el) => el?.PRICE || 0}
            />

          <div className="edit-booking-grid">
            {modalCurrentElements.map((menu) => {
              const isSelected = currentMenus.some(m => m.ID_MENU === menu.MENU_ID);
              const isNew = newMenus[currentRoom]?.includes(menu.MENU_ID);
              const menuEntry = currentMenus.find(m => m.ID_MENU === menu.MENU_ID);
              const quantity = menuEntry ? menuEntry.CANTIDAD : 0;

              let cardStyle = {};
              if (!isSelected) {
                cardStyle = { opacity: "100%" };
              } else if (isSelected) {
                cardStyle = { opacity: "50%" };
              }

              return (
                <div
                  key={menu.MENU_ID}
                  className={`edit-booking-card${isSelected ? " edit-booking-selected-card" : ""}`}
                  style={cardStyle}
                >
                  <CompactMenu
                    menu={menu}
                    isBooking={true}
                    isSelected={isSelected}
                    isNew={isNew}
                    quantity={quantity}
                    onIncrease={() => handleIncrease(menu.MENU_ID)}
                    onDecrease={() => handleDecrease(menu.MENU_ID)}
                    onQuantityChange={handleQuantityChange}
                  />
                </div>
              );
            })}
          </div>

            <button
              className={`add-menu-booking-button`}
              type="button"
              onClick={handleCloseModal}
            >
              Agregar
            </button>

            {modalTotalPages > 1 && (
              <Pagination
                currentPage={modalCurrentPage}
                totalPages={modalTotalPages}
                onPageChange={setModalCurrentPage}
              />
            )}
          </div>
        </div>
      )}

      {showEquipmentsModal && (
        <div className="booking-menus-modal">
          <div className="booking-menus-content">
            <div className="booking-menus-title-x">
              <h1>Selecciona los equipos</h1>
              <button onClick={handleCloseModal}>x</button>
            </div>

            <Filters
              allElements={allEquipments}
              selectedElements={currentEquipments}
              setCurrentElements={setModalCurrentElements}
              setTotalPages={setModalTotalPages}
              currentPage={modalCurrentPage}
              setCurrentPage={setModalCurrentPage}
              getName={(el) => el?.name || ""}
              getType={(el) => el?.type || ""}
              getId={(el) => el?.ID || ""}
              getPrice={(el) => el?.unitaryPrice || 0}
            />

            <div className="edit-booking-grid">
              {modalCurrentElements.map((equipment) => {
                const isSelected = currentEquipments.includes(equipment.ID);
                const isNew = currentEquipments.includes(equipment.ID);
                let cardStyle = {};
                            if (!isSelected) {
                              cardStyle = { opacity: "100%" };
                            } else if (isSelected) {
                              cardStyle = { opacity: "50%" };
                            }
                return (
                  <div
                    key={equipment.ID}
                    className={`edit-booking-card${isSelected ? " edit-booking-selected-card" : ""}`}
                    onClick={() => handleEquipmentClicked(equipment.ID)}
                    style={cardStyle}
                  >
                    <CompactEquipment equipment={equipment} isBooking={true} isSelected={isSelected} isNew={isNew} />
                  </div>
                );
              })}
            </div>

            {modalTotalPages > 1 && (
              <Pagination
                currentPage={modalCurrentPage}
                totalPages={modalTotalPages}
                onPageChange={setModalCurrentPage}
              />
            )}
          </div>
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem' }}>
        <button
          type="button"
          className="booking-next-step-button active"
          onClick={() => {
            if (currentRoomIndex === 0) {
              onBack();
            } else {
              setCurrentRoomIndex(i => i - 1);
            }
          }}
        >
          {currentRoomIndex === 0 ? "Volver" : "Anterior sala"}
        </button>


        <button
          type="button"
          className="booking-next-step-button active"
          onClick={() => {
            if (currentRoomIndex < selectedRooms.length - 1) {
              setCurrentRoomIndex(i => i + 1);
            } else {
              onNext();
            }
          }}
        >
          {currentRoomIndex < selectedRooms.length - 1 ? "Siguiente sala" : "Siguiente"}
        </button>
      </div>
    </div>
  );
}

export default ServiceSelector;
