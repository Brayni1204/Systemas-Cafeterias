// frontend/src/layouts/AdminLayout.tsx
import { useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

// Iconos para los enlaces de navegación (componentes SVG simples)
const DashboardIcon = () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path></svg>;
const ProductsIcon = () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>;
const OrdersIcon = () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path></svg>;
const PosIcon = () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path></svg>;


const allNavLinks = [
  { name: 'Dashboard', href: '/admin/dashboard', roles: ['administrador'], icon: <DashboardIcon /> },
  { name: 'Productos', href: '/admin/productos', roles: ['administrador'], icon: <ProductsIcon /> },
  { name: 'Pedidos', href: '/admin/pedidos', roles: ['administrador', 'cocinero'], icon: <OrdersIcon /> },
  { name: 'Punto de Venta', href: '/admin/pos', roles: ['administrador', 'cajero'], icon: <PosIcon /> },
];

export const AdminLayout = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const { nombre, rol, companyName } = useAuth();

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  const visibleLinks = allNavLinks.filter(link => rol && link.roles.includes(rol));

  return (
    <div className="relative min-h-screen md:flex">
      {/* Overlay para móvil */}
      <div 
        className={`fixed inset-0 z-20 md:hidden ${isSidebarOpen ? 'block' : 'hidden'}`}
        onClick={() => setSidebarOpen(false)}
      ></div>
      {/* Sidebar */}
      <aside 
        className={`fixed inset-y-0 left-0 bg-white shadow-lg w-64 flex flex-col z-30 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 md:static md:inset-0 transition-transform duration-300 ease-in-out`}
      >
        <div className="flex items-center justify-center h-20 border-b">
          <h1 className="text-2xl font-bold text-indigo-600 text-center truncate px-4" title={companyName || 'Mi Negocio'}>
            {companyName || 'Mi Negocio'}
          </h1>
        </div>
        <nav className="flex-1 px-4 py-4 space-y-2">
          {visibleLinks.map((link) => {
            const isActive = location.pathname.startsWith(link.href);
            return (
              <Link
                key={link.name}
                to={link.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-4 px-4 py-2.5 rounded-lg text-base font-medium transition-colors duration-200 ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                {link.icon}
                <span>{link.name}</span>
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Contenido Principal */}
      <div className="flex-1 flex flex-col">
        {/* Barra de Navegación Superior (incluye el botón de logout y el de menú móvil) */}
        <header className="sticky top-0 bg-white shadow-sm z-10">
            <div className="flex items-center justify-between h-16 px-4 md:px-8">
                {/* Botón de Hamburguesa para móvil */}
                <button 
                    className="md:hidden text-gray-500 hover:text-gray-700 focus:outline-none"
                    onClick={() => setSidebarOpen(!isSidebarOpen)}
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
                </button>

                {/* Espaciador para centrar el contenido de la derecha en desktop */}
                <div className="hidden md:block"></div>

                {/* Perfil de Usuario y Logout */}
                <div className="flex items-center gap-4">
                    <div className="text-right">
                        <p className="text-sm font-medium text-gray-800">{nombre || 'Usuario'}</p>
                        <p className="text-xs text-gray-500 capitalize">{rol || 'Rol'}</p>
                    </div>
                    <button onClick={handleLogout} title="Cerrar Sesión" className="text-gray-500 hover:text-red-600 transition-colors">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
                    </button>
                </div>
            </div>
        </header>

        {/* Área de Contenido de la Página */}
        <main className="flex-1 p-6 lg:p-8 bg-gray-50 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};