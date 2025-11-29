import React, { useState } from 'react';
import { authService } from '../services/authService';
import { apiGet, apiPost } from '../utils/apiHelpers';

function ApiTest() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const addResult = (test, result) => {
    setResults(prev => [...prev, { test, result, timestamp: new Date().toLocaleTimeString() }]);
  };

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

  const testBasicAPI = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/test`);
      const data = await response.json();
      addResult('Basic API Test', { success: true, data, status: response.status });
    } catch (error) {
      addResult('Basic API Test', { success: false, error: error.message });
    } finally {
      setLoading(false);
    }
  };

  const testAuthAPI = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/auth/test`);
      const data = await response.json();
      addResult('Auth API Test', { success: true, data, status: response.status });
    } catch (error) {
      addResult('Auth API Test', { success: false, error: error.message });
    } finally {
      setLoading(false);
    }
  };

  const testLogin = async () => {
    try {
      setLoading(true);
      const data = await authService.login('test@example.com', 'password123');
      addResult('Login Test', { success: true, data });
    } catch (error) {
      addResult('Login Test', { success: false, error: error.message });
    } finally {
      setLoading(false);
    }
  };

  const testRegister = async () => {
    try {
      setLoading(true);
      const data = await authService.register('Test User', 'test@example.com', 'password123', 'password123');
      addResult('Register Test', { success: true, data });
    } catch (error) {
      addResult('Register Test', { success: false, error: error.message });
    } finally {
      setLoading(false);
    }
  };

  const testOrders = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      if (!token) {
        addResult('Orders Test', { success: false, error: 'No token found in localStorage' });
        return;
      }
      
      // Debug token info
      const tokenParts = token.split('.');
      const tokenPayload = tokenParts.length === 3 ? JSON.parse(atob(tokenParts[1])) : null;
      
      addResult('Token Debug', { 
        success: true, 
        tokenLength: token.length,
        tokenParts: tokenParts.length,
        payload: tokenPayload,
        expired: tokenPayload ? tokenPayload.exp * 1000 < Date.now() : null
      });
      
      const data = await apiGet('/orders', token);
      addResult('Orders Test', { success: true, data });
    } catch (error) {
      addResult('Orders Test', { success: false, error: error.message });
    } finally {
      setLoading(false);
    }
  };

  const testTokenValidation = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      if (!token) {
        addResult('Token Validation', { success: false, error: 'No token found' });
        return;
      }
      
      // Test token with a simple API call
      const response = await fetch(`${API_BASE_URL}/orders`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      
      const contentType = response.headers.get('content-type');
      const text = await response.text();
      
      addResult('Token Validation', { 
        success: response.ok,
        status: response.status,
        statusText: response.statusText,
        contentType: contentType,
        responseText: text.substring(0, 200)
      });
    } catch (error) {
      addResult('Token Validation', { success: false, error: error.message });
    } finally {
      setLoading(false);
    }
  };

  const testEchoRequest = async () => {
    try {
      setLoading(true);
      
      const testData = {
        message: "Echo test",
        tipe_pemesanan: "kelas",
        nama_paket: "Test Package",
        timestamp: new Date().toISOString()
      };
      
      console.log('Testing echo with data:', testData);
      
      const response = await fetch(`${API_BASE_URL}/echo`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(testData),
      });

      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text();
        throw new Error(`Non-JSON response: ${text.substring(0, 200)}`);
      }

      const data = await response.json();
      addResult('Echo Test', { success: response.ok, status: response.status, data });
    } catch (error) {
      addResult('Echo Test', { success: false, error: error.message });
    } finally {
      setLoading(false);
    }
  };

  const testPostRequest = async () => {
    try {
      setLoading(true);
      
      const testData = {
        message: "Hello from debug page",
        timestamp: new Date().toISOString(),
        data: { test: true }
      };
      
      console.log('Testing POST with data:', testData);
      
      const response = await fetch(`${API_BASE_URL}/test-post`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(testData),
      });

      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text();
        throw new Error(`Non-JSON response: ${text.substring(0, 200)}`);
      }

      const data = await response.json();
      addResult('POST Test', { success: response.ok, status: response.status, data });
    } catch (error) {
      addResult('POST Test', { success: false, error: error.message });
    } finally {
      setLoading(false);
    }
  };

  const testCreateOrder = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      if (!token) {
        addResult('Create Order Test', { success: false, error: 'No token found - please login first' });
        return;
      }
      
      const orderData = {
        tipe_pemesanan: 'kelas',
        nama_paket: 'JavaScript Basic',
        total: 250000,
        catatan: 'Test order from debug page',
        nama_lengkap: 'Debug User',
        email: 'debug@example.com'
      };
      
      console.log('Creating order with data:', orderData);
      
      const data = await apiPost('/orders', orderData, token);
      addResult('Create Order Test', { success: true, data });
    } catch (error) {
      addResult('Create Order Test', { success: false, error: error.message });
    } finally {
      setLoading(false);
    }
  };

  const clearResults = () => {
    setResults([]);
  };

  const clearToken = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    addResult('Clear Token', { success: true, message: 'Token and user cleared from localStorage' });
  };

  const checkLocalStorage = () => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    addResult('Local Storage Check', { 
      success: true,
      hasToken: !!token,
      tokenLength: token ? token.length : 0,
      hasUser: !!user,
      userInfo: user ? JSON.parse(user) : null
    });
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">API Debug Test</h1>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <button 
            onClick={testBasicAPI}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 px-4 py-2 rounded"
          >
            Test Basic API
          </button>
          <button 
            onClick={testAuthAPI}
            disabled={loading}
            className="bg-green-600 hover:bg-green-700 disabled:bg-gray-600 px-4 py-2 rounded"
          >
            Test Auth API
          </button>
          <button 
            onClick={testEchoRequest}
            disabled={loading}
            className="bg-lime-600 hover:bg-lime-700 disabled:bg-gray-600 px-4 py-2 rounded"
          >
            Test Echo
          </button>
          <button 
            onClick={testLogin}
            disabled={loading}
            className="bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 px-4 py-2 rounded"
          >
            Test Login
          </button>
          <button 
            onClick={testRegister}
            disabled={loading}
            className="bg-yellow-600 hover:bg-yellow-700 disabled:bg-gray-600 px-4 py-2 rounded"
          >
            Test Register
          </button>
          <button 
            onClick={testOrders}
            disabled={loading}
            className="bg-red-600 hover:bg-red-700 disabled:bg-gray-600 px-4 py-2 rounded"
          >
            Test Orders
          </button>
          <button 
            onClick={testCreateOrder}
            disabled={loading}
            className="bg-pink-600 hover:bg-pink-700 disabled:bg-gray-600 px-4 py-2 rounded"
          >
            Create Order
          </button>
          <button 
            onClick={testTokenValidation}
            disabled={loading}
            className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-600 px-4 py-2 rounded"
          >
            Validate Token
          </button>
          <button 
            onClick={checkLocalStorage}
            disabled={loading}
            className="bg-teal-600 hover:bg-teal-700 disabled:bg-gray-600 px-4 py-2 rounded"
          >
            Check Storage
          </button>
          <button 
            onClick={clearToken}
            disabled={loading}
            className="bg-orange-600 hover:bg-orange-700 disabled:bg-gray-600 px-4 py-2 rounded"
          >
            Clear Token
          </button>
          <button 
            onClick={clearResults}
            className="bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded col-span-2 md:col-span-4"
          >
            Clear Results
          </button>
        </div>

        {loading && (
          <div className="text-center mb-4">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
            <p className="mt-2">Testing...</p>
          </div>
        )}

        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Results:</h2>
          {results.length === 0 ? (
            <p className="text-gray-400">No tests run yet</p>
          ) : (
            results.map((result, index) => (
              <div 
                key={index} 
                className={`p-4 rounded ${result.result.success ? 'bg-green-900' : 'bg-red-900'}`}
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold">{result.test}</h3>
                  <span className="text-sm text-gray-300">{result.timestamp}</span>
                </div>
                <pre className="text-sm overflow-x-auto">
                  {JSON.stringify(result.result, null, 2)}
                </pre>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default ApiTest;
