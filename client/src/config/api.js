// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

export const API_ENDPOINTS = {
  // Auth endpoints
  AUTH: {
    LOGIN: `${API_BASE_URL}/auth/login`,
    REGISTER: `${API_BASE_URL}/auth/register`,
    USER: (id) => `${API_BASE_URL}/auth/${id}`,
    ALL_USERS: `${API_BASE_URL}/auth`
  },
  
  // Product endpoints
  PRODUCTS: {
    GET_ALL: `${API_BASE_URL}/products`,
    GET_BY_ID: (id) => `${API_BASE_URL}/products/${id}`,
    GET_POPULARITY: (id) => `${API_BASE_URL}/products/${id}/popularity`,
    CREATE: `${API_BASE_URL}/products`,
    UPDATE: (id) => `${API_BASE_URL}/products/${id}`,
    DELETE: (id) => `${API_BASE_URL}/products/${id}`
  },
  
  // Category endpoints
  CATEGORIES: {
    GET_ALL: `${API_BASE_URL}/categories`,
    GET_WITH_COUNT: `${API_BASE_URL}/categories/with-count`,
    GET_BY_ID: (id) => `${API_BASE_URL}/categories/${id}`,
    CREATE: `${API_BASE_URL}/categories`,
    UPDATE: (id) => `${API_BASE_URL}/categories/${id}`,
    DELETE: (id) => `${API_BASE_URL}/categories/${id}`
  },
  
  // Order endpoints
  ORDERS: {
    CHECKOUT: `${API_BASE_URL}/orders/checkout`,
    GET_ALL: `${API_BASE_URL}/orders`,
    GET_STATS: `${API_BASE_URL}/orders/stats`,
    GET_BY_ID: (id) => `${API_BASE_URL}/orders/${id}`,
    UPLOAD_PAYMENT: (id) => `${API_BASE_URL}/orders/${id}/payment`,
    CANCEL: (id) => `${API_BASE_URL}/orders/${id}/cancel`
  },
  
  // Review endpoints
  REVIEWS: {
    GET_BY_PRODUCT: (productId) => `${API_BASE_URL}/reviews/product/${productId}`,
    GET_USER_REVIEWS: `${API_BASE_URL}/reviews/user`,
    CREATE: `${API_BASE_URL}/reviews`,
    UPDATE: (id) => `${API_BASE_URL}/reviews/${id}`,
    DELETE: (id) => `${API_BASE_URL}/reviews/${id}`
  },
  
  // Dashboard endpoints
  DASHBOARD: {
    USER: `${API_BASE_URL}/dashboard`
  },
  
  // Admin endpoints
  ADMIN: {
    DASHBOARD: `${API_BASE_URL}/admin/dashboard`,
    ORDERS: `${API_BASE_URL}/admin/orders`,
    VERIFY_ORDER: (orderId) => `${API_BASE_URL}/admin/orders/${orderId}/verify`,
    CANCEL_ORDER: (orderId) => `${API_BASE_URL}/admin/orders/${orderId}/cancel`,
    SALES_REPORT: `${API_BASE_URL}/admin/sales-report`,
    REVENUE: `${API_BASE_URL}/admin/revenue`
  }
};

export default API_BASE_URL;
