import api from './api';
import { API_ENDPOINTS } from '../config/api';

// Get product reviews
export const getProductReviews = async (productId) => {
  try {
    const response = await api.get(API_ENDPOINTS.REVIEWS.GET_BY_PRODUCT(productId));
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Get user reviews
export const getUserReviews = async () => {
  try {
    const response = await api.get(API_ENDPOINTS.REVIEWS.GET_USER_REVIEWS);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Create review
export const createReview = async (reviewData) => {
  try {
    const response = await api.post(API_ENDPOINTS.REVIEWS.CREATE, reviewData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Update review
export const updateReview = async (reviewId, reviewData) => {
  try {
    const response = await api.put(API_ENDPOINTS.REVIEWS.UPDATE(reviewId), reviewData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Delete review
export const deleteReview = async (reviewId) => {
  try {
    const response = await api.delete(API_ENDPOINTS.REVIEWS.DELETE(reviewId));
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};
