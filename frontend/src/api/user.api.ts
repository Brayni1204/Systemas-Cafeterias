// frontend/src/api/user.api.ts

import api from './axios'; // Importa tu instancia de Axios configurada
import type { User, UserFormValues } from '../types/user.types';

const USER_BASE_URL = '/v1/users'; // La base URL para las rutas de usuario (después de /api)

// Omitimos el id_usuario al crear, la BD lo genera
type CreateUserDTO = Omit<UserFormValues, 'id_usuario'>;
// Para actualizar, cualquier campo de UserFormValues (excepto id_usuario) es opcional
type UpdateUserDTO = Partial<Omit<UserFormValues, 'id_usuario'>>;

/**
 * @function getUsersRequest
 * @description Obtiene todos los usuarios para el inquilino actual.
 * @returns {Promise<User[]>} Una promesa que resuelve con un array de usuarios.
 */
export const getUsersRequest = () => api.get<User[]>(USER_BASE_URL);

/**
 * @function getUserByIdRequest
 * @description Obtiene un usuario específico por su ID para el inquilino actual.
 * @param {number} userId - El ID del usuario.
 * @returns {Promise<User>} Una promesa que resuelve con el objeto del usuario.
 */
export const getUserByIdRequest = (userId: number) => api.get<User>(`${USER_BASE_URL}/${userId}`);

/**
 * @function createUserRequest
 * @description Crea un nuevo usuario para el inquilino actual.
 * @param {CreateUserDTO} userData - Los datos del nuevo usuario.
 * @returns {Promise<User>} Una promesa que resuelve con el objeto del usuario creado.
 */
export const createUserRequest = (userData: CreateUserDTO) => api.post<User>(USER_BASE_URL, userData);

/**
 * @function updateUserRequest
 * @description Actualiza un usuario existente para el inquilino actual.
 * @param {number} userId - El ID del usuario a actualizar.
 * @param {UpdateUserDTO} userData - Los datos actualizados del usuario.
 * @returns {Promise<User>} Una promesa que resuelve con el objeto del usuario actualizado.
 */
export const updateUserRequest = (userId: number, userData: UpdateUserDTO) => api.put<User>(`${USER_BASE_URL}/${userId}`, userData);

/**
 * @function deleteUserRequest
 * @description Elimina un usuario existente para el inquilino actual.
 * @param {number} userId - El ID del usuario a eliminar.
 * @returns {Promise<void>} Una promesa que resuelve cuando el usuario es eliminado.
 */
export const deleteUserRequest = (userId: number) => api.delete<void>(`${USER_BASE_URL}/${userId}`);
