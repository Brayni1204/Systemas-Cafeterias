// frontend/src/router/ProtectedRoute.tsx
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth'; // Importamos el hook

export const ProtectedRoute = () => {
  // Usamos nuestro hook como única fuente de verdad
  const { isAuthenticated } = useAuth();

  // Si el hook dice que no está autenticado (porque no hay token O ha expirado), redirige
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Si está autenticado, permite el acceso
  return <Outlet />;
};