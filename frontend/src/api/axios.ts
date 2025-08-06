// frontend/src/api/axios.ts
import axios from 'axios';

const API_URL = 'http://localhost:4000/api';

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use(
  (config) => {
    // 1. Intentamos obtener el subdominio del host.
    const host = window.location.host;
    const subdomain = host.split('.')[0];
    let tenantId = null;

    // Si el host no es localhost y tiene un subdominio, lo usamos.
    if (host !== 'localhost:4000' && subdomain) {
      tenantId = subdomain;
    } else {
      // Si estamos en localhost, obtenemos el tenantId del localStorage.
      // Asegúrate de que este valor se guarde al momento del login.
      tenantId = localStorage.getItem('companyName');
    }

    // 2. Si se encontró un tenantId, lo añadimos a los encabezados.
    if (tenantId) {
      config.headers['X-Tenant-ID'] = tenantId;
    }

    // 3. Añadimos el token de autenticación si existe.
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;