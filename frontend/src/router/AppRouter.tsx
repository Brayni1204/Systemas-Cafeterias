// frontend/src/router/AppRouter.tsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ProtectedRoute } from './ProtectedRoute';
import { PublicRoute } from './PublicRoute'; // <-- Importa la nueva ruta pública
import { AdminLayout } from '../layouts/AdminLayout';

import LoginPage from '../pages/auth/LoginPage';
import DashboardPage from '../pages/admin/DashboardPage';
import GestionProductosPage from '../pages/admin/GestionProductosPage';


export const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* --- Rutas Públicas --- */}
        <Route
          path="/login"
          element={
            <PublicRoute>
              <LoginPage />
            </PublicRoute>
          }
        />
        <Route path="/" element={<h2>Landing Page Pública</h2>} />

        {/* --- Rutas Protegidas de Administrador --- */}
        {/* Todas las rutas anidadas aquí estarán protegidas */}
        <Route element={<ProtectedRoute />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="productos" element={<GestionProductosPage />} />
            {/* Aquí puedes añadir más rutas de admin en el futuro */}
          </Route>
        </Route>
        
        {/* Ruta para páginas no encontradas */}
        <Route path="*" element={<h1>404: Página no encontrada</h1>} />
      </Routes>
    </BrowserRouter>
  );
};