import api from './api';
import { API_ENDPOINTS } from '../config/api';

// Get all categories
export const getAllCategories = async (tipe = null) => {
  try {
    const url = tipe 
      ? `${API_ENDPOINTS.CATEGORIES.GET_ALL}?tipe=${tipe}`
      : API_ENDPOINTS.CATEGORIES.GET_ALL;
    
    const response = await api.get(url);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Get categories with product count
export const getCategoriesWithCount = async () => {
  try {
    const response = await api.get(API_ENDPOINTS.CATEGORIES.GET_WITH_COUNT);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Get category by ID
export const getCategoryById = async (categoryId) => {
  try {
    const response = await api.get(API_ENDPOINTS.CATEGORIES.GET_BY_ID(categoryId));
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Create category (admin only)
export const createCategory = async (categoryData) => {
  try {
    const response = await api.post(API_ENDPOINTS.CATEGORIES.CREATE, categoryData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Update category (admin only)
export const updateCategory = async (categoryId, categoryData) => {
  try {
    const response = await api.put(API_ENDPOINTS.CATEGORIES.UPDATE(categoryId), categoryData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Delete category (admin only)
export const deleteCategory = async (categoryId) => {
  try {
    const response = await api.delete(API_ENDPOINTS.CATEGORIES.DELETE(categoryId));
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};
