// src/constants/adminNav.js
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faTableColumns, faBookmark, faBellConcierge, faChampagneGlasses, faCalendar, faChartPie, faGear } from '@fortawesome/free-solid-svg-icons';

const SectionRoot = [
  {
    title: 'GENERAL',
    links: [
      { id: 1, label: 'Tablero', icon: <FontAwesomeIcon icon={faTableColumns} />, href: '/root-admin/dashboard' },
      { id: 2, label: 'Reservas', icon: <FontAwesomeIcon icon={faBookmark} />, href: '/root-admin/reservas' },
      { id: 3, label: 'Salas', icon: <FontAwesomeIcon icon={faBellConcierge} />, href: '/root-admin/salas' },
      { id: 4, label: 'Servicios', icon: <FontAwesomeIcon icon={faChampagneGlasses} />, href: '/root-admin/servicios' },
      { id: 5, label: 'Clientes', icon: <FontAwesomeIcon icon={faUser} />, href: '/root-admin/clientes' },
      { id: 6, label: 'Administradores', icon: <FontAwesomeIcon icon={faUser} />, href: '/root-admin/administradores' }
    ],
  },
  {
    title: 'HERRAMIENTAS',
    links: [
      { id: 8, label: 'Calendario', icon: <FontAwesomeIcon icon={faCalendar} />, href: '/root-admin/calendario' },
      { id: 9, label: 'Gráficas', icon: <FontAwesomeIcon icon={faChartPie} />, href: '/root-admin/graficas' },
    ],
  },
  {
    title: 'SOPORTE',
    links: [
      { id: 10, label: 'Ajustes', icon: <FontAwesomeIcon icon={faGear} />, href: '/root-admin/ajustes' },
    ],
  },
];

export default SectionRoot;
