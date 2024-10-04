import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  const userRole = localStorage.getItem('userRole');

  if (!token) {
    return <Navigate to="/login" />;
  }

  // Verificar si el usuario está en la ruta correcta según su rol
  const currentPath = window.location.pathname;
  if (
    (userRole === 'cliente' && currentPath !== '/cliente') ||
    (userRole === 'fisioterapeuta' && currentPath !== '/fisioterapeuta') ||
    (userRole === 'admin' && currentPath !== '/admin')
  ) {
    return <Navigate to={`/${userRole}`} />;
  }

  return children;
};

export default PrivateRoute;
