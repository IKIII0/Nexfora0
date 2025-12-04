import api from './api';
import { API_ENDPOINTS } from '../config/api';

// Get user dashboard
export const getUserDashboard = async () => {
  try {
    const response = await api.get(API_ENDPOINTS.DASHBOARD.USER);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};
