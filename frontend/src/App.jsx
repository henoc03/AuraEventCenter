import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

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

// Páginas protegidas
import AdminDashboard from "./pages/AdminDashBoard";
import Clients from './pages/Clients';
import Administrators from './pages/Administrator';
import RoomsAdmin from './pages/RoomsAdmin';

// Contexto y utilidades
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/context/PrivateRoute';
import SectionAdmin from '../src/components/utils/admin-nav';
import SectionRoot from '../src/components/utils/root-nav';
import SectionProfile from '../src/components/utils/profile-nav';

function App() {
  return (
    <AuthProvider>
      <Router>
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
          <Route path="/servicios" element={<ServicesClient />} />
          <Route path="/menus" element={<MenusClient />} />

          {/* Rutas protegidas para administradores comunes */}
          <Route element={<PrivateRoute allowedRoles={['admin']} />}>
            <Route path="/admin/salas" element={<RoomsAdmin sections={SectionAdmin}/>} />
            <Route path="/admin/tablero" element={<AdminDashboard sections={SectionAdmin} />} />
            <Route path="/admin/clientes" element={<Clients sections={SectionAdmin} />} />
          </Route>

          {/* Rutas protegidas para root-admin */}
          <Route element={<PrivateRoute allowedRoles={['root admin']} />}>
            <Route path="/root-admin/salas" element={<RoomsAdmin sections={SectionRoot}/>} />
            <Route path="/root-admin/tablero" element={<AdminDashboard sections={SectionRoot} />} />
            <Route path="/root-admin/clientes" element={<Clients sections={SectionRoot} />} />
            <Route path="/root-admin/administradores" element={<Administrators sections={SectionRoot} />} />
          </Route>

          {/* Página 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
