import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const PrivateRoute = ({ allowedRoles }) => {
  const { currentUser, loadingUser  } = useAuth();

  if (loadingUser) return null;
  
  if (!currentUser) {
    return <Navigate to="/iniciar-sesion" />;
  }

  if (!allowedRoles.includes(currentUser.userType)) {
    return <Navigate to="/" />; // Redirigir a la página de inicio si el usuario no tiene los permisos
  }

  return <Outlet />; // Renderiza la ruta protegida si el usuario tiene permisos
};

export default PrivateRoute;
