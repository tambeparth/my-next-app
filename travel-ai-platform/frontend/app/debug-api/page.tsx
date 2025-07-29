'use client';

import { useState } from 'react';
import axios from 'axios';

export default function DebugApiPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [response, setResponse] = useState<any>(null);
  const [step, setStep] = useState<string | null>(null);

  const testDestinationSearch = async () => {
    setLoading(true);
    setError(null);
    setResponse(null);
    setStep('destination-search');

    try {
      const response = await axios.get('https://booking-com15.p.rapidapi.com/api/v1/hotels/searchDestination', {
        params: { query: 'Paris' },
        headers: {
          'X-RapidAPI-Key': process.env.NEXT_PUBLIC_HOTEL_API_KEY || '',
          'X-RapidAPI-Host': 'booking-com15.p.rapidapi.com'
        }
      });

      setResponse(response.data);
    } catch (err: any) {
      console.error('API Error:', err);
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  /* HOTEL SEARCH TEMPORARILY DISABLED - SECURITY: API KEY REMOVED */
  /*
  const testHotelSearch = async () => {
    if (!response?.data?.[0]?.dest_id) {
      setError('Please run destination search first to get a destination ID');
      return;
    }

    setLoading(true);
    setError(null);
    setStep('hotel-search');

    try {
      const destId = response.data[0].dest_id;

      const response = await axios.get('https://booking-com15.p.rapidapi.com/api/v1/hotels/search', {
        params: {
          destination_id: destId,
          checkin: '2024-09-27',
          checkout: '2024-09-28',
          adults: 2,
          room_qty: 1,
          currency_code: 'USD'
        },
        headers: {
          'X-RapidAPI-Key': process.env.NEXT_PUBLIC_HOTEL_API_KEY,
          'X-RapidAPI-Host': process.env.NEXT_PUBLIC_HOTEL_API_HOST
        }
      });

      setResponse(response.data);
    } catch (err: any) {
      console.error('API Error:', err);
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };
  */

  const testDirectNavigation = () => {
    window.location.href = '/hotels?destination=Paris';
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">API Debugging Page</h1>

      <div className="space-y-8">
        <div className="bg-gray-100 p-4 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Test API Endpoints</h2>

          <div className="space-y-4">
            <button
              onClick={testDestinationSearch}
              disabled={loading}
              className="bg-blue-600 text-white px-4 py-2 rounded mr-4"
            >
              {loading && step === 'destination-search' ? 'Testing...' : 'Test Destination Search'}
            </button>

            {/* HOTEL SEARCH BUTTON TEMPORARILY DISABLED */}
            {/* <button
              onClick={testHotelSearch}
              disabled={loading || !response?.data?.[0]?.dest_id}
              className="bg-green-600 text-white px-4 py-2 rounded"
            >
              {loading && step === 'hotel-search' ? 'Testing...' : 'Test Hotel Search'}
            </button> */}
          </div>
        </div>

        <div className="bg-gray-100 p-4 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Test Navigation</h2>

          <button
            onClick={testDirectNavigation}
            className="bg-purple-600 text-white px-4 py-2 rounded"
          >
            Navigate to /hotels?destination=Paris
          </button>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            <p className="font-bold">Error:</p>
            <p>{error}</p>
          </div>
        )}

        {response && (
          <div className="bg-white border border-gray-300 p-4 rounded">
            <h3 className="text-lg font-semibold mb-2">API Response:</h3>
            <pre className="bg-gray-100 p-4 rounded overflow-auto max-h-96 text-sm">
              {JSON.stringify(response, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}
