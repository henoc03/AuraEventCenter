import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faGear, faUnlock, faBell, faEye} from '@fortawesome/free-solid-svg-icons';

const SectionProfile = [
  {
    title: 'GENERAL',
    links: [
      { id: 1, label: 'Perfil', icon: <FontAwesomeIcon icon={faUser} />, href: '/perfil' },
      { id: 2, label: 'Cuenta', icon: <FontAwesomeIcon icon={faGear} />, href: '/cuenta' },
      { id: 3, label: 'Privacidad', icon: <FontAwesomeIcon icon={faUnlock} />, href: '/privacidad' },
      { id: 4, label: 'Notificaciones', icon: <FontAwesomeIcon icon={faBell} />, href: '/notificaciones' },
      { id: 5, label: 'Apariencia', icon: <FontAwesomeIcon icon={faEye} />, href: '/apariencia' }
    ]
  }
];

export default SectionProfile;
