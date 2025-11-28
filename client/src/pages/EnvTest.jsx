import { useState } from 'react';

function EnvTest() {
  const apiUrl = import.meta.env.VITE_API_BASE_URL;
  const [testResult, setTestResult] = useState(null);
  const [loading, setLoading] = useState(false);
  
  const testAPI = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${apiUrl}/test`);
      const data = await response.json();
      setTestResult({ success: true, data, status: response.status });
    } catch (error) {
      setTestResult({ success: false, error: error.message });
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div style={{ padding: '20px', background: '#1a1a1a', color: 'white', minHeight: '100vh' }}>
      <h1>Environment Variable Test</h1>
      <div style={{ marginTop: '20px', padding: '20px', background: '#2a2a2a', borderRadius: '8px' }}>
        <h2>VITE_API_BASE_URL:</h2>
        <p style={{ fontSize: '18px', color: apiUrl ? '#4ade80' : '#ef4444', wordBreak: 'break-all' }}>
          {apiUrl || 'NOT FOUND - Using fallback'}
        </p>
        
        <h2 style={{ marginTop: '20px' }}>Expected Value:</h2>
        <p>https://nexfora0-production.up.railway.app/api</p>
        
        <h2 style={{ marginTop: '20px' }}>Test API Connection:</h2>
        <button 
          onClick={testAPI}
          disabled={loading}
          style={{
            padding: '10px 20px',
            background: '#3b82f6',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.5 : 1
          }}
        >
          {loading ? 'Testing...' : 'Test API'}
        </button>
        
        {testResult && (
          <div style={{ 
            marginTop: '10px', 
            padding: '10px', 
            background: testResult.success ? '#065f46' : '#7f1d1d',
            borderRadius: '6px'
          }}>
            <pre style={{ margin: 0, whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>
              {JSON.stringify(testResult, null, 2)}
            </pre>
          </div>
        )}
        
        <h2 style={{ marginTop: '20px' }}>All Environment Variables:</h2>
        <pre style={{ background: '#1a1a1a', padding: '10px', borderRadius: '4px', overflow: 'auto' }}>
          {JSON.stringify(import.meta.env, null, 2)}
        </pre>
      </div>
    </div>
  );
}

export default EnvTest;
