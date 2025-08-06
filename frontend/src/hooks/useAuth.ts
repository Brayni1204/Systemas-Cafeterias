// frontend/src/hooks/useAuth.ts
import { jwtDecode } from 'jwt-decode';

interface AuthTokenPayload {
  id: number;
  nombre: string;
  rol: 'administrador' | 'cajero' | 'cocinero' | 'superadmin';
  companyName?: string; // Es opcional, solo los inquilinos lo tienen
  exp: number; // El campo de expiración
}

export const useAuth = () => {
  const token = localStorage.getItem('token');
  
  if (token) {
    try {
      const decoded: AuthTokenPayload = jwtDecode(token);

      // Verificamos si la fecha de expiración (en milisegundos) es en el futuro
      if (decoded.exp * 1000 < Date.now()) {
        // El token ha expirado, lo borramos y tratamos como no autenticado
        localStorage.removeItem('token');
        console.log("Token expirado, cerrando sesión.");
        return { isAuthenticated: false, nombre: null, rol: null, companyName: null, tenantId: null }; // Añadido tenantId: null
      }

      // Si el token es válido y no ha expirado, devolvemos los datos
      return { 
        isAuthenticated: true, 
        ...decoded,
        tenantId: decoded.companyName || null // CORRECCIÓN: tenantId es companyName si existe, sino null
      };

    } catch (error) {
      console.error("Token inválido o malformado:", error);
      localStorage.removeItem('token');
      return { isAuthenticated: false, nombre: null, rol: null, companyName: null, tenantId: null }; // Añadido tenantId: null
    }
  }

  // Si no hay token, no está autenticado
  return { isAuthenticated: false, nombre: null, rol: null, companyName: null, tenantId: null }; // Añadido tenantId: null
};
