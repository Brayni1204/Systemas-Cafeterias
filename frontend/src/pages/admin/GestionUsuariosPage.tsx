// frontend/src/pages/admin/GestionUsuariosPage.tsx

import React, { useState, useEffect, useMemo } from 'react';
// Ya no importamos AdminLayout aquí, ya que es el componente padre en AppRouter
// import { AdminLayout } from '../../layouts/AdminLayout'; 
import type { User, UserFormValues } from '../../types/user.types';
import { getUsersRequest, createUserRequest, updateUserRequest, deleteUserRequest } from '../../api/user.api';
import { UserEditModal } from '../../components/UserEditModal'; // Importa el modal nombrado
import { useAuth } from '../../hooks/useAuth'; // Para obtener el companyName
import io from 'socket.io-client';

// Conexión WebSocket global (se recomienda manejarla en un contexto o de forma más centralizada en apps grandes)
const socket = io('http://localhost:4000'); // Asegúrate de que esta URL sea la de tu backend

const GestionUsuariosPage: React.FC = () => {
  // CORRECCIÓN: Accede a 'companyName' (que usaremos como tenantId) y 'isAuthenticated'
  const { companyName, isAuthenticated } = useAuth(); 
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedUser, setSelectedUser] = useState<UserFormValues | null>(null); // Cambiado a null por defecto
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');

  useEffect(() => {
    console.log('useEffect en GestionUsuariosPage ejecutado. companyName:', companyName); // DEBUG
    // CORRECCIÓN: Solo intenta cargar usuarios y conectar WS si isAuthenticated y companyName están definidos
    if (isAuthenticated && companyName) { 
      fetchUsers();

      // Unirse a la sala de WebSocket del inquilino
      // Usamos companyName (que es el subdominio) para construir la sala
      const tenantRoom = `tenant_${companyName}`; 
      socket.emit('join_tenant_room', tenantRoom);
      console.log(`Socket unido a la sala: ${tenantRoom}`);

      // Listeners de WebSocket para actualizaciones en tiempo real
      const handleNewUser = (newUser: User) => {
        setUsers(prev => [newUser, ...prev]);
        console.log('Nuevo usuario recibido via WS:', newUser);
      };
      const handleUpdatedUser = (updatedUser: User) => {
        setUsers(prev => prev.map(u => u.id_usuario === updatedUser.id_usuario ? updatedUser : u));
        console.log('Usuario actualizado via WS:', updatedUser);
      };
      const handleDeletedUser = (deletedUserId: number) => {
        setUsers(prev => prev.filter(u => u.id_usuario !== deletedUserId));
        console.log('Usuario eliminado via WS:', deletedUserId);
      };
      
      socket.on('nuevo_usuario', handleNewUser);
      socket.on('usuario_actualizado', handleUpdatedUser);
      socket.on('usuario_eliminado', handleDeletedUser);

      // Función de limpieza para evitar fugas de memoria
      return () => {
        socket.off('nuevo_usuario', handleNewUser);
        socket.off('usuario_actualizado', handleUpdatedUser);
        socket.off('usuario_eliminado', handleDeletedUser);
      };
    }
  }, [isAuthenticated, companyName]); // Dependencias actualizadas

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getUsersRequest(); 
      console.log('Respuesta de la API al obtener usuarios:', res); // DEBUG
      console.log('Datos de usuarios recibidos:', res.data); // DEBUG
      setUsers(res.data); 
    } catch (err) {
      console.error("Error al cargar usuarios:", err);
      setError("No se pudieron cargar los usuarios. Inténtalo de nuevo más tarde.");
    } finally {
      setLoading(false);
    }
  };

  const handleAddUser = () => {
    setSelectedUser(null); // Para asegurar que el modal esté en modo creación
    setIsModalOpen(true);
  };

  const handleEditUser = (user: User) => {
    setSelectedUser(user); // Precarga los datos del usuario para edición
    setIsModalOpen(true);
  };

  const handleDeleteUser = async (userId: number) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este usuario?')) {
      try {
        await deleteUserRequest(userId);
        // La actualización de la UI se manejará por el evento WebSocket 'usuario_eliminado'
      } catch (err) {
        console.error("Error al eliminar usuario:", err);
        setError("No se pudo eliminar el usuario.");
      }
    }
  };

  const handleSaveUser = async (userData: UserFormValues) => {
    try {
      if (userData.id_usuario) {
        await updateUserRequest(userData.id_usuario, userData);
      } else {
        await createUserRequest(userData);
      }
      // La actualización de la UI se manejará por los eventos WebSocket 'nuevo_usuario' o 'usuario_actualizado'
    } catch (err: unknown) {
      console.error("Error al guardar usuario:", err);
      if (typeof err === 'object' && err !== null && 'response' in err) {
        const response = (err as { response?: { data?: { message?: string } } }).response;
        setError(response?.data?.message || "No se pudo guardar el usuario. Verifica los datos e intenta de nuevo.");
      } else {
        setError("No se pudo guardar el usuario. Verifica los datos e intenta de nuevo.");
      }
    } finally {
      handleCloseModal(); // Cierra el modal después de intentar guardar
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedUser(null); // Limpia el usuario seleccionado al cerrar el modal
  };

  // Filtrado de usuarios
  const filteredUsers = useMemo(() => {
    return users
      .filter(user => roleFilter === 'all' || user.rol === roleFilter)
      .filter(user => user.nombre.toLowerCase().includes(searchTerm.toLowerCase()) || user.email.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [users, roleFilter, searchTerm]);

  return (
    // AdminLayout ya es el componente padre en AppRouter, no lo envuelvas aquí
    <div className="container mx-auto p-6 bg-white rounded-lg shadow-md font-inter">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Gestión de Usuarios</h1>

      <button
        onClick={handleAddUser}
        className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg mb-6 transition duration-200 ease-in-out transform hover:scale-105"
      >
        Agregar Nuevo Usuario
      </button>

      {loading && <p className="text-center text-gray-600">Cargando usuarios...</p>}
      {error && <p className="text-center text-red-500">{error}</p>}

      {!loading && !error && users.length === 0 && (
        <p className="text-center text-gray-600">No hay usuarios registrados para esta empresa.</p>
      )}

      {!loading && !error && users.length > 0 && (
        <>
          <div className="flex flex-col md:flex-row items-center gap-4 mb-4 p-4 bg-gray-50 rounded-lg border">
            <input 
              type="text" 
              placeholder="Buscar por nombre o email..."
              className="p-2 border border-gray-300 rounded-lg w-full md:w-1/3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div className="flex gap-2 flex-wrap">
              {['all', 'administrador', 'cajero', 'cocinero'].map(rol => (
                <button key={rol} onClick={() => setRoleFilter(rol)} className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${roleFilter === rol ? 'bg-indigo-600 text-white shadow' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}>
                  {rol.charAt(0).toUpperCase() + rol.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200 rounded-lg">
              <thead className="bg-gray-100">
                <tr>
                  <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                  <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
                  <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                  <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rol</th>
                  <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredUsers.map((user) => (
                  <tr key={user.id_usuario} className="hover:bg-gray-50">
                    <td className="py-4 px-6 whitespace-nowrap text-sm font-medium text-gray-900">{user.id_usuario}</td>
                    <td className="py-4 px-6 whitespace-nowrap text-sm text-gray-700">{user.nombre}</td>
                    <td className="py-4 px-6 whitespace-nowrap text-sm text-gray-700">{user.email}</td>
                    <td className="py-4 px-6 whitespace-nowrap text-sm text-gray-700">{user.rol}</td>
                    <td className="py-4 px-6 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => handleEditUser(user)}
                        className="text-blue-600 hover:text-blue-900 mr-4 transition duration-200 ease-in-out transform hover:scale-110"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleDeleteUser(user.id_usuario!)}
                        className="text-red-600 hover:text-red-900 transition duration-200 ease-in-out transform hover:scale-110"
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      <UserEditModal
        isOpen={isModalOpen} 
        onClose={handleCloseModal}
        onSave={handleSaveUser}
        currentUser={selectedUser}
      />
    </div>
  );
};

export default GestionUsuariosPage;
