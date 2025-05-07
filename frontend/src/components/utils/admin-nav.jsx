import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faTableColumns, faBookmark, faBellConcierge, faChampagneGlasses, faCalendar, faChartPie, faGear } from '@fortawesome/free-solid-svg-icons';

const SectionAdmin = [
  {
    title: 'GENERAL',
    links: [
      { id: 1, label: 'Tablero', icon: <FontAwesomeIcon icon={faTableColumns} />, href: '/admin/tablero' },
      { id: 2, label: 'Reservas', icon: <FontAwesomeIcon icon={faBookmark} />, href: '/admin/reservas' },
      { id: 3, label: 'Salas', icon: <FontAwesomeIcon icon={faBellConcierge} />, href: '/admin/salas' },
      { id: 4, label: 'Servicios', icon: <FontAwesomeIcon icon={faChampagneGlasses} />, href: '/admin/servicios' },
      { id: 5, label: 'Clientes', icon: <FontAwesomeIcon icon={faUser} />, href: '/admin/clientes' }
    ],
  },
  {
    title: 'HERRAMIENTAS',
    links: [
      { id: 8, label: 'Calendario', icon: <FontAwesomeIcon icon={faCalendar} />, href: '/admin/calendario' },
      { id: 9, label: 'Gráficas', icon: <FontAwesomeIcon icon={faChartPie} />, href: '/admin/graficas' },
    ],
  },
  {
    title: 'SOPORTE',
    links: [
      { id: 10, label: 'Ajustes', icon: <FontAwesomeIcon icon={faGear} />, href: '/admin/ajustes' },
    ],
  },
];

export default SectionAdmin;
