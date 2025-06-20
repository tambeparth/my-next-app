'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';

export default function ApiTestPage() {
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const testApi = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await axios.get('https://booking-com15.p.rapidapi.com/api/v1/hotels/searchDestination', {
        params: { query: 'Paris' },
        headers: {
          'X-RapidAPI-Key': '43f4d26f35mshce7092ec3b58911p1dd88bjsneeb2ab5758d7',
          'X-RapidAPI-Host': 'booking-com15.p.rapidapi.com'
        }
      });
      
      setResult(response.data);
    } catch (err: any) {
      console.error('API Test Error:', err);
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">API Test Page</h1>
      
      <button 
        onClick={testApi}
        className="bg-blue-600 text-white px-4 py-2 rounded mb-6"
        disabled={loading}
      >
        {loading ? 'Testing API...' : 'Test API'}
      </button>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <p className="font-bold">Error:</p>
          <p>{error}</p>
        </div>
      )}
      
      {result && (
        <div className="bg-gray-100 p-4 rounded">
          <h2 className="text-xl font-semibold mb-2">API Response:</h2>
          <pre className="bg-white p-4 rounded overflow-auto max-h-96">
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}
