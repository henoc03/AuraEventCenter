import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import '../../style/side-nav.css';

export default function SideNav({ sections = [] }) {
  const location = useLocation();
  const navigate = useNavigate();

  const handleClick = (href) => navigate(href);

  return (
    <aside className="sidenav">
      {sections.map(({ title, links }, index) => (
        <div key={title || index}>
          {index !== 0 && <hr className="sidenav-divider" />}
          {title && <h4 className="sidenav-title">{title}</h4>}
          <ul className="sidenav-list">
            {links.map(({ id, label, href, icon }) => {
              const isActive = location.pathname.startsWith(href);
              return (
                <li key={id} className={isActive ? 'active' : ''}>
                  <button onClick={() => handleClick(href)} className="sidenav-button">
                    <span className="sidenav-icon">{icon}</span>
                    <span>{label}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </aside>
  );
}

