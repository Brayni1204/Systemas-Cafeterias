// frontend/src/pages/admin/GestionUsuariosPage.tsx
import { useState, useEffect } from 'react';
import { 
  getUsuariosRequest, 
  createUsuarioRequest, 
  updateUsuarioRequest, 
  deleteUsuarioRequest 
} from '../../api/usuario.api';
import { UserEditModal } from '../../components/UserEditModal';
import type { Usuario, CreateUsuarioData, UpdateUsuarioData } from '../../types/usuario.types';
import { useAuth } from '../../hooks/useAuth';

function GestionUsuariosPage() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [isModalOpen, setModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<Partial<Usuario> | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const auth = useAuth();

  // Cargar usuarios
  const loadUsuarios = async () => {
    try {
      const response = await getUsuariosRequest();
      // Asegurarse de que response.data es un array
      setUsuarios(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error('Error al cargar usuarios:', error);
      setUsuarios([]); // En caso de error, establecer un array vacío
    }
  };

  useEffect(() => {
    loadUsuarios();
  }, []);

  // Filtrar usuarios
   const usuariosFiltrados = Array.isArray(usuarios) ? usuarios.filter(usuario =>
    usuario.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    usuario.email.toLowerCase().includes(searchTerm.toLowerCase())
  ) : [];

  // Manejadores de eventos
  const handleCreateUser = () => {
    setCurrentUser(null);
    setModalOpen(true);
  };

  const handleEditUser = (usuario: Usuario) => {
    setCurrentUser(usuario);
    setModalOpen(true);
  };

  const handleDeleteUser = async (id: number) => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar este usuario?')) return;

    try {
      await deleteUsuarioRequest(id);
      await loadUsuarios();
    } catch (error) {
      console.error('Error al eliminar usuario:', error);
    }
  };

  const handleSaveUser = async (userData: CreateUsuarioData | UpdateUsuarioData) => {
    try {
      if (currentUser?.id_usuario) {
        // Actualizar usuario existente
        await updateUsuarioRequest(currentUser.id_usuario, userData as UpdateUsuarioData);
      } else {
        // Crear nuevo usuario
        await createUsuarioRequest(userData as CreateUsuarioData);
      }
      setModalOpen(false);
      await loadUsuarios();
    } catch (error) {
      console.error('Error al guardar usuario:', error);
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Gestión de Usuarios</h1>
        {auth.rol === 'administrador' && (
          <button
            onClick={handleCreateUser}
            className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
          >
            Crear Usuario
          </button>
        )}
      </div>

      {/* Barra de búsqueda */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Buscar usuarios..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 border rounded-md"
        />
      </div>

      {/* Tabla de usuarios */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rol</th>
              {auth.rol === 'administrador' && (
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {usuariosFiltrados.map((usuario) => (
              <tr key={usuario.id_usuario}>
                <td className="px-6 py-4 whitespace-nowrap">{usuario.nombre}</td>
                <td className="px-6 py-4 whitespace-nowrap">{usuario.email}</td>
                <td className="px-6 py-4 whitespace-nowrap capitalize">{usuario.rol}</td>
                {auth.rol === 'administrador' && (
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => handleEditUser(usuario)}
                      className="text-indigo-600 hover:text-indigo-900 mr-4"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDeleteUser(usuario.id_usuario)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Eliminar
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal de edición/creación */}
      <UserEditModal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSaveUser}
        user={currentUser}
      />
    </div>
  );
}

export default GestionUsuariosPage;