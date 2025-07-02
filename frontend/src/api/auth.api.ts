// frontend/src/api/auth.api.ts
import api from './axios'; // <-- Importamos nuestra instancia personalizada
import type { LoginCredentials } from '../types/auth.types';

// Ahora la función es más simple, no necesita manejar cabeceras.
export const loginRequest = (credentials: LoginCredentials) => {
  // Usamos 'api' en lugar de 'axios'. El interceptor se encargará de las cabeceras.
  return api.post('/v1/login', credentials);
};