import api from './api';
import { API_ENDPOINTS } from '../config/api';

// Get admin dashboard
export const getAdminDashboard = async () => {
  try {
    const response = await api.get(API_ENDPOINTS.ADMIN.DASHBOARD);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Get all orders (admin)
export const getAllOrders = async () => {
  try {
    const response = await api.get(API_ENDPOINTS.ADMIN.ORDERS);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Verify order
export const verifyOrder = async (orderId) => {
  try {
    const response = await api.put(API_ENDPOINTS.ADMIN.VERIFY_ORDER(orderId));
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Cancel order
export const cancelOrder = async (orderId) => {
  try {
    const response = await api.put(API_ENDPOINTS.ADMIN.CANCEL_ORDER(orderId));
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Get sales report
export const getSalesReport = async () => {
  try {
    const response = await api.get(API_ENDPOINTS.ADMIN.SALES_REPORT);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Get revenue report
export const getRevenueReport = async (startDate = null, endDate = null) => {
  try {
    const params = new URLSearchParams();
    if (startDate) params.append('start_date', startDate);
    if (endDate) params.append('end_date', endDate);
    
    const url = params.toString()
      ? `${API_ENDPOINTS.ADMIN.REVENUE}?${params.toString()}`
      : API_ENDPOINTS.ADMIN.REVENUE;
    
    const response = await api.get(url);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};
