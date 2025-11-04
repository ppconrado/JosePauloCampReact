import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

// Configura o axios para enviar cookies (necessário para a sessão do Passport)
axios.defaults.withCredentials = true;

export const registerUser = async (userData) => {
  const response = await axios.post(`${API_URL}/register`, userData);
  return response.data;
};

export const loginUser = async (userData) => {
  const response = await axios.post(`${API_URL}/login`, userData);
  return response.data;
};

export const logoutUser = async () => {
  const response = await axios.get(`${API_URL}/logout`);
  return response.data;
};

export const getCurrentUser = async () => {
  try {
    const response = await axios.get(`${API_URL}/current-user`);
    return response.data.user;
  } catch (error) {
    return null;
  }
};
