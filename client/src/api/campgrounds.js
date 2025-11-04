import axios from 'axios';

const API_URL = 'http://localhost:3000/api/campgrounds';

axios.defaults.withCredentials = true;

export const getCampgrounds = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

export const getCampground = async (id) => {
  const response = await axios.get(`${API_URL}/${id}`);
  return response.data;
};

export const createCampground = async (campgroundData) => {
  // Nota: Para lidar com upload de arquivos (imagens), o backend espera FormData.
  // O frontend React precisará montar o FormData corretamente.
  const response = await axios.post(API_URL, campgroundData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const updateCampground = async (id, campgroundData) => {
  const response = await axios.put(`${API_URL}/${id}`, campgroundData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const deleteCampground = async (id) => {
  const response = await axios.delete(`${API_URL}/${id}`);
  return response.data;
};

export const deleteCampgroundImage = async (id, filename) => {
  const response = await axios.put(`${API_URL}/${id}`, { deleteImages: [filename] });
  return response.data;
};
