import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

// Páginas
import Home from './pages/Home'; // Página de inicio
import SignIn from './pages/SignIn'; // Página de iniciar sesión
import Register from './pages/Register'; // Página de registro
import RecoverEmail from './pages/RecoverEmail'; // Página de recuperar contraseña
import VerifyCode from './pages/VerifyCode'; // Página de validación de codigo
import ResetPassword from './pages/ResetPassword'; // Página de contraseña nueva
import RoomsAdmin from './pages/RoomsAdmin';
import NotFound from './pages/Notfound'; // Página de 404
import SectionAdmin from '../src/components/utils/admin-nav'; // Lista de secciones que van en el nav para administradores
import SectionRoot from '../src/components/utils/root-nav'; // Lista de secciones que van en el nav para root admins
import SectionProfile from '../src/components/utils/profile-nav'; // Lista de secciones que van en el nav la pagina de perfil
import Profile from './pages/Profile'

import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/context/PrivateRoute'; // Una mausque herramineta que nos servira mas adelante

function App() {
  return (
    <>
    <Router>
      <Routes>
        {/* Ruta para la página de inicio */}
        <Route path="/" element={<Home />} />

        {/* Ruta para la página de inicio de sesión */}
        <Route path="/iniciar-sesion" element={<SignIn />} />

        {/* Ruta para la página de registro */}
        <Route path="/registro" element={<Register />} />

        {/* Ruta para la página de recuperar contraseña */}
        <Route path="/recuperar-contraseña" element={<RecoverEmail />} />

        {/* Ruta para la página de validación de codigo */}
        <Route path="/verificar-codigo" element={<VerifyCode />} />

        {/* Ruta para la página de contraseña nueva */}
        <Route path="/cambiar-contraseña" element={<ResetPassword />} />

        {/* Ruta para la página de inicio */}
        <Route path="/inicio" element={<Home />} />

        {/* Ruta para la página de las salas */}
        <Route path="/admin/rooms" element={<RoomsAdmin sections={SectionAdmin}/>} />

        {/* Ruta para la página de las salas */}
        <Route path="/root-admin/rooms" element={<RoomsAdmin sections={SectionRoot}/>} />
      
        {/* Ruta para 404 para paginas no definidas */}
        <Route path="*" element={<NotFound />} />
          
        </Routes>
      </Router>
    </>
  );
}

export default App;
