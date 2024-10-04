import api from './api';

const API_URL = '/auth'; // Esto se concatenará con la baseURL definida en api.js

export const login = async (email, password) => {
  try {
    const response = await api.post(`${API_URL}/login`, { email, password });
    console.log('Login response:', response.data);
    if (response.data.token && response.data.usuario) {
      console.log('Guardando token:', response.data.token);
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('role', response.data.usuario.role);
      console.log('Token guardado:', localStorage.getItem('token'));
      return response.data;
    } else {
      throw new Error('Respuesta del servidor inválida');
    }
  } catch (error) {
    console.error('Error in login service:', error);
    throw error;
  }
};

export const register = async (userData) => {
  return await api.post(`${API_URL}/registro`, userData);
};

export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('role');
};
