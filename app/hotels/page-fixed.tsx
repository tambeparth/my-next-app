'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import axios from 'axios';
import { Star, MapPin, Loader, ChevronRight } from 'lucide-react';

interface HotelData {
  hotel_id?: string;
  hotel_name: string;
  review_score?: number;
  address: string;
  max_photo_url?: string;
  facilities?: string[];
  min_total_price?: number;
  original_price?: number;
  hotel_description?: string;
  distance_to_cc?: string;
  class?: number;
}

export default function HotelsPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const destination = searchParams.get('destination');
  const [hotels, setHotels] = useState<HotelData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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

        console.log('Fetching hotels for destination:', destination);

        // Step 1: Get destination ID
        const destinationResponse = await axios.get('https://booking-com15.p.rapidapi.com/api/v1/hotels/searchDestination', {
          params: { query: destination },
          headers: {
            'X-RapidAPI-Key': '43f4d26f35mshce7092ec3b58911p1dd88bjsneeb2ab5758d7',
            'X-RapidAPI-Host': 'booking-com15.p.rapidapi.com'
          }
        });

        console.log('Destination response:', destinationResponse.data);

        if (!destinationResponse.data?.data || destinationResponse.data.data.length === 0) {
          throw new Error(`No destinations found for "${destination}"`);
        }

        const destId = destinationResponse.data.data[0].dest_id;
        console.log('Destination ID:', destId);

        // Step 2: Search for hotels
        const hotelsResponse = await axios.get('https://booking-com15.p.rapidapi.com/api/v1/hotels/search', {
          params: {
            destination_id: destId,
            checkin: '2024-09-27',
            checkout: '2024-09-28',
            adults: 2,
            room_qty: 1,
            currency_code: 'USD'
          },
          headers: {
            'X-RapidAPI-Key': '43f4d26f35mshce7092ec3b58911p1dd88bjsneeb2ab5758d7',
            'X-RapidAPI-Host': 'booking-com15.p.rapidapi.com'
          }
        });

        console.log('Hotels response:', hotelsResponse.data);

        if (!hotelsResponse.data?.data || hotelsResponse.data.data.length === 0) {
          throw new Error('No hotels found for this destination');
        }

        setHotels(hotelsResponse.data.data);
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

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <div className="text-red-600 mb-4">{error}</div>
        <button 
          onClick={() => router.push('/')}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Return Home
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-50 to-purple-50 p-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Hotels in {destination}</h1>
        
        <div className="space-y-6">
          {hotels.map((hotel, index) => (
            <div key={index} className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="md:flex">
                <div className="md:w-1/3 h-64 relative">
                  <img 
                    src={hotel.max_photo_url || "/hotel-placeholder.jpg"} 
                    alt={hotel.hotel_name}
                    className="w-full h-full object-cover"
                  />
                </div>
                
                <div className="md:w-2/3 p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <h2 className="text-xl font-bold mb-2">{hotel.hotel_name}</h2>
                      
                      <div className="flex items-center mb-2">
                        {[...Array(hotel.class || 4)].map((_, i) => (
                          <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                        ))}
                      </div>
                      
                      <div className="flex items-center text-gray-600 mb-4">
                        <MapPin className="h-4 w-4 mr-1" />
                        <span className="text-sm">{hotel.address}</span>
                      </div>
                      
                      {hotel.distance_to_cc && (
                        <p className="text-sm text-gray-600 mb-2">
                          {hotel.distance_to_cc} from city center
                        </p>
                      )}
                    </div>
                    
                    <div className="text-right">
                      {hotel.review_score && (
                        <div className="bg-blue-600 text-white px-3 py-2 rounded-lg font-bold mb-2">
                          {hotel.review_score.toFixed(1)}
                        </div>
                      )}
                      
                      <div className="text-lg font-bold text-blue-600">
                        ${hotel.min_total_price || 'N/A'}
                        <span className="text-sm text-gray-500">/night</span>
                      </div>
                      
                      {hotel.original_price && (
                        <div className="text-sm text-gray-500 line-through">
                          ${hotel.original_price}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {hotel.facilities && hotel.facilities.length > 0 && (
                    <div className="mt-4">
                      <h3 className="text-sm font-semibold mb-2">Amenities</h3>
                      <div className="flex flex-wrap gap-3">
                        {hotel.facilities.slice(0, 4).map((facility, i) => (
                          <div key={i} className="flex items-center text-sm text-gray-600">
                            <Star className="h-3 w-3 mr-1" />
                            <span>{facility}</span>
                          </div>
                        ))}
                        {hotel.facilities.length > 4 && (
                          <span className="text-sm text-gray-500">+{hotel.facilities.length - 4} more</span>
                        )}
                      </div>
                    </div>
                  )}
                  
                  <div className="mt-6 flex justify-end">
                    <Link 
                      href={`/hotel?destination=${destination}&hotel_id=${hotel.hotel_id}`}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
                    >
                      <span>View Details</span>
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {hotels.length === 0 && !loading && !error && (
          <div className="text-center py-12">
            <p className="text-gray-600">No hotels found for this destination.</p>
          </div>
        )}
      </div>
    </div>
  );
}
