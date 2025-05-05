import React from 'react';
import { NavLink } from 'react-router-dom';
import "../../style/sideBar.css";

function SideBar({ userType }) {
  const links = {
    client: [
      { href: '/profile', icon: 'bi-person-fill', label: 'Perfil' },
      { href: '/cliente/cuenta', icon: 'bi-gear', label: 'Cuenta' },
      { href: '/privacy', icon: 'bi-lock-fill', label: 'Privacidad' },
      { href: '/notifications', icon: 'bi-bell-fill', label: 'Notificaciones' },
      { href: '/appearance', icon: 'bi-eye', label: 'Apariencia' },
    ],
    admin: [
      { href: '/dashboard', icon: 'bi-speedometer2', label: 'Dashboard' },
      { href: '/users', icon: 'bi-people-fill', label: 'Usuarios' },
      { href: '/events', icon: 'bi-calendar-event', label: 'Eventos' },
      { href: '/settings', icon: 'bi-sliders', label: 'Configuración' },
    ],
  };

  return (
    <div className="side-bar">
      <ul>
        {links[userType].map((link, index) => (
          <li key={index}>
            <NavLink
              to={link.href}
              className={({ isActive }) =>
                isActive ? "nav-link active" : "nav-link"
              }
            >
              <i className={`bi ${link.icon}`}></i>
              <span>{link.label}</span>
            </NavLink>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default SideBar;

