import { useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import { es } from 'date-fns/locale';
import Calendar from 'react-calendar';
import Header from '../components/common/Header';
import SideNav from '../components/common/SideNav';
import 'react-calendar/dist/Calendar.css';
import '../style/CalendarView.css';

const statusColors = {
  pendiente: '#ffcc00',
  en_progreso: '#4caf50',
  completada: '#2196f3',
  cancelada: '#f44336'
};

const PORT = "http://localhost:1522";

const CalendarView = ({ sections }) => {
  const [value, setValue] = useState(new Date());
  const [events, setEvents] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const fetchUserInfo = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const decoded = jwtDecode(token);
        const now = Date.now();

        if (decoded.exp && now < decoded.exp * 1000) {
          const res = await fetch(`${PORT}/users/${decoded.id}`);
          if (!res.ok) throw new Error("No se pudo obtener el usuario");

          const user = await res.json();
          setCurrentUser(user);
        } else {
          localStorage.removeItem("token");
          setCurrentUser(null);
        }
      } catch (err) {
        console.error("Error al obtener el usuario:", err);
        localStorage.removeItem("token");
        setCurrentUser(null);
      }
    };

    fetchUserInfo();
  }, []);

  useEffect(() => {
    fetch(`${PORT}/calendar/getCalendar`)
      .then(res => res.json())
      .then(data => setEvents(data))
      .catch(err => console.error('Error al cargar calendario:', err));
  }, []);
const eventsOfSelectedDay = events.filter(event => {
  const eventDate = new Date(event.start);
  return (
    eventDate.getFullYear() === value.getFullYear() &&
    eventDate.getMonth() === value.getMonth() &&
    eventDate.getDate() === value.getDate()
  );
});

  const renderTileContent = ({ date }) => {
    const dayEvents = events.filter(event => {
      const eventDate = new Date(event.start);
      return (
        eventDate.getFullYear() === date.getFullYear() &&
        eventDate.getMonth() === date.getMonth() &&
        eventDate.getDate() === date.getDate()
      );
    });

    return (
      <div className="tile-events">
        {dayEvents.map(ev => (
          <span
            key={ev.id}
            className="event-dot"
            title={`Reserva ${ev.name|| ev.id} - ${ev.status}`}
            style={{ backgroundColor: statusColors[ev.status] || '#666' }}
          ></span>
        ))}
      </div>
    );
  };

  return (
    <div className="calendar-page">
      <Header
        name={currentUser?.FIRST_NAME}
        lastname={currentUser?.LAST_NAME_1}
        role={currentUser?.USER_TYPE}
        email={currentUser?.EMAIL}
      />
      <div className="calendar-dashboard">
        <SideNav sections={sections} />
        <main className="calendar-dashboard-content">
            <div className="calendar-content-wrapper">
            <h2>Calendario de Reservas</h2>
            <Calendar
                onChange={setValue}
                value={value}
                tileContent={renderTileContent}
                locale="es-ES" 
            />
            
            <div className="event-list">
                <h3>Eventos para {value.toLocaleDateString()}</h3>
                {eventsOfSelectedDay.length === 0 ? (
                <p>No hay eventos para este día.</p>
                ) : (
                <ul>
                    {eventsOfSelectedDay.map(ev => (
                    <li key={ev.id} style={{borderLeftColor: statusColors[ev.status]}}>
                        <strong>{ev.name || ev.id}</strong>
                        <span className="event-time">
                            {new Date(ev.start).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} 
                            {' a '}
                            {new Date(ev.end).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                        </span>
                        </li>

                    ))}
                </ul>
                )}
            </div>
            </div>

        </main>
      </div>
    </div>
  );
};

export default CalendarView;
