import React, { useEffect, useState } from 'react';
import Logo from '../icons/Logo.jsx';
import ProfilePhoto from '../icons/ProfilePhoto.jsx'

const DEFAULT_ROUTE = 'http://localhost:3000'

function Header() {
  const [currentUser, setCurrentUser] = useState([]);

  useEffect(() => {
    fetch(`${DEFAULT_ROUTE}/api/current_user`)
     .then(res=>res.json())
     .then(data => setCurrentUser(data))
     .catch(error => console.error('Error fetching user data:', error));
  },[]);

  return (
    <header className='header-container'>
      <Logo/>
      <div className='right-content-container'>
        <ProfilePhoto/>
        <div className='user-info-container'>
          <h2>{/*currentUser?.name8*/}Brayan Rivera</h2>
          <p>{/*currentUser?.role != 'client' ? currentUser?.role : ''*/}Administrador</p>
        </div>
        
        {/* <button className="btn btn-primary" type="button" data-bs-toggle="collapse" data-bs-target="#collapseContent" aria-expanded="false" aria-controls="collapseContent">
          <i class="bi bi-chevron-down"></i>
        </button>

        <div className="collapse" id="collapseContent">
          <div>

          </div>
        </div> */}

        <div className="accordion" id="accordionContainer">
          <div className="accordion-item">
            <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne"></button>
          
            <div id="collapseOne" className="accordion-collapse collapse show" aria-labelledby="headingOne" data-bs-parent="#accordionContainer">
              <div className='accordion-user-info'>
                <p className='user-email'>
                  {/*currentUser?.role != 'client' ? currentUser?.role : ''*/}
                  BrayanRivera@gmail.com
                </p>
                <ProfilePhoto/>
                <p>{/*`Hola, ${currentUser?.username}`*/}¡Hola, Brayan!</p>

                <div className='options'>
                  <a href="">Gestiona tu cuenta</a>
                  <a href="/">Cerrar sesión</a>
                </div>
              </div>
            </div>
          </div>
        <div/>

        </div>
      </div>
    </header>
  )
}

export default Header;