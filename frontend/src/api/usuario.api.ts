// frontend/src/api/usuario.api.ts
import api from './axios';
import type { Usuario, CreateUsuarioData, UpdateUsuarioData } from '../types/usuario.types';

const TENANT_API_URL = '/v1/usuarios';

export const getUsuariosRequest = () => {
  return api.get<Usuario[]>(TENANT_API_URL);
};

export const createUsuarioRequest = (usuario: CreateUsuarioData) => {
  return api.post<Usuario>(TENANT_API_URL, usuario);
};

export const updateUsuarioRequest = (id: number, usuario: UpdateUsuarioData) => {
  return api.put<Usuario>(`${TENANT_API_URL}/${id}`, usuario);
};

export const deleteUsuarioRequest = (id: number) => {
  return api.delete(`${TENANT_API_URL}/${id}`);
};