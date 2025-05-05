import React, { useState } from 'react';
import { Dropdown } from 'react-bootstrap';
import Header from '../components/common/Header.jsx';
import SideNav from '../components/common/SideNav.jsx';
import RoomCard from '../components/common/RoomCard.jsx';
import AddEditRoomModal from '../components/common/AddEditRoomModal.jsx';
import RoomPhoto from '../assets/images/salas/sala2.png'
import '../style/rooms-admin.css'

function RoomsAdmin({sections}) {
  const [isAddEditOpen, setIsAddEditOpen] = useState(false);

  return (
    <>
   
      <Header>
        <SideNav id="side-nav-mobile" sections={sections} />
      </Header>
 

      <div className={`main-container ${isAddEditOpen ? 'modal-open' : ''}`}>
        <div id="side-nav-desktop">
          <SideNav sections={sections} />
        </div>
        
        <div className='add-button-rooms-container'>
          <div className='title-button-container'>
            <h1>Salas</h1>
            <button className="add-room-button" onClick={() => setIsAddEditOpen(!isAddEditOpen)}>Agregar Sala</button>
          </div>

          <main className="rooms-container">
            <RoomCard 
              name="Sala Grecia" 
              image={RoomPhoto} 
              state={true} 
              capacity={300} 
              type={"Recreativa"} 
              description={"Diseñada para inspirar, Grecia combina elegancia y practicidad, siendo perfecta para conferencias, seminarios y presentaciones. Su espacio adaptable permite recibir hasta 300 personas cómodamente."}
            />

            <RoomCard 
              name="Sala Grecia" 
              image={RoomPhoto} 
              state={true} 
              capacity={300} 
              type={"Recreativa"} 
              description={"Diseñada para inspirar, Grecia combina elegancia y practicidad, siendo perfecta para conferencias, seminarios y presentaciones. Su espacio adaptable permite recibir hasta 300 personas cómodamente."}
            />
            <RoomCard 
              name="Sala Grecia" 
              image={RoomPhoto} 
              state={true} 
              capacity={300} 
              type={"Recreativa"} 
              description={"Diseñada para inspirar, Grecia combina elegancia y practicidad, siendo perfecta para conferencias, seminarios y presentaciones. Su espacio adaptable permite recibir hasta 300 personas cómodamente."}
            />
            
            <RoomCard 
              name="Sala Grecia" 
              image={RoomPhoto} 
              state={true} 
              capacity={300} 
              type={"Recreativa"} 
              description={"Diseñada para inspirar, Grecia combina elegancia y practicidad, siendo perfecta para conferencias, seminarios y presentaciones. Su espacio adaptable permite recibir hasta 300 personas cómodamente."}
            />
          </main>
        </div>

        {/* Modal */}
        {isAddEditOpen && (
          <AddEditRoomModal 
            isModalOpen={true} 
            onClose={() => setIsAddEditOpen(false)} 
          />
        )}
      </div>
    </>
  )
}

export default RoomsAdmin;