'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Star, MapPin, Loader } from 'lucide-react';

export default function HotelsDirectPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const destination = searchParams.get('destination');
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [debugInfo, setDebugInfo] = useState({
    steps: [],
    responses: {}
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
        
        // Add debug info
        setDebugInfo(prev => ({
          ...prev,
          steps: [...prev.steps, 'Starting API calls with fetch']
        }));

        // Step 1: Get destination ID
        let destResponse;
        try {
          const destRes = await fetch(`https://booking-com15.p.rapidapi.com/api/v1/hotels/searchDestination?query=${encodeURIComponent(destination)}`, {
            method: 'GET',
            headers: {
              'X-RapidAPI-Key': '43f4d26f35mshce7092ec3b58911p1dd88bjsneeb2ab5758d7',
              'X-RapidAPI-Host': 'booking-com15.p.rapidapi.com'
            }
          });
          
          destResponse = await destRes.json();
          
          setDebugInfo(prev => ({
            ...prev,
            steps: [...prev.steps, 'Destination search successful'],
            responses: {
              ...prev.responses,
              destination: destResponse
            }
          }));
        } catch (destErr: any) {
          setDebugInfo(prev => ({
            ...prev,
            steps: [...prev.steps, `Destination search failed: ${destErr.message}`]
          }));
          throw new Error(`Failed to search destination: ${destErr.message}`);
        }

        if (!destResponse?.data || destResponse.data.length === 0) {
          throw new Error(`No destinations found for "${destination}"`);
        }

        const destId = destResponse.data[0].dest_id;
        
        // Step 2: Search for hotels
        let hotelsResponse;
        try {
          const hotelsRes = await fetch(`https://booking-com15.p.rapidapi.com/api/v1/hotels/search?destination_id=${destId}&checkin=2024-09-27&checkout=2024-09-28&adults=2&room_qty=1&currency_code=USD`, {
            method: 'GET',
            headers: {
              'X-RapidAPI-Key': '43f4d26f35mshce7092ec3b58911p1dd88bjsneeb2ab5758d7',
              'X-RapidAPI-Host': 'booking-com15.p.rapidapi.com'
            }
          });
          
          hotelsResponse = await hotelsRes.json();
          
          setDebugInfo(prev => ({
            ...prev,
            steps: [...prev.steps, 'Hotel search successful'],
            responses: {
              ...prev.responses,
              hotels: hotelsResponse
            }
          }));
        } catch (hotelErr: any) {
          setDebugInfo(prev => ({
            ...prev,
            steps: [...prev.steps, `Hotel search failed: ${hotelErr.message}`]
          }));
          throw new Error(`Failed to search hotels: ${hotelErr.message}`);
        }

        if (!hotelsResponse?.data || hotelsResponse.data.length === 0) {
          throw new Error('No hotels found for this destination');
        }

        setHotels(hotelsResponse.data);
      } catch (err: any) {
        console.error('Error fetching hotels:', err);
        setError(err.message || 'Failed to load hotels. Please try again later.');
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
        <h1 className="text-3xl font-bold mb-6">Hotels in {destination} (Direct API)</h1>
        
        {error ? (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            <p className="font-bold">Error:</p>
            <p>{error}</p>
            
            <div className="mt-4">
              <h3 className="font-semibold">Debug Information:</h3>
              <ul className="list-disc pl-5">
                {debugInfo.steps.map((step, index) => (
                  <li key={index}>{step}</li>
                ))}
              </ul>
            </div>
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
            
            {Object.keys(debugInfo.responses).length > 0 && (
              <div>
                <p><strong>API Responses:</strong></p>
                <pre className="bg-gray-100 p-2 rounded text-xs overflow-auto max-h-40">
                  {JSON.stringify(debugInfo.responses, null, 2)}
                </pre>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
