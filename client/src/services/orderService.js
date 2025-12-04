import api from './api';
import { API_ENDPOINTS } from '../config/api';

// Process checkout
export const processCheckout = async (checkoutData) => {
  try {
    const response = await api.post(API_ENDPOINTS.ORDERS.CHECKOUT, checkoutData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Get user orders
export const getUserOrders = async () => {
  try {
    const response = await api.get(API_ENDPOINTS.ORDERS.GET_ALL);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Get order by ID
export const getOrderById = async (orderId) => {
  try {
    const response = await api.get(API_ENDPOINTS.ORDERS.GET_BY_ID(orderId));
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Get order statistics
export const getOrderStats = async () => {
  try {
    const response = await api.get(API_ENDPOINTS.ORDERS.GET_STATS);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Upload payment proof
export const uploadPaymentProof = async (orderId, paymentProof) => {
  try {
    const response = await api.put(API_ENDPOINTS.ORDERS.UPLOAD_PAYMENT(orderId), {
      payment_proof: paymentProof
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Cancel order
export const cancelOrder = async (orderId) => {
  try {
    const response = await api.put(API_ENDPOINTS.ORDERS.CANCEL(orderId));
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};
