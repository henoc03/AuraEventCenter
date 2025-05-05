import React, { useState } from 'react';
import Header from '../components/common/Header';
import SideNav from '../components/common/SideNav';
import '../style/privacy.css'

function Privacy({sections}) {
  const [isCookiesOn, setIsCookiesOn] = useState(false);
  const [isNewsOn, setIsNewsOn] = useState(false);
  const [isNotificationsOn, setIsNotificationsOn] = useState(false);

  return (
    <>
      <Header>
        {/*Menu de hamburguesa*/}
        <SideNav id="side-nav-mobile" sections={sections} />
      </Header>

      <div className="main-container">
        <div id="side-nav-desktop">
          <SideNav sections={sections} />
        </div>

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