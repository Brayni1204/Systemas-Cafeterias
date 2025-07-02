// frontend/src/api/axios.ts
import axios from 'axios';

const API_URL = 'http://localhost:4000/api';

const api = axios.create({
  baseURL: API_URL,
});

// --- La Magia de los Interceptores ---
// Esto se ejecuta ANTES de cada petición que use esta instancia 'api'.
api.interceptors.request.use(
  (config) => {
    // Extraemos el subdominio de la URL del navegador
    const subdomain = window.location.host.split('.')[0];
    if (subdomain) {
      // Añadimos la cabecera personalizada
      config.headers['X-Tenant-ID'] = subdomain;
    }

    // Si tenemos un token en localStorage, también lo añadimos
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