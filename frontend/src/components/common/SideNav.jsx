import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import '../../style/admin-dashboard.css';

export default function SideNav({ sections = [] }) {
  const location = useLocation();
  const navigate = useNavigate();

  const handleClick = (href) => navigate(href);

  return (
    <aside className="sidenav">
      <div className="logo">Aura Event Center</div>
      {sections.map(({ title, links }, index) => (
        <div key={title}>
          {index !== 0 && <hr className="sidenav-divider" />}
          <h4 className="sidenav-title">{title}</h4>
          <ul className="sidenav-list">
            {links.map(({ id, label, href }) => (
              <li key={id} className={location.pathname === href ? 'active' : ''}>
                <button onClick={() => handleClick(href)}>{label}</button>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </aside>
  );
}
