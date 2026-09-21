import axios from 'axios';

/**
 * Instancia global de Axios preconfigurada para el monorepo.
 * Incluye withCredentials para que el navegador adjunte automáticamente
 * la Cookie HttpOnly (auth_token) a todas las peticiones hacia NestJS.
 */
export const api = axios.create({
  baseURL: 'http://localhost:3000',
  withCredentials: true,
});

// Interceptor genérico para manejar cierres de sesión forzados
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Si el backend rechaza la cookie por expiración, limpiamos el estado UI
    if (error.response?.status === 401) {
      localStorage.removeItem('isAuthenticated');
      localStorage.removeItem('role');
      // Solo redirigir si no estamos ya en auth
      if (window.location.pathname !== '/auth') {
        window.location.href = '/auth';
      }
    }
    return Promise.reject(error);
  },
);
