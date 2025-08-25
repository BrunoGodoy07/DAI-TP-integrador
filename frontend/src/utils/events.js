import api from './api';

// Obtener todos los eventos
export const getAllEvents = async (page = 1, limit = 10) => {
  try {
    const response = await api.get(`/event?page=${page}&limit=${limit}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Buscar eventos por filtros
export const searchEvents = async (filters) => {
  try {
    const params = new URLSearchParams();
    if (filters.name) params.append('name', filters.name);
    if (filters.startdate) params.append('startdate', filters.startdate);
    if (filters.tag) params.append('tag', filters.tag);
    
    const response = await api.get(`/event?${params.toString()}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Obtener evento por ID
export const getEventById = async (id) => {
  try {
    const response = await api.get(`/event/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Crear evento
export const createEvent = async (eventData) => {
  try {
    const response = await api.post('/event', eventData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Actualizar evento
export const updateEvent = async (id, eventData) => {
  try {
    const response = await api.put(`/event/${id}`, eventData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Eliminar evento
export const deleteEvent = async (id) => {
  try {
    const response = await api.delete(`/event/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Inscribirse a un evento
export const enrollInEvent = async (eventId) => {
  try {
    const response = await api.post(`/event/${eventId}/enrollment/`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Desinscribirse de un evento
export const unenrollFromEvent = async (eventId) => {
  try {
    const response = await api.delete(`/event/${eventId}/enrollment/`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Obtener participantes de un evento
export const getEventParticipants = async (eventId) => {
  try {
    const response = await api.get(`/event/${eventId}/participants`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};
