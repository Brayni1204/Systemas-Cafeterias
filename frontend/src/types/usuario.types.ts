// frontend/src/types/usuario.types.ts

export type RolUsuario = 'administrador' | 'cocinero' | 'cajero';

export interface Usuario {
  id_usuario: number;
  nombre: string;
  email: string;
  rol: RolUsuario;
  createdAt?: string;
  updatedAt?: string;
}

// Datos para crear un usuario (la contraseña es requerida)
export interface CreateUsuarioData {
  nombre: string;
  email: string;
  password?: string; // Hacemos la contraseña opcional en el tipo general
  rol: RolUsuario;
}

// Datos para actualizar un usuario (todos los campos son opcionales)
export type UpdateUsuarioData = Partial<CreateUsuarioData>;