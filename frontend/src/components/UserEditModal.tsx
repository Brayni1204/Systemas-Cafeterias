// frontend/src/components/UserEditModal.tsx

import { useState, useEffect, type FormEvent, type ChangeEvent } from 'react';
import type { Usuario, CreateUsuarioData, UpdateUsuarioData } from '../types/usuario.types';

// Definimos las propiedades que recibirá el modal desde la página principal
interface UserEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (userData: CreateUsuarioData | UpdateUsuarioData) => void;
  // Puede recibir un usuario completo para editar, o un objeto parcial/nulo para crear
  user: Partial<Usuario> | null;
}

export function UserEditModal({ isOpen, onClose, onSave, user }: UserEditModalProps) {
  // Estado interno para manejar los datos del formulario.
  // Usamos un tipo que incluye todos los campos necesarios.
  const [formData, setFormData] = useState<Partial<CreateUsuarioData>>({});

  // useEffect se ejecuta para rellenar el formulario cuando haces clic en "Editar".
  useEffect(() => {
    if (user) {
      // Si estamos editando, llenamos con los datos del usuario.
      setFormData({
        nombre: user.nombre || '',
        email: user.email || '',
        rol: user.rol || 'cajero',
        password: '', // La contraseña siempre empieza vacía en el formulario de edición.
      });
    } else {
      // Si estamos creando, reseteamos a los valores por defecto.
      setFormData({
        nombre: '',
        email: '',
        password: '',
        rol: 'cajero',
      });
    }
  }, [user, isOpen]); // Se ejecuta cuando el usuario o la visibilidad del modal cambian.

  if (!isOpen) return null;

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prevData => ({ ...prevData, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const dataToSave = { ...formData };
    // Al editar, si la contraseña está vacía, no la enviamos para no sobreescribir la existente.
    if (user?.id_usuario && !dataToSave.password) {
      delete dataToSave.password;
    }
    onSave(dataToSave);
  };

  return (
    // Fondo oscuro semi-transparente
    <div className="fixed inset-0 bg-black bg-opacity-60 z-40 flex justify-center items-center p-4">
      <div className="bg-white rounded-lg shadow-2xl p-6 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">
          {user?.id_usuario ? 'Editar Usuario' : 'Crear Nuevo Usuario'}
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* ... (resto del formulario sin cambios) ... */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Nombre</label>
            <input type="text" name="nombre" value={formData.nombre || ''} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input type="email" name="email" value={formData.email || ''} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Contraseña</label>
            <input type="password" name="password" value={formData.password || ''} onChange={handleChange} required={!user?.id_usuario} placeholder={user?.id_usuario ? '(Dejar en blanco para no cambiar)' : 'Contraseña requerida'} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Rol</label>
            <select name="rol" value={formData.rol || 'cajero'} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500">
              <option value="cajero">Cajero</option>
              <option value="cocinero">Cocinero</option>
              <option value="administrador">Administrador</option>
            </select>
          </div>
          <div className="flex justify-end space-x-4 pt-4">
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md border border-gray-300">Cancelar</button>
            <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-md shadow-sm">Guardar</button>
          </div>
        </form>
      </div>
    </div>
  );
}