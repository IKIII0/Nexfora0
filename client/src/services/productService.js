import api from './api';
import { API_ENDPOINTS } from '../config/api';

// Get all products with filters
export const getAllProducts = async (filters = {}) => {
  try {
    const params = new URLSearchParams();
    
    if (filters.category_id) params.append('category_id', filters.category_id);
    if (filters.tipe) params.append('tipe', filters.tipe);
    if (filters.level) params.append('level', filters.level);
    if (filters.min_price) params.append('min_price', filters.min_price);
    if (filters.max_price) params.append('max_price', filters.max_price);
    if (filters.search) params.append('search', filters.search);
    
    const url = params.toString() 
      ? `${API_ENDPOINTS.PRODUCTS.GET_ALL}?${params.toString()}`
      : API_ENDPOINTS.PRODUCTS.GET_ALL;
    
    const response = await api.get(url);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Get product by ID
export const getProductById = async (productId) => {
  try {
    const response = await api.get(API_ENDPOINTS.PRODUCTS.GET_BY_ID(productId));
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Get product popularity
export const getProductPopularity = async (productId) => {
  try {
    const response = await api.get(API_ENDPOINTS.PRODUCTS.GET_POPULARITY(productId));
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Create product (admin only)
export const createProduct = async (productData) => {
  try {
    const response = await api.post(API_ENDPOINTS.PRODUCTS.CREATE, productData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Update product (admin only)
export const updateProduct = async (productId, productData) => {
  try {
    const response = await api.put(API_ENDPOINTS.PRODUCTS.UPDATE(productId), productData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Delete product (admin only)
export const deleteProduct = async (productId) => {
  try {
    const response = await api.delete(API_ENDPOINTS.PRODUCTS.DELETE(productId));
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};
