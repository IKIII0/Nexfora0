// API Configuration - Development proxy + Railway production
const API_BASE_URL = import.meta.env.DEV 
  ? ''  // Use relative URL for development proxy
  : 'https://nexfora0-production.up.railway.app'; // Production

export const API_CONFIG = {
  baseURL: API_BASE_URL,
  endpoints: {
    // Auth
    login: `${API_BASE_URL}/api/auth/login`,
    register: `${API_BASE_URL}/api/auth/register`,
    
    // Products
    getProducts: `${API_BASE_URL}/api/products`,
    getProductById: (id) => `${API_BASE_URL}/api/products/${id}`,
    
    // Categories
    getCategories: `${API_BASE_URL}/api/categories`,
    getCategoriesWithCount: `${API_BASE_URL}/api/categories/with-count`,
    
    // User Orders
    checkout: `${API_BASE_URL}/api/orders/checkout`,
    getUserOrders: `${API_BASE_URL}/api/orders`,
    getOrderById: (id) => `${API_BASE_URL}/api/orders/${id}`,
    getOrderStats: `${API_BASE_URL}/api/orders/stats`,
    uploadPayment: (id) => `${API_BASE_URL}/api/orders/${id}/payment`,
    cancelUserOrder: (id) => `${API_BASE_URL}/api/orders/${id}/cancel`,
    
    // Reviews
    getProductReviews: (productId) => `${API_BASE_URL}/api/reviews/product/${productId}`,
    getUserReviews: `${API_BASE_URL}/api/reviews/user`,
    createReview: `${API_BASE_URL}/api/reviews`,
    updateReview: (id) => `${API_BASE_URL}/api/reviews/${id}`,
    deleteReview: (id) => `${API_BASE_URL}/api/reviews/${id}`,
    
    // Dashboard
    getUserDashboard: `${API_BASE_URL}/api/dashboard`,
    
    // Admin Orders
    adminDashboard: `${API_BASE_URL}/api/admin/dashboard`,
    adminOrders: `${API_BASE_URL}/api/admin/orders`,
    verifyOrder: (orderId) => `${API_BASE_URL}/api/admin/orders/${orderId}/verify`,
    cancelOrder: (orderId) => `${API_BASE_URL}/api/admin/orders/${orderId}/cancel`,
    salesReport: `${API_BASE_URL}/api/admin/sales-report`,
    revenueReport: `${API_BASE_URL}/api/admin/revenue`,
  }
};

// Helper untuk membuat API calls
export const createApiCall = async (url, options = {}) => {
  const token = localStorage.getItem('token');
  console.log('=== API Call Debug ===');
  console.log('URL:', url);
  console.log('Token exists:', !!token);
  console.log('Token length:', token?.length || 0);
  console.log('Token:', token?.slice(0, 30) + '...');
  
  const config = {
    headers: {
      'Content-Type': 'application/json',
      // Always send token if available
      ...(token && {
        'Authorization': `Bearer ${token}`
      }),
      ...options.headers
    },
    ...options
  };

  console.log('Request headers:', config.headers);

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
