'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import axios from 'axios';
import { Star, MapPin, Loader } from 'lucide-react';

export default function HotelsServerPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const destination = searchParams.get('destination');
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [debugInfo, setDebugInfo] = useState({
    steps: [],
    response: null
  });

  useEffect(() => {
    const fetchHotels = async () => {
      if (!destination) {
        setError('No destination specified');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError('');
        
        setDebugInfo(prev => ({
          ...prev,
          steps: [...prev.steps, 'Starting API call to server endpoint']
        }));

        // Use our server-side API route
        const response = await axios.get(`/api/hotel-search?destination=${encodeURIComponent(destination)}`);
        
        setDebugInfo(prev => ({
          ...prev,
          steps: [...prev.steps, 'Server API call successful'],
          response: response.data
        }));

        setHotels(response.data.hotels.data);
      } catch (err: any) {
        console.error('Error fetching hotels:', err);
        
        setDebugInfo(prev => ({
          ...prev,
          steps: [...prev.steps, `API call failed: ${err.message}`],
          response: err.response?.data || null
        }));
        
        setError(err.response?.data?.error || err.message || 'Failed to load hotels. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchHotels();
  }, [destination]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Hotels in {destination} (Server API)</h1>
        
        {error ? (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            <p className="font-bold">Error:</p>
            <p>{error}</p>
          </div>
        ) : (
          <div className="space-y-4">
            {hotels.map((hotel: any, index) => (
              <div key={index} className="bg-white rounded-lg shadow p-4">
                <h2 className="text-xl font-bold">{hotel.hotel_name}</h2>
                <div className="flex items-center mt-2">
                  <MapPin className="h-4 w-4 text-gray-500 mr-1" />
                  <span className="text-sm text-gray-600">{hotel.address}</span>
                </div>
                {hotel.review_score && (
                  <div className="flex items-center mt-2">
                    <Star className="h-4 w-4 text-yellow-500 mr-1" />
                    <span>{hotel.review_score.toFixed(1)}</span>
                  </div>
                )}
                <div className="mt-2 text-blue-600 font-bold">
                  ${hotel.min_total_price || 'N/A'} per night
                </div>
              </div>
            ))}
          </div>
        )}
        
        <div className="mt-8 bg-white p-4 rounded-lg shadow">
          <h2 className="text-xl font-bold mb-2">Debug Information</h2>
          <div className="space-y-2">
            <p><strong>Destination:</strong> {destination || 'None'}</p>
            <p><strong>Steps:</strong></p>
            <ul className="list-disc pl-5">
              {debugInfo.steps.map((step, index) => (
                <li key={index}>{step}</li>
              ))}
            </ul>
            
            {debugInfo.response && (
              <div>
                <p><strong>API Response:</strong></p>
                <pre className="bg-gray-100 p-2 rounded text-xs overflow-auto max-h-40">
                  {JSON.stringify(debugInfo.response, null, 2)}
                </pre>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
