import api from './api';

// Función para registrar usuario
export const registerUser = async (userData) => {
  try {
    const response = await api.post('/user/register', userData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Función para hacer login
export const loginUser = async (credentials) => {
  try {
    const response = await api.post('/user/login', credentials);
    if (response.data.success) {
      // Guardar token
      localStorage.setItem('token', response.data.token);
      sessionStorage.setItem('token', response.data.token);
    }
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Función para hacer logout
export const logoutUser = () => {
  localStorage.removeItem('token');
  sessionStorage.removeItem('token');
};

// Función para verificar si el usuario está autenticado
export const isAuthenticated = () => {
  return !!(localStorage.getItem('token') || sessionStorage.getItem('token'));
};

// Función para obtener el token
export const getToken = () => {
  return localStorage.getItem('token') || sessionStorage.getItem('token');
};

// Función para eliminar usuario
export const deleteUser = async (username) => {
  try {
    const response = await api.delete('/user/register', { data: { username } });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};
