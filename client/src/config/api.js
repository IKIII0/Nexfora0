// API Configuration
const API_BASE_URL = "https://nexfora0-production.up.railway.app/api";

export const API_ENDPOINTS = {
  // Auth endpoints
  AUTH: {
    LOGIN: `${API_BASE_URL}/auth/login`,
    REGISTER: `${API_BASE_URL}/auth/register`,
    USER: (id) => `${API_BASE_URL}/auth/${id}`,
    ALL_USERS: `${API_BASE_URL}/auth`
  },
  
  // Order endpoints
  ORDERS: {
    CREATE: `${API_BASE_URL}/orders`,
    GET_ALL: `${API_BASE_URL}/orders`,
    GET_BY_ID: (id) => `${API_BASE_URL}/orders/${id}`,
    CANCEL: (id) => `${API_BASE_URL}/orders/${id}/cancel`,
    UPDATE_STATUS: (id) => `${API_BASE_URL}/orders/${id}/status`,
    GET_ALL_ADMIN: `${API_BASE_URL}/orders/all`
  }
};

export default API_BASE_URL;
