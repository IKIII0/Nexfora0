// API Helper Functions
const API_BASE_URL = "https://nexfora0-production.up.railway.app/api";

/**
 * Generic API fetch function with error handling
 * @param {string} url - API endpoint URL
 * @param {Object} options - Fetch options (method, headers, body)
 * @returns {Promise<Object>} - JSON response data
 */
export const apiFetch = async (url, options = {}) => {
  try {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options
    });

    // Check if response is JSON
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      const text = await response.text();
      console.error('Non-JSON response:', text);
      throw new Error('Server error: Invalid response format');
    }

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || `HTTP error! status: ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

/**
 * Authenticated API fetch function
 * @param {string} url - API endpoint URL
 * @param {Object} options - Fetch options
 * @param {string} token - JWT token
 * @returns {Promise<Object>} - JSON response data
 */
export const authenticatedApiFetch = async (url, options = {}, token) => {
  if (!token) {
    throw new Error('Authentication token required');
  }

  return apiFetch(url, {
    ...options,
    headers: {
      ...options.headers,
      'Authorization': `Bearer ${token}`
    }
  });
};

/**
 * GET request with authentication
 */
export const apiGet = async (endpoint, token) => {
  return authenticatedApiFetch(`${API_BASE_URL}${endpoint}`, { method: 'GET' }, token);
};

/**
 * POST request with authentication
 */
export const apiPost = async (endpoint, data, token) => {
  console.log('API POST Request:', { endpoint, data, hasToken: !!token });
  
  return authenticatedApiFetch(
    `${API_BASE_URL}${endpoint}`, 
    {
      method: 'POST',
      body: JSON.stringify(data)
    }, 
    token
  );
};

/**
 * PUT request with authentication
 */
export const apiPut = async (endpoint, data, token) => {
  return authenticatedApiFetch(
    `${API_BASE_URL}${endpoint}`, 
    {
      method: 'PUT',
      body: JSON.stringify(data)
    }, 
    token
  );
};

/**
 * DELETE request with authentication
 */
export const apiDelete = async (endpoint, token) => {
  return authenticatedApiFetch(`${API_BASE_URL}${endpoint}`, { method: 'DELETE' }, token);
};
