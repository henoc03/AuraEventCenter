import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faChartSimple } from '@fortawesome/free-solid-svg-icons';

import SideNav from '../components/common/SideNav';
import sections from '../components/utils/admin-nav';
import Header from '../components/common/Header';
import '../style/admin-dashboard.css';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [topRooms, setTopRooms] = useState([]);
  const [weeklyReservations, setWeeklyReservations] = useState([]);

  useEffect(() => {
    // Simulaciones iniciales
    setStats({
      users: 150,
      activeRooms: 12,
      eventsThisWeek: 3,
    });
    setTopRooms([]);
    setWeeklyReservations([]);
  }, []);

  return (
    <div className="admin-dash-page">
      <Header />
 

      <div className="admin-dashboard">
      <SideNav sections={sections} />

      <main className="dashboard-content">
  <div className="main-content">
    <h2>Panel de Administración</h2>
    <div className="dashboard-cards">
      <div className="card">
        <p>Usuarios registrados</p>
        <h3>{stats?.users ?? '-'}</h3>
      </div>
      <div className="card">
        <p>Salas activas</p>
        <h3>{stats?.activeRooms ?? '-'}</h3>
      </div>
      <div className="card">
        <p>Eventos esta semana</p>
        <h3>{stats?.eventsThisWeek ?? '-'}</h3>
      </div>
    </div>
  </div>

  <div className="dashboard-sections">
    <div className="chart-section">
      
  <div className="rooms-title"><FontAwesomeIcon icon={faChartSimple} /><h3>Salas más reservadas</h3></div>
      {topRooms.length === 0 ? (
        <div className="placeholder">Sin datos disponibles</div>
      ) : (
        <div>Gráfica aquí</div>
      )}
    </div>
  </div>

  <div className="reservations-section">
      <h3>Reservas de esta semana</h3>
              {weeklyReservations.length === 0 ? (
                <div className="placeholder">Sin reservas registradas</div>
              ) : (
                <table>
                  <thead>
                    <tr>
                      <th>Estado</th>
                      <th>Propietario</th>
                      <th>Fecha</th>
                    </tr>
                  </thead>
                  <tbody>
                    {weeklyReservations.map((r, i) => (
                      <tr key={i}>
                        <td>{r.status}</td>
                        <td>{r.owner}</td>
                        <td>{r.date}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
    )}
    <a href="/reservas" className="view-stats">Ver todas las reservas</a>
  </div>
</main>

      </div>
    </div>
  );
};

export default AdminDashboard;
