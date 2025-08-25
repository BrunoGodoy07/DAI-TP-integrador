import api from './api';

// Obtener todas las ubicaciones del usuario
export const getUserLocations = async (page = 1, limit = 10) => {
  try {
    const response = await api.get(`/event-location?page=${page}&limit=${limit}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Obtener ubicación por ID
export const getLocationById = async (id) => {
  try {
    const response = await api.get(`/event-location/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Crear ubicación
export const createLocation = async (locationData) => {
  try {
    const response = await api.post('/event-location', locationData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Actualizar ubicación
export const updateLocation = async (id, locationData) => {
  try {
    const response = await api.put(`/event-location/${id}`, locationData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Eliminar ubicación
export const deleteLocation = async (id) => {
  try {
    const response = await api.delete(`/event-location/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};
