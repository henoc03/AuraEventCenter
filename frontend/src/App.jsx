import React from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation  } from 'react-router-dom';

// Páginas públicas
import Home from './pages/Home';
import RoomsClient from './pages/RoomsClient';
import SignIn from './pages/SignIn';
import Register from './pages/Register';
import Profile from './pages/Profile';
import RecoverEmail from './pages/RecoverEmail';
import VerifyCode from './pages/VerifyCode';
import ResetPassword from './pages/ResetPassword';
import NotFound from './pages/Notfound';
import ChangePassword from './pages/ChangePassword';
import AccountSettings from './pages/AccountSettings';
import VerifyAccountCode from './pages/VerifyAccountCode';
import ServicesClient from './pages/ServicesClient';
import MenusClient from './pages/MenusClient';
import ContactForm from './pages/ContactForm';
import EquipmentsClient from './pages/EquipmentsClient';
import AboutPage from './pages/About';
import EditBookingClient from './pages/EditBookingClient';
import CreateBookingClient from './pages/CreateBookinClient';
import ChatBotWrapper from './components/utils/ChatBotWrapper';
// Páginas protegidas
import AdminDashboard from "./pages/AdminDashBoard";
import Clients from './pages/Clients';
import Administrators from './pages/Administrator';
import RoomsAdmin from './pages/RoomsAdmin';
import ServicesAdmin from './pages/ServicesAdmin';
import MenusAdmin from './pages/MenusAdmin';
import Products from './pages/Products';
import EquipmentAdmin from './pages/EquipmentAdmin';
import CalendarView from './pages/CalendarView';
import BookingsAdmin from './pages/BookingsAdmin';

// Contexto y utilidades
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/context/PrivateRoute';
import SectionAdmin from '../src/components/utils/admin-nav';
import SectionRoot from '../src/components/utils/root-nav';
import SectionProfile from '../src/components/utils/profile-nav';

function ChatBotConditionalWrapper() {
  const location = useLocation();

  // Define rutas donde el chatbot SÍ se debe mostrar
  const allowedPaths = [
    '/', '/inicio', '/salas', '/servicios', '/servicios/menus',
    '/servicios/equipos', '/contacto', '/acerca', '/perfil',
    '/cuenta', '/cuenta/cambiar-contraseña', '/cuenta/verificar-codigo'
  ];

  const shouldShowChatbot = allowedPaths.some(path =>
    location.pathname === path || location.pathname.startsWith(path + '/')
  );

  return shouldShowChatbot ? <ChatBotWrapper /> : null;
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <ChatBotConditionalWrapper />
        <Routes>
      
          {/* Páginas públicas */}
          <Route path="/" element={<Home />} />
          <Route path="/inicio" element={<Home />} />
          <Route path="/salas" element={<RoomsClient />} />
          <Route path="/iniciar-sesion" element={<SignIn />} />
          <Route path="/registro" element={<Register />} />
          <Route path="/recuperar-contraseña" element={<RecoverEmail />} />
          <Route path="/verificar-codigo" element={<VerifyCode />} />
          <Route path="/cambiar-contraseña" element={<ResetPassword />} />
          <Route path="/perfil" element={<Profile sections={SectionProfile}/>} />
          <Route path="/cuenta" element={<AccountSettings sections={SectionProfile}/>} />
          <Route path="/cuenta/cambiar-contraseña" element={<ChangePassword sections={SectionProfile}/>} />
          <Route path="/cuenta/verificar-codigo" element={<VerifyAccountCode sections={SectionProfile}/>} />
          <Route path="/reserva/editar/:bookingId" element={<EditBookingClient sections={SectionProfile}/>} />
          <Route path="/servicios" element={<ServicesClient />} />
          <Route path="/servicios/menus" element={<MenusClient />} />
          <Route path="/servicios/equipos" element={<EquipmentsClient />} />
          <Route path="/contacto" element={<ContactForm />} />
          <Route path="/acerca" element={<AboutPage />} />

          <Route element={<PrivateRoute allowedRoles={['cliente']} />}>
          <Route path="/reservar" element={<CreateBookingClient sections={SectionProfile} />} />
          </Route>
          
          {/* Rutas protegidas para administradores comunes */}
          <Route element={<PrivateRoute allowedRoles={['admin']} />}>
            <Route path="/admin/salas" element={<RoomsAdmin sections={SectionAdmin}/>} />
            <Route path="/admin/tablero" element={<AdminDashboard sections={SectionAdmin} />} />
            <Route path="/admin/clientes" element={<Clients sections={SectionAdmin} />} />
            <Route path="/admin/servicios" element={<ServicesAdmin sections={SectionAdmin} />} />
            <Route path="/admin/servicios/catering/menus" element={<MenusAdmin sections={SectionAdmin} />} />
            <Route path="/admin/servicios/catering/productos" element={<Products sections={SectionAdmin} />} />
            <Route path="/admin/servicios/equipos" element={<EquipmentAdmin sections={SectionAdmin} />} />
            <Route path="/admin/calendario" element={<CalendarView sections={SectionAdmin} />} />
            <Route path="/admin/reservas" element={<BookingsAdmin sections={SectionAdmin} />} />
            <Route path="/admin/reservas/crear" element={<CreateBookingClient sections={SectionAdmin} />} />
            <Route path="/admin/reservas/editar/:bookingId" element={<EditBookingClient sections={SectionAdmin} />} />
          </Route>

          {/* Rutas protegidas para root-admin */}
          <Route element={<PrivateRoute allowedRoles={['root admin']} />}>
            <Route path="/root-admin/salas" element={<RoomsAdmin sections={SectionRoot}/>} />
            <Route path="/root-admin/tablero" element={<AdminDashboard sections={SectionRoot} />} />
            <Route path="/root-admin/clientes" element={<Clients sections={SectionRoot} />} />
            <Route path="/root-admin/administradores" element={<Administrators sections={SectionRoot} />} />
            <Route path="/root-admin/servicios" element={<ServicesAdmin sections={SectionRoot} />} />
            <Route path="/root-admin/servicios/catering/menus" element={<MenusAdmin sections={SectionRoot} />} />
            <Route path="/root-admin/servicios/catering/productos" element={<Products sections={SectionRoot} />} />
            <Route path="/root-admin/servicios/equipos" element={<EquipmentAdmin sections={SectionRoot} />} />
            <Route path="/root-admin/calendario" element={<CalendarView sections={SectionRoot} />} />
            <Route path="/root-admin/reservas" element={<BookingsAdmin sections={SectionRoot} />} />
            <Route path="/root-admin/reservas/crear" element={<CreateBookingClient sections={SectionRoot} />} />
            <Route path="/root-admin/reservas/editar/:bookingId" element={<EditBookingClient sections={SectionRoot} />} />
          </Route>

          {/* Página 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
