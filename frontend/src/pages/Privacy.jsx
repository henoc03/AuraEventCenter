import React, { useState } from 'react';
import Header from '../components/common/Header';
import SideBar from '../components/common/SideBar';
import '../style/privacy.css'

function Privacy() {
  const [isCookiesOn, setIsCookiesOn] = useState(false);
  const [isNewsOn, setIsNewsOn] = useState(false);
  const [isNotificationsOn, setIsNotificationsOn] = useState(false);

  return (
    <>
      <Header>
        {/*Menu de hamburguesa*/}
        <ul>
          <li><a href="/profile"><i className="bi bi-person-fill"></i><span>Perfil</span></a></li>
          <li><a href="/account"><i className="bi bi-gear"></i><span>Cuenta</span></a></li>
          <li><a href="/privacy"><i className="bi bi-lock-fill"></i><span>Privacidad</span></a></li>
          <li><a href="/*"><i className="bi bi-bell-fill"></i><span>Notificaciones</span></a></li>
          <li><a href="/*"><i className="bi bi-eye"></i><span>Apariencia</span></a></li>
        </ul>
      </Header>

      <div className="main-container">
        <SideBar className="side-bar">
          <ul>
            <li><a href="/profile"><i className="bi bi-person-fill"></i><span>Perfil</span></a></li>
            <li><a href="/account"><i className="bi bi-gear"></i><span>Cuenta</span></a></li>
            <li><a href="/privacy"><i className="bi bi-lock-fill"></i><span>Privacidad</span></a></li>
            <li><a href="/*"><i className="bi bi-bell-fill"></i><span>Notificaciones</span></a></li>
            <li><a href="/*"><i className="bi bi-eye"></i><span>Apariencia</span></a></li>
          </ul>
        </SideBar>

        <main className="main">
          <div className='inside-container'>
            <h1>Configuración de privacidad</h1>

            <div className="settings-container">
              <div className="options">
                <div className="option">
                  <p>Permitir uso de cookies en el sitio web.</p>
                  <div class="form-check form-switch">
                    <input class="form-check-input" type="checkbox" role="switch" id="switch-cookies" onClick={() => setIsCookiesOn(!isCookiesOn)}/>
                    <label class="form-check-label" for="switch-cookies"></label>
                  </div>
                </div>

                <div className="option">
                  <p>Recibir noticias sobre el centro de eventos y la empresa.</p>
                  <div class="form-check form-switch">
                    <input class="form-check-input" type="checkbox" role="switch" id="switch-news" onClick={() => setIsNewsOn(!isNewsOn)}/>
                    <label class="form-check-label" for="switch-news"></label>
                  </div>
                </div>

                <div className="option">
                  <p>Recibir promociones relacionadas eventos, salas, servicios, etc.</p>
                  <div class="form-check form-switch">
                    <input class="form-check-input" type="checkbox" role="switch" id="switch-notifications" onClick={() => setIsNotificationsOn(!isNotificationsOn)}/>
                    <label class="form-check-label" for="switch-notifications"></label>
                  </div>
                </div>
              </div>

              <button type="submit">Guardar</button>
            </div>
          </div>
        </main>
      </div>
    </>
  )
}

export default Privacy;