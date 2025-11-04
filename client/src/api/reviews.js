import api from './api';

export const createReview = async (campgroundId, reviewData) => {
  try {
    const response = await api.post(
      `/api/campgrounds/${campgroundId}/reviews`,
      reviewData
    );
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || 'Erro ao criar review';
  }
};

export const deleteReview = async (campgroundId, reviewId) => {
  try {
    const response = await api.delete(
      `/api/campgrounds/${campgroundId}/reviews/${reviewId}`
    );
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || 'Erro ao deletar review';
  }
};

export const updateReview = async (campgroundId, reviewId, reviewData) => {
  try {
    const response = await api.put(
      `/api/campgrounds/${campgroundId}/reviews/${reviewId}`,
      reviewData
    );
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || 'Erro ao atualizar review';
  }
};
