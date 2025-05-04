import React from 'react';
import Header from '../components/common/Header.jsx';
import SideBar from '../components/common/SideBar.jsx';
import RoomCard from '../components/common/RoomCard.jsx';
import RoomPhoto from '../assets/images/salas/sala2.png'
import '../style/roomsAdmin.css'

function RoomsAdmin() {
  return (
    <>
      <Header className="header">
        {/*Menu de hamburguesa*/}
        <h3>GENERAL</h3>
          <ul>
            <li><a href="/dashboard"><i class="bi bi-bar-chart-line"></i><span>Tablero</span></a></li>
            <li><a href="/*"><i class="bi bi-journal-bookmark-fill"></i><span>Reservas</span></a></li>
            <li><a href="/rooms-admin"><i class="bi bi-houses-fill"></i><span>Salas</span></a></li>
            <li><a href="/*"><i class="bi bi-cup-straw"></i><span>Servicios</span></a></li>
            <li><a href="/*"><i class="bi bi-headset"></i><span>Proveedores</span></a></li>
            <li><a href="/*"><i class="bi bi-person-fill"></i><span>Clientes</span></a></li>
          </ul>

          <hr />

          <h3>HERRAMIENTAS</h3>
          <ul>
            <li><a href="/*"><i class="bi bi-calendar-check-fill"></i><span>Calendario</span></a></li>
            <li><a href="/*"><i class="bi bi-graph-up"></i><span>Graficas</span></a></li>
          </ul>

          <hr />

          <h3>AJUSTES</h3>
          <ul>
            <li><a href="/*"><i class="bi bi-gear"></i><span>Soporte</span></a></li>
          </ul>
      </Header>

      <div className="main-container">
        <SideBar className="side-bar">
          <h3>GENERAL</h3>
          <ul>
            <li><a href="/dashboard"><i class="bi bi-bar-chart-line"></i><span>Tablero</span></a></li>
            <li><a href="/*"><i class="bi bi-journal-bookmark-fill"></i><span>Reservas</span></a></li>
            <li><a href="/rooms-admin"><i class="bi bi-houses-fill"></i><span>Salas</span></a></li>
            <li><a href="/*"><i class="bi bi-cup-straw"></i><span>Servicios</span></a></li>
            <li><a href="/*"><i class="bi bi-headset"></i><span>Proveedores</span></a></li>
            <li><a href="/*"><i class="bi bi-person-fill"></i><span>Clientes</span></a></li>
          </ul>

          <hr />

          <h3>HERRAMIENTAS</h3>
          <ul>
            <li><a href="/*"><i class="bi bi-calendar-check-fill"></i><span>Calendario</span></a></li>
            <li><a href="/*"><i class="bi bi-graph-up"></i><span>Graficas</span></a></li>
          </ul>

          <hr />

          <h3>AJUSTES</h3>
          <ul>
            <li><a href="/*"><i class="bi bi-gear"></i><span>Soporte</span></a></li>
          </ul>
        </SideBar>
        
        <div className='add-button-rooms-container'>
          <div className='title-button-container'>
            <h1>Salas</h1>
            <button className="add-room-button">Agregar Sala</button>
          </div>

          <main className="rooms-container">
            <RoomCard name="Sala Grecia" image={RoomPhoto} state={true}/>
            <RoomCard name="Sala Grecia" image={RoomPhoto} state={true}/>
            <RoomCard name="Sala Grecia" image={RoomPhoto} state={true}/>
            <RoomCard name="Sala Grecia" image={RoomPhoto} state={true}/>
          </main>
        </div>
      </div>
    </>
  )
}

export default RoomsAdmin;