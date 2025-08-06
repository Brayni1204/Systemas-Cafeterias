// frontend/src/types/user.types.ts

/**
 * @interface User
 * @description Define la estructura de un objeto de usuario en el frontend.
 * Los nombres de los campos deben coincidir con el modelo de backend.
 */
export interface User {
  id_usuario?: number; // Usa id_usuario para que coincida con tu backend
  nombre: string;
  email: string;
  password?: string; // Opcional para algunas operaciones (ej. obtener, actualizar sin cambiar contraseña)
  rol: 'administrador' | 'cajero' | 'cocinero'; // Roles definidos en el ENUM de backend
  createdAt?: string;
  updatedAt?: string;
}

/**
 * @interface UserFormValues
 * @description Define la estructura de los valores del formulario para crear o editar un usuario.
 * No incluye createdAt/updatedAt ya que no son parte del formulario de entrada.
 */
export interface UserFormValues {
  id_usuario?: number;
  nombre: string;
  email: string;
  password?: string;
  rol: 'administrador' | 'cajero' | 'cocinero';
}
