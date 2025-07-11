import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChartSimple } from '@fortawesome/free-solid-svg-icons';

import SideNav from '../components/common/SideNav';
import Header from '../components/common/Header';
import LoadingPage from '../components/common/LoadingPage';

import '../style/admin-dashboard.css';

import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend
} from 'chart.js';

import { jwtDecode } from 'jwt-decode';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const PORT = "http://localhost:1522";

const AdminDashboard = ({ sections }) => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [topRooms, setTopRooms] = useState([]);
  const [weeklyReservations, setWeeklyReservations] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [statsRes, weeklyRes, topRes] = await Promise.all([
          fetch(`${PORT}/dashboard/stats`),
          fetch(`${PORT}/dashboard/weekly-reservations`),
          fetch(`${PORT}/dashboard/top-rooms`)
        ]);

        const [statsData, weeklyData, topData] = await Promise.all([
          statsRes.json(),
          weeklyRes.json(),
          topRes.json()
        ]);

        setStats(statsData);
        setWeeklyReservations(weeklyData);
        setTopRooms(topData);
      } catch (error) {
        console.error('Error al cargar dashboard:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  useEffect(() => {
    const fetchUserInfo = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const { id, exp } = jwtDecode(token);
        const now = Date.now();

        if (!exp || now >= exp * 1000) {
          localStorage.removeItem("token");
          return;
        }

        const res = await fetch(`${PORT}/users/${id}`, {
          headers: { "Content-Type": "application/json" }
        });

        if (!res.ok) throw new Error("Error al obtener usuario");

        const user = await res.json();
        setCurrentUser(user);
      } catch (err) {
        console.error("Error al obtener usuario:", err);
        localStorage.removeItem("token");
      }
    };

    fetchUserInfo();
  }, []);

  if (loading) return <LoadingPage />;

  return (
    <div className="admin-dash-page">
      <Header
        name={currentUser?.FIRST_NAME}
        lastname={currentUser?.LAST_NAME_1}
        role={currentUser?.USER_TYPE}
        email={currentUser?.EMAIL}
      />

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
              <div className="rooms-title">
                <FontAwesomeIcon icon={faChartSimple} />
                <h3>Salas más reservadas</h3>
              </div>
              {topRooms.length === 0 ? (
                <div className="placeholder">Sin datos disponibles</div>
              ) : (
                <Bar
                  data={{
                    labels: topRooms.map(room => room.roomName),

                    datasets: [
                      {
                        label: 'Reservas',
                        data: topRooms.map(room => room.reservations),
                        backgroundColor: '#1565c0',
                      }
                    ]
                  }}
                  options={{
                    indexAxis: 'y',
                    responsive: true,
                    plugins: {
                      legend: { display: false },
                      tooltip: { enabled: true }
                    },
                    scales: {
                      x: { beginAtZero: true },
                      y: { beginAtZero: true }
                    }
                  }}
                />
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
