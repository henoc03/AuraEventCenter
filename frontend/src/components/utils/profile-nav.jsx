import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faGear, faClock} from '@fortawesome/free-solid-svg-icons';

const SectionProfile = [
  {
    title: 'GENERAL',
    links: [
      { id: 1, label: 'Perfil', icon: <FontAwesomeIcon icon={faUser} />, href: '/perfil' },
      { id: 2, label: 'Cuenta', icon: <FontAwesomeIcon icon={faGear} />, href: '/cuenta' },
      { id: 3, label: 'Reservas', icon: <FontAwesomeIcon icon={faClock} />, href: '/historial' },
    ]
  }
];

export default SectionProfile;
