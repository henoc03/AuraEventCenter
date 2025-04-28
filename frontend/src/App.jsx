import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

// Páginas
import Home from './pages/Home'; // Página de inicio
import SignIn from './pages/SignIn'; // Página de iniciar sesión
import NotFound from './pages/Notfound';


function App() {
  return (
    
    <Router>
      <Routes>
        {/* Ruta para la página de inicio */}
        <Route path="/" element={<Home />} />

        {/* Ruta para la página de inicio de sesión */}
        <Route path="/signin" element={<SignIn />} />

        {/* Ruta para la página de inicio */}
        <Route path="/inicio" element={<Home />} />

        {/* POR EL MOMENTO RUTAS QUE MUESTRAN UNA PAGINA 404 */}

        {/* Ruta para la página de salas */}
        <Route path="/salas" element={<NotFound />} />

        {/* Ruta para la página de servicios */}
        <Route path="/servicios" element={<NotFound />} />

        {/* Ruta para la página de cotizacion */}
        <Route path="/cotizacion" element={<NotFound />} />

        {/* Ruta para la página de contacto */}
        <Route path="/contacto" element={<NotFound />} />
        
      </Routes>
    </Router>
  );
}

export default App;
