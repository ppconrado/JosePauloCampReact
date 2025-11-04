// import axios from 'axios';

// const API_URL = 'http://localhost:3000/api/campgrounds';

// axios.defaults.withCredentials = true;

// export const getCampgrounds = async () => {
//   const response = await axios.get(API_URL);
//   return response.data;
// };

// export const getCampground = async (id) => {
//   const response = await axios.get(`${API_URL}/${id}`);
//   return response.data;
// };

// export const createCampground = async (campgroundData) => {
//   // Nota: Para lidar com upload de arquivos (imagens), o backend espera FormData.
//   // O frontend React precisará montar o FormData corretamente.
//   const response = await axios.post(API_URL, campgroundData, {
//     headers: {
//       'Content-Type': 'multipart/form-data',
//     },
//   });
//   return response.data;
// };

// export const updateCampground = async (id, campgroundData) => {
//   const response = await axios.put(`${API_URL}/${id}`, campgroundData, {
//     headers: {
//       'Content-Type': 'multipart/form-data',
//     },
//   });
//   return response.data;
// };

// export const deleteCampground = async (id) => {
//   const response = await axios.delete(`${API_URL}/${id}`);
//   return response.data;
// };

// export const deleteCampgroundImage = async (id, filename) => {
//   const response = await axios.put(`${API_URL}/${id}`, { deleteImages: [filename] });
//   return response.data;
// };
import api from './api';

export const getCampgrounds = async () => {
  try {
    const response = await api.get('/api/campgrounds');
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || 'Erro ao carregar acampamentos';
  }
};

export const getCampground = async (id) => {
  try {
    const response = await api.get(`/api/campgrounds/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || 'Erro ao carregar acampamento';
  }
};

export const createCampground = async (formData) => {
  try {
    const response = await api.post('/api/campgrounds', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || 'Erro ao criar acampamento';
  }
};

export const updateCampground = async (id, formData) => {
  try {
    const response = await api.put(`/api/campgrounds/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || 'Erro ao atualizar acampamento';
  }
};

export const deleteCampground = async (id) => {
  try {
    const response = await api.delete(`/api/campgrounds/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || 'Erro ao deletar acampamento';
  }
};
