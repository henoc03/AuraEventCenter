import React, {useEffect, useState } from "react";
import AlertMessage from "../components/common/AlertMessage.jsx"
import Header from '../components/common/Header.jsx';
import SideNav from '../components/common/SideNav.jsx';
import RoomCard from '../components/common/RoomCard.jsx';
import AddEditRoomModal from '../components/common/AddEditRoomModal.jsx';
import RoomPhoto from '../assets/images/salas/sala2.png'
import '../style/rooms-admin.css'
import {jwtDecode} from 'jwt-decode';
import { useNavigate } from "react-router-dom";

const DEFAULT_ROUTE = "http://localhost:1522";

function RoomsAdmin({sections}) {
  const [isAddEditOpen, setIsAddEditOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [lastname, setLastname] = useState("");
  const [role, setRole] = useState("");
  const [zones, setZones] = useState([]);
  const [showSuccess, setShowSuccess] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    getSetUserInfo();
  }, []);

  // Función para obtener información del usuario
  const getSetUserInfo = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      return;
    }

    const sessionUserData = jwtDecode(token);

    try {
      const res = await fetch(`${DEFAULT_ROUTE}/users/${sessionUserData.id}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!res.ok) {
        const errorData = await res.json();
        alert(errorData.message || 'Error traer la información de usuario');
        return;
      }

      const userData = await res.json();

      // Guarda los datos traidos
      setName(userData.FIRST_NAME)
      setEmail(userData.EMAIL)
      setLastname(userData.LAST_NAME_1)
      setRole(userData.USER_TYPE)

      getZones();
    } catch {
      alert('Ocurrió un error al obtener la información de usuario.');
      navigate('/login');
    } 
  };

  // Función para obtener información del usuario
  const getZones = async () => {
    try {
      const res = await fetch(`${DEFAULT_ROUTE}/zones/`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!res.ok) {
        const errorData = await res.json();
        alert(errorData.message || 'Error traer la información de usuario');
        return;
      }

      const zonesData = await res.json();
      setZones(zonesData)

      // Cambia el estado de la página
      setLoading(false);
    } catch {
      alert('Ocurrió un error al obtener la información de usuario.');
      navigate('/login');
    } finally {
      () => setLoading(false)
    }
  };


  if(!loading) {return (
    <>
   
      <Header name={name} lastname={lastname} role={role} email={email}>
        <SideNav id="side-nav-mobile" sections={sections} />
      </Header>
 

      <div className={`main-container ${isAddEditOpen ? 'modal-open' : ''}`}>
        <div id="side-nav-desktop">
          <SideNav sections={sections} />
        </div>

        {showSuccess && (
          <AlertMessage
            message={"Información actualizada con éxito"}
            type={"alert-floating"}
            onClose={() => setShowSuccess(false)}
            duration={3000}
            className={"success"}
          />
        )}
        
        <div className='add-button-rooms-container'>
          <div className='title-button-container'>
            <h1>Salas</h1>
            <button className="add-room-button" onClick={() => setIsAddEditOpen(!isAddEditOpen)}>Agregar Sala</button>
          </div>

          <main className="rooms-container">
            {zones.map((zone, index) => (
              <RoomCard 
                key={index}
                id={zone.ZONE_ID}
                name={zone.NAME} 
                image={RoomPhoto} 
                state={zone.ACTIVE} 
                capacity={zone.CAPACITY} 
                price={zone.PRICE}
                type={zone.TYPE} 
                description={zone.DESCRIPTION}
              />
            ))}
          </main>
        </div>

        {/* Modal */}
        {isAddEditOpen && (
          <AddEditRoomModal 
            isModalOpen={true} 
            onClose={() => {setIsAddEditOpen(false); getZones()}} 
            isAdd={true}
          />
        )}
      </div>
    </>
  )}
}

export default RoomsAdmin;