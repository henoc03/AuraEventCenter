import ProfilePhoto from '../icons/ProfilePhoto.jsx'
import '../../style/dropDownMenu.css'

function DropDownMenu({ name, email, onLogout }) {
  return (
    <div className='drop-down-menu'>
      <button 
        id="collapse-button" 
        type="button"
        className="btn btn-primary"
        data-bs-toggle="collapse"
        data-bs-target="#collapseMenu" 
        aria-expanded="false" 
        aria-controls="collapseMenu"
        style={{ marginBottom: 0 }}
      >
        <ProfilePhoto/>
      </button>

      <div 
        className="collapse submenu" 
        id="collapseMenu" 
        style={{ position: 'absolute', zIndex: 1000, top: '11vh', left: '-2vw' }}
      >
        <div className='card card-body'>
          <div className='dropdown-user-info'>
            <p className='user-email'>{email}</p>
            <ProfilePhoto width={100} height={100} className="drop-down-photo"/>
            <p>{`¡Hola, ${name}!`}</p>

            <div className='options'>
              <a href="/perfil">Inicio</a>
              <a href="/" onClick={onLogout}>Cerrar sesión</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DropDownMenu;
