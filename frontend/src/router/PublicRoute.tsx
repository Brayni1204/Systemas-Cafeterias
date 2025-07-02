// frontend/src/router/PublicRoute.tsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth'; // Importamos el hook

export const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  // Usamos nuestro hook como única fuente de verdad
  const { isAuthenticated } = useAuth();

  // Si el hook dice que SÍ está autenticado, redirige al dashboard
  if (isAuthenticated) {
    return <Navigate to="/admin/dashboard" replace />;
  }
  
  // Si no, muestra la página pública (Login)
  return <>{children}</>;
};