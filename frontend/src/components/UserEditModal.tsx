// frontend/src/components/UserEditModal.tsx

import React, { useState, useEffect, type ChangeEvent, type FormEvent } from 'react';
import type { UserFormValues } from '../types/user.types';

interface UserEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (userData: UserFormValues) => void;
  currentUser?: UserFormValues | null; // Usuario actual para edición
}

export const UserEditModal: React.FC<UserEditModalProps> = ({ isOpen, onClose, onSave, currentUser }) => {
  const [formData, setFormData] = useState<UserFormValues>({
    nombre: '',
    email: '',
    password: '',
    rol: 'cajero', // Valor por defecto
  });

  useEffect(() => {
    if (currentUser) {
      // Si hay un usuario actual, precarga los datos para edición
      setFormData({
        id_usuario: currentUser.id_usuario,
        nombre: currentUser.nombre,
        email: currentUser.email,
        password: '', // No precargar la contraseña por seguridad
        rol: currentUser.rol,
      });
    } else {
      // Si no hay usuario, reinicia el formulario para una nueva creación
      setFormData({
        nombre: '',
        email: '',
        password: '',
        rol: 'cajero',
      });
    }
  }, [currentUser, isOpen]); // Dependencias para resetear/precargar cuando el modal se abre o el usuario cambia

  if (!isOpen) return null;

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose(); // Cierra el modal después de guardar
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50 font-inter">
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
          {currentUser?.id_usuario ? 'Editar Usuario' : 'Crear Nuevo Usuario'}
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="nombre" className="block text-gray-700 text-sm font-bold mb-2">
              Nombre:
            </label>
            <input
              type="text"
              id="nombre"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">
              Email:
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="block text-gray-700 text-sm font-bold mb-2">
              Contraseña: {currentUser?.id_usuario ? '(Dejar vacío para mantener la actual)' : ''}
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password || ''}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              {...(currentUser?.id_usuario ? {} : { required: true })} // Requerido solo en creación
            />
          </div>
          <div className="mb-6">
            <label htmlFor="rol" className="block text-gray-700 text-sm font-bold mb-2">
              Rol:
            </label>
            <select
              id="rol"
              name="rol"
              value={formData.rol}
              onChange={handleChange}
              className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            >
              <option value="administrador">Administrador</option>
              <option value="cajero">Cajero</option>
              <option value="cocinero">Cocinero</option>
            </select>
          </div>
          <div className="flex items-center justify-between">
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline transition duration-200 ease-in-out transform hover:scale-105"
            >
              Guardar
            </button>
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline transition duration-200 ease-in-out transform hover:scale-105"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
