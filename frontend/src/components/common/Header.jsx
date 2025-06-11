import React, { useEffect, useState } from 'react';
import Logo from '../icons/Logo.jsx';
import DropDownMenu from './DropDownMenu.jsx'; 
import { useNavigate} from 'react-router-dom';
import '../../style/header.css'

const DEFAULT_ROUTE = 'http://localhost:1522'

function Header({name, lastname, role, email, sections = []}) {
  const [isMobile, setIsMobile] = useState(false);
  const navigate = useNavigate();

  const handleClick = (href) => navigate(href);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <header className='header-container'>
      <a href="/"><Logo className='logo'/></a>

      <div className='drop-down-menus-container'>
        {/*Menu de hamburguesa*/}
        {isMobile && (
          <div className="dropdown admin-dropdown">
            <button className="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
              <i className="bi bi-list"></i>
            </button>
            <ul className="dropdown-menu">
              {sections.map(({ title, links }, index) => (
                <React.Fragment key={title || index}>
                  {index !== 0 && <li><hr className="sidenav-divider" /></li>}
                  {title && <li className="sidenav-title">{title}</li>}
                  {links.map(({ id, label, href, icon }) => {
                    const isActive = location.pathname.startsWith(href);
                    return (
                      <li key={id} className={isActive ? 'active' : ''}>
                        <button onClick={() => handleClick(href)} className="sidenav-button dropdown-item">
                          <span className="sidenav-icon">{icon}</span>
                          <span>{label}</span>
                        </button>
                      </li>
                    );
                  })}
                </React.Fragment>
              ))}
            </ul>
          </div>
        )}

        <div className='right-content-container'>
          <div className='user-info-container'>
            <h2>{`${name} ${lastname}`}</h2>
            <p>
            {role === "root admin"
              ? "Administrador Principal"
              : role === "admin"
              ? "Administrador"
              : "Cliente"}
          </p>
          </div>

          <DropDownMenu name={name} email={email}/>
        </div>
      </div>
    </header>
  )
}

export default Header;