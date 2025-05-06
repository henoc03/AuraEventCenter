import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

// Páginas
import Home from './pages/Home'; // Página de inicio
import SignIn from './pages/SignIn'; // Página de iniciar sesión
import Register from './pages/Register'; // Página de registro
import RecoverEmail from './pages/RecoverEmail'; // Página de recuperar contraseña
import VerifyCode from './pages/VerifyCode'; // Página de validación de codigo
import ResetPassword from './pages/ResetPassword'; // Página de contraseña nueva

import AdminDashboard from "./pages/AdminDashBoard"; // Página de tablero
import Clients from './pages/Clients'; // Página de clientes
import Administrators from './pages/Administrator'; // Página de administradores
import NotFound from './pages/Notfound'; // Página de 404

import SectionAdmin from '../src/components/utils/admin-nav'; // Lista de secciones que van en el nav para administradores
import SectionRoot from '../src/components/utils/root-nav'; // Lista de secciones que van en el nav para root admins


function App() {
  return (
    
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
        
        {/* Ruta para la página tablero de administradores */}
        <Route path="/admin/tablero" element={<AdminDashboard sections={SectionAdmin} />} />

        {/* Ruta para la página tablero de root administradores */}
        <Route path="/root-admin/tablero" element={<AdminDashboard sections={SectionRoot} />} />
               
        {/* Ruta para la página clientes de administradores */}
        <Route path="/admin/clientes" element={<Clients sections={SectionAdmin} />} />

        {/* Ruta para la página clientes de root adminis */}
        <Route path="/root-admin/clientes" element={<Clients sections={SectionRoot} />} />

        {/* Ruta para la página administradores de root admini */}
        <Route path="/root-admin/administradores" element={<Administrators sections={SectionRoot} />} />

        {/* Ruta para 404 para paginas no definidas */}
        <Route path="*" element={<NotFound />} />
        
      </Routes>
    </Router>
  );
}

export default App;
