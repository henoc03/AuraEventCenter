import ProfilePhoto from '../icons/ProfilePhoto.jsx'
import '../../style/drop-down-menu.css'

function DropDownMenu({ name, email, onLogout }) {
  return (
    <div className="dropdown profile-dropdown">
      <button className="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
        <ProfilePhoto width={55} height={55}/>
      </button>
      <ul className="dropdown-menu">
        <p>{`¡Hola, ${name}!`}</p>
        <p>{email}</p>
        <ProfilePhoto width={80} height={80}/>
        <li><a class="dropdown-item" href="/">Inicio</a></li>
        <li><a class="dropdown-item" href="/perfil">Perfil</a></li>
        <li><a class="dropdown-item" href="/" onClick={onLogout}>Cerrar sesion</a></li>
      </ul>
    </div>

  )
}

export default DropDownMenu;
