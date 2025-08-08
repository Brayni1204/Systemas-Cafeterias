import api from './axios';
import type { User, UserFormValues } from '../types/user.types';

const USER_BASE_URL = '/v1/users';

type CreateUserDTO = Omit<UserFormValues, 'id_usuario'>;
type UpdateUserDTO = Partial<Omit<UserFormValues, 'id_usuario'>>;

export const getUsersRequest = () => api.get<User[]>(USER_BASE_URL);

export const getUserByIdRequest = (id_usuario: number) => api.get<User>(`${USER_BASE_URL}/${id_usuario}`);

export const createUserRequest = (userData: CreateUserDTO) => api.post<User>(USER_BASE_URL, userData);

export const updateUserRequest = (id_usuario: number, userData: UpdateUserDTO) => api.put<User>(`${USER_BASE_URL}/${id_usuario}`, userData);

export const deleteUserRequest = (id_usuario: number) => api.delete<void>(`${USER_BASE_URL}/${id_usuario}`);