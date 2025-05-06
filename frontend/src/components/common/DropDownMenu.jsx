import ProfilePhoto from '../icons/ProfilePhoto.jsx'
import '../../style/dropDownMenu.css'

function DropDownMenu({name, email}) {
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
        style={{ marginBottom: 0 }}>
        <ProfilePhoto/>
      </button>

      <div className="collapse submenu" id="collapseMenu" 
      style={{ position: 'absolute', zIndex: 1000, right: '-20%', top: '96%'}}>
        <div className='card card-body'>
          <div className='dropdown-user-info'>
            <p className='user-email'>
              {email}
            </p>
            <ProfilePhoto width={100} height={100} className="drop-down-photo"/>
            <p>{`¡Hola, ${name}!`}</p>

            <div className='options'>
              <a href="/">Inicio</a>
              <a href="/">Cerrar sesión</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DropDownMenu;