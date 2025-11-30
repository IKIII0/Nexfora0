// API Configuration untuk Railway production
const API_BASE_URL = import.meta.env.PROD 
  ? 'https://nexfora-production.up.railway.app' // Fixed Railway URL
  : ''; // Use relative URL for development to go through Vite proxy

export const API_CONFIG = {
  baseURL: API_BASE_URL,
  endpoints: {
    // Auth
    login: `${API_BASE_URL}/api/auth/login`,
    register: `${API_BASE_URL}/api/auth/register`,
    
    // User Orders
    createOrder: `${API_BASE_URL}/api/orders`,
    getUserOrders: `${API_BASE_URL}/api/orders`,
    
    // Admin Orders
    adminOrders: `${API_BASE_URL}/api/admin/orders`,
    verifyOrder: (orderId) => `${API_BASE_URL}/api/admin/orders/${orderId}/verify`,
    cancelOrder: (orderId) => `${API_BASE_URL}/api/admin/orders/${orderId}/cancel`,
  }
};

// Helper untuk membuat API calls
export const createApiCall = async (url, options = {}) => {
  const config = {
    headers: {
      'Content-Type': 'application/json',
      // Always send token if available
      ...(localStorage.getItem('token') && {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }),
      ...options.headers
    },
    ...options
  };

  try {
    const response = await fetch(url, config);
    
    // Handle non-JSON responses
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      const text = await response.text();
      throw new Error(`Server mengembalikan response yang tidak valid: ${text.slice(0, 100)}...`);
    }

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `HTTP ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};
