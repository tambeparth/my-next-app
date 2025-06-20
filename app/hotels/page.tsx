'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Star, MapPin, Loader, ChevronRight, Wifi, Waves, Utensils, Heart } from 'lucide-react';
import {
  searchDestination,
  searchHotels,
  getHotelPhotos,
  getStaticHotelPhotos,
  HotelData,
  DestinationResponse,
  HotelSearchResponse,
  HotelPhotosResponse
} from "../../services/hotelApiService";

const amenityIcons: Record<string, React.ReactNode> = {
  "Free Wi-Fi": <Wifi className="h-4 w-4" />,
  "Swimming Pool": <Waves className="h-4 w-4" />,
  "Restaurant": <Utensils className="h-4 w-4" />,
  "Spa": <Heart className="h-4 w-4" />,
};

// Extended HotelData interface for UI compatibility with legacy code
interface ExtendedHotelData extends HotelData {
  id?: string;
  name?: string;
  location?: string;
  rating?: number;
  price?: number | string;
  stars?: number;
  photo?: string;
  main_photo_url?: string;
  image?: string;
  amenities?: string[];
}

export default function HotelsPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const destination = searchParams?.get('destination') || '';
  const [hotels, setHotels] = useState<ExtendedHotelData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Debug information
  console.log('Hotels page loaded');
  console.log('Destination from URL:', destination);
  const [debugInfo, setDebugInfo] = useState<{
    steps: string[];
    responses: Record<string, any>;
  }>({
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

        // Reset debug info
        setDebugInfo({
          steps: ['Starting API calls using fetch'],
          responses: {}
        });

        console.log('Fetching hotels for destination:', destination);

        // Step 1: Search for destination using fetch API
        let destResponse: any;
        try {
          console.log('Searching for destination:', destination);

          // Try to use the real API with fetch
          try {
            setDebugInfo(prev => ({
              ...prev,
              steps: [...prev.steps, `Attempting API destination search for: ${destination}`]
            }));

            // Use fetch instead of axios with exact URL format from RapidAPI docs
            const destUrl = `https://booking-com15.p.rapidapi.com/api/v1/hotels/searchDestination?query=${encodeURIComponent(destination)}`;
            const options = {
              method: 'GET',
              headers: {
                'X-RapidAPI-Key': '43f4d26f35mshce7092ec3b58911p1dd88bjsneeb2ab5758d7',
                'X-RapidAPI-Host': 'booking-com15.p.rapidapi.com'
              }
            };

            console.log('Destination search URL:', destUrl);

            const response = await fetch(destUrl, options);

            if (!response.ok) {
              const errorText = await response.text();
              console.error('Destination API error response:', errorText);
              throw new Error(`Destination API responded with status: ${response.status}, message: ${errorText}`);
            }

            destResponse = await response.json();
            console.log('API destination response:', destResponse);

            // Update debug info
            setDebugInfo(prev => ({
              ...prev,
              steps: [...prev.steps, 'API destination search successful'],
              responses: {
                ...prev.responses,
                destination: destResponse
              }
            }));
          } catch (apiError: any) {
            console.error('API destination search failed, using mock data:', apiError);
            setDebugInfo(prev => ({
              ...prev,
              steps: [...prev.steps, `API destination search failed: ${apiError.message}`]
            }));

            // Fallback to mock data if API fails
            destResponse = {
              status: true,
              message: "Success (Mock)",
              timestamp: Date.now(),
              data: [
                {
                  dest_id: `${destination.toLowerCase().replace(/\s+/g, '-')}-123456`,
                  dest_type: "city",
                  city_name: destination,
                  country_name: "Country",
                  image_url: 'data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%22288%22%20height%3D%22225%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20288%20225%22%20preserveAspectRatio%3D%22none%22%3E%3Cdefs%3E%3Cstyle%20type%3D%22text%2Fcss%22%3E%23holder_18e5fca5cc8%20text%20%7B%20fill%3A%23eceeef%3Bfont-weight%3Abold%3Bfont-family%3AArial%2C%20Helvetica%2C%20Open%20Sans%2C%20sans-serif%2C%20monospace%3Bfont-size%3A14pt%20%7D%20%3C%2Fstyle%3E%3C%2Fdefs%3E%3Cg%20id%3D%22holder_18e5fca5cc8%22%3E%3Crect%20width%3D%22288%22%20height%3D%22225%22%20fill%3D%22%2355595c%22%3E%3C%2Frect%3E%3Cg%3E%3Ctext%20x%3D%2296.82500076293945%22%20y%3D%22118.74000034332275%22%3EDestination%20Image%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E'
                }
              ]
            };

            // Update debug info
            setDebugInfo(prev => ({
              ...prev,
              steps: [...prev.steps, 'Fallback to mock destination data'],
              responses: {
                ...prev.responses,
                destination: destResponse
              }
            }));
          }
        } catch (destErr: any) {
          console.error('Destination search completely failed:', destErr);

          // Update debug info
          setDebugInfo(prev => ({
            ...prev,
            steps: [...prev.steps, `Destination search failed: ${destErr.message}`]
          }));

          throw new Error(`Failed to search destination: ${destErr.message}`);
        }

        // Process destination response
        let destId = null;

        // Check if the response has a data property that's an array
        if (destResponse?.data && Array.isArray(destResponse.data) && destResponse.data.length > 0) {
          destId = destResponse.data[0].dest_id;
        }
        // Check if the response itself is an array
        else if (Array.isArray(destResponse) && destResponse.length > 0) {
          destId = destResponse[0].dest_id;
        }
        // Check if the response has a dest_id directly
        else if (destResponse?.dest_id) {
          destId = destResponse.dest_id;
        }

        if (!destId) {
          console.error('No destination ID found in response:', destResponse);
          throw new Error(`No destinations found for "${destination}"`);
        }
        console.log('Destination ID:', destId);

        // Step 2: Search for hotels using fetch API
        let hotelsResponse: any;
        try {
          // Format dates for the API
          const today = new Date();
          const tomorrow = new Date(today);
          tomorrow.setDate(tomorrow.getDate() + 1);
          const checkIn = today.toISOString().split('T')[0];
          const checkOut = tomorrow.toISOString().split('T')[0];

          console.log('Searching for hotels with params:', { destId, checkIn, checkOut });

          // Try to use the real API with fetch
          try {
            setDebugInfo(prev => ({
              ...prev,
              steps: [...prev.steps, `Attempting API hotel search for destination ID: ${destId}`]
            }));

            // Use fetch instead of axios with exact URL format from RapidAPI docs
            // Use the searchHotels endpoint which is the correct one for this API
            const hotelUrl = `https://booking-com15.p.rapidapi.com/api/v1/hotels/searchHotels?dest_id=${destId}&search_type=CITY&arrival_date=${checkIn}&departure_date=${checkOut}&adults=2&children_age=0,0&room_qty=1&page_number=1&currency_code=USD&sort_by=popularity`;
            const options = {
              method: 'GET',
              headers: {
                'X-RapidAPI-Key': '43f4d26f35mshce7092ec3b58911p1dd88bjsneeb2ab5758d7',
                'X-RapidAPI-Host': 'booking-com15.p.rapidapi.com'
              }
            };

            console.log('Hotel search URL:', hotelUrl);

            const response = await fetch(hotelUrl, options);

            if (!response.ok) {
              const errorText = await response.text();
              console.error('Hotel search API error response:', errorText);
              throw new Error(`Hotel search API responded with status: ${response.status}, message: ${errorText}`);
            }

            hotelsResponse = await response.json();
            console.log('API hotels response:', hotelsResponse);

            // Update debug info
            setDebugInfo(prev => ({
              ...prev,
              steps: [...prev.steps, 'API hotel search successful'],
              responses: {
                ...prev.responses,
                hotels: hotelsResponse
              }
            }));
          } catch (apiError: any) {
            console.error('API hotel search failed, using mock data:', apiError);
            setDebugInfo(prev => ({
              ...prev,
              steps: [...prev.steps, `API hotel search failed: ${apiError.message}`]
            }));

            // Fallback to mock data if API fails
            hotelsResponse = {
              status: true,
              message: "Success (Mock)",
              timestamp: Date.now(),
              data: [
                {
                  hotel_id: `${destination.toLowerCase().replace(/\s+/g, '-')}-hotel-1`,
                  hotel_name: `Grand Hotel ${destination}`,
                  address: `Main Street, ${destination}`,
                  review_score: 8.5,
                  max_photo_url: 'data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%22288%22%20height%3D%22225%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20288%20225%22%20preserveAspectRatio%3D%22none%22%3E%3Cdefs%3E%3Cstyle%20type%3D%22text%2Fcss%22%3E%23holder_18e5fca5cc8%20text%20%7B%20fill%3A%23eceeef%3Bfont-weight%3Abold%3Bfont-family%3AArial%2C%20Helvetica%2C%20Open%20Sans%2C%20sans-serif%2C%20monospace%3Bfont-size%3A14pt%20%7D%20%3C%2Fstyle%3E%3C%2Fdefs%3E%3Cg%20id%3D%22holder_18e5fca5cc8%22%3E%3Crect%20width%3D%22288%22%20height%3D%22225%22%20fill%3D%22%2355595c%22%3E%3C%2Frect%3E%3Cg%3E%3Ctext%20x%3D%2296.82500076293945%22%20y%3D%22118.74000034332275%22%3EHotel%201%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E',
                  min_total_price: 150,
                  facilities: ['Free Wi-Fi', 'Swimming Pool', 'Restaurant', 'Spa'],
                  distance_to_cc: '0.5 km',
                  class: 4,
                  hotel_description: `A luxurious hotel in the heart of ${destination} with excellent amenities and service.`,
                  photos: [
                    { url_max: 'data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%22288%22%20height%3D%22225%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20288%20225%22%20preserveAspectRatio%3D%22none%22%3E%3Cdefs%3E%3Cstyle%20type%3D%22text%2Fcss%22%3E%23holder_18e5fca5cc8%20text%20%7B%20fill%3A%23eceeef%3Bfont-weight%3Abold%3Bfont-family%3AArial%2C%20Helvetica%2C%20Open%20Sans%2C%20sans-serif%2C%20monospace%3Bfont-size%3A14pt%20%7D%20%3C%2Fstyle%3E%3C%2Fdefs%3E%3Cg%20id%3D%22holder_18e5fca5cc8%22%3E%3Crect%20width%3D%22288%22%20height%3D%22225%22%20fill%3D%22%2355595c%22%3E%3C%2Frect%3E%3Cg%3E%3Ctext%20x%3D%2296.82500076293945%22%20y%3D%22118.74000034332275%22%3EHotel%201%20Photo%201%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E', url_1440: 'data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%22288%22%20height%3D%22225%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20288%20225%22%20preserveAspectRatio%3D%22none%22%3E%3Cdefs%3E%3Cstyle%20type%3D%22text%2Fcss%22%3E%23holder_18e5fca5cc8%20text%20%7B%20fill%3A%23eceeef%3Bfont-weight%3Abold%3Bfont-family%3AArial%2C%20Helvetica%2C%20Open%20Sans%2C%20sans-serif%2C%20monospace%3Bfont-size%3A14pt%20%7D%20%3C%2Fstyle%3E%3C%2Fdefs%3E%3Cg%20id%3D%22holder_18e5fca5cc8%22%3E%3Crect%20width%3D%22288%22%20height%3D%22225%22%20fill%3D%22%2355595c%22%3E%3C%2Frect%3E%3Cg%3E%3Ctext%20x%3D%2296.82500076293945%22%20y%3D%22118.74000034332275%22%3EHotel%201%20Photo%201%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E' },
                    { url_max: 'data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%22288%22%20height%3D%22225%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20288%20225%22%20preserveAspectRatio%3D%22none%22%3E%3Cdefs%3E%3Cstyle%20type%3D%22text%2Fcss%22%3E%23holder_18e5fca5cc8%20text%20%7B%20fill%3A%23eceeef%3Bfont-weight%3Abold%3Bfont-family%3AArial%2C%20Helvetica%2C%20Open%20Sans%2C%20sans-serif%2C%20monospace%3Bfont-size%3A14pt%20%7D%20%3C%2Fstyle%3E%3C%2Fdefs%3E%3Cg%20id%3D%22holder_18e5fca5cc8%22%3E%3Crect%20width%3D%22288%22%20height%3D%22225%22%20fill%3D%22%2355595c%22%3E%3C%2Frect%3E%3Cg%3E%3Ctext%20x%3D%2296.82500076293945%22%20y%3D%22118.74000034332275%22%3EHotel%201%20Photo%202%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E', url_1440: 'data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%22288%22%20height%3D%22225%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20288%20225%22%20preserveAspectRatio%3D%22none%22%3E%3Cdefs%3E%3Cstyle%20type%3D%22text%2Fcss%22%3E%23holder_18e5fca5cc8%20text%20%7B%20fill%3A%23eceeef%3Bfont-weight%3Abold%3Bfont-family%3AArial%2C%20Helvetica%2C%20Open%20Sans%2C%20sans-serif%2C%20monospace%3Bfont-size%3A14pt%20%7D%20%3C%2Fstyle%3E%3C%2Fdefs%3E%3Cg%20id%3D%22holder_18e5fca5cc8%22%3E%3Crect%20width%3D%22288%22%20height%3D%22225%22%20fill%3D%22%2355595c%22%3E%3C%2Frect%3E%3Cg%3E%3Ctext%20x%3D%2296.82500076293945%22%20y%3D%22118.74000034332275%22%3EHotel%201%20Photo%202%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E' }
                  ]
                },
                {
                  hotel_id: `${destination.toLowerCase().replace(/\s+/g, '-')}-hotel-2`,
                  hotel_name: `Luxury Resort ${destination}`,
                  address: `Beach Road, ${destination}`,
                  review_score: 9.2,
                  max_photo_url: 'data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%22288%22%20height%3D%22225%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20288%20225%22%20preserveAspectRatio%3D%22none%22%3E%3Cdefs%3E%3Cstyle%20type%3D%22text%2Fcss%22%3E%23holder_18e5fca5cc8%20text%20%7B%20fill%3A%23eceeef%3Bfont-weight%3Abold%3Bfont-family%3AArial%2C%20Helvetica%2C%20Open%20Sans%2C%20sans-serif%2C%20monospace%3Bfont-size%3A14pt%20%7D%20%3C%2Fstyle%3E%3C%2Fdefs%3E%3Cg%20id%3D%22holder_18e5fca5cc8%22%3E%3Crect%20width%3D%22288%22%20height%3D%22225%22%20fill%3D%22%2355595c%22%3E%3C%2Frect%3E%3Cg%3E%3Ctext%20x%3D%2296.82500076293945%22%20y%3D%22118.74000034332275%22%3EHotel%202%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E',
                  min_total_price: 250,
                  facilities: ['Free Wi-Fi', 'Swimming Pool', 'Restaurant', 'Spa', 'Gym', 'Beach Access'],
                  distance_to_cc: '2.1 km',
                  class: 5,
                  hotel_description: `An exclusive resort in ${destination} offering premium amenities and breathtaking views.`,
                  photos: [
                    { url_max: 'data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%22288%22%20height%3D%22225%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20288%20225%22%20preserveAspectRatio%3D%22none%22%3E%3Cdefs%3E%3Cstyle%20type%3D%22text%2Fcss%22%3E%23holder_18e5fca5cc8%20text%20%7B%20fill%3A%23eceeef%3Bfont-weight%3Abold%3Bfont-family%3AArial%2C%20Helvetica%2C%20Open%20Sans%2C%20sans-serif%2C%20monospace%3Bfont-size%3A14pt%20%7D%20%3C%2Fstyle%3E%3C%2Fdefs%3E%3Cg%20id%3D%22holder_18e5fca5cc8%22%3E%3Crect%20width%3D%22288%22%20height%3D%22225%22%20fill%3D%22%2355595c%22%3E%3C%2Frect%3E%3Cg%3E%3Ctext%20x%3D%2296.82500076293945%22%20y%3D%22118.74000034332275%22%3EHotel%202%20Photo%201%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E', url_1440: 'data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%22288%22%20height%3D%22225%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20288%20225%22%20preserveAspectRatio%3D%22none%22%3E%3Cdefs%3E%3Cstyle%20type%3D%22text%2Fcss%22%3E%23holder_18e5fca5cc8%20text%20%7B%20fill%3A%23eceeef%3Bfont-weight%3Abold%3Bfont-family%3AArial%2C%20Helvetica%2C%20Open%20Sans%2C%20sans-serif%2C%20monospace%3Bfont-size%3A14pt%20%7D%20%3C%2Fstyle%3E%3C%2Fdefs%3E%3Cg%20id%3D%22holder_18e5fca5cc8%22%3E%3Crect%20width%3D%22288%22%20height%3D%22225%22%20fill%3D%22%2355595c%22%3E%3C%2Frect%3E%3Cg%3E%3Ctext%20x%3D%2296.82500076293945%22%20y%3D%22118.74000034332275%22%3EHotel%202%20Photo%201%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E' },
                    { url_max: 'data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%22288%22%20height%3D%22225%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20288%20225%22%20preserveAspectRatio%3D%22none%22%3E%3Cdefs%3E%3Cstyle%20type%3D%22text%2Fcss%22%3E%23holder_18e5fca5cc8%20text%20%7B%20fill%3A%23eceeef%3Bfont-weight%3Abold%3Bfont-family%3AArial%2C%20Helvetica%2C%20Open%20Sans%2C%20sans-serif%2C%20monospace%3Bfont-size%3A14pt%20%7D%20%3C%2Fstyle%3E%3C%2Fdefs%3E%3Cg%20id%3D%22holder_18e5fca5cc8%22%3E%3Crect%20width%3D%22288%22%20height%3D%22225%22%20fill%3D%22%2355595c%22%3E%3C%2Frect%3E%3Cg%3E%3Ctext%20x%3D%2296.82500076293945%22%20y%3D%22118.74000034332275%22%3EHotel%202%20Photo%202%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E', url_1440: 'data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%22288%22%20height%3D%22225%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20288%20225%22%20preserveAspectRatio%3D%22none%22%3E%3Cdefs%3E%3Cstyle%20type%3D%22text%2Fcss%22%3E%23holder_18e5fca5cc8%20text%20%7B%20fill%3A%23eceeef%3Bfont-weight%3Abold%3Bfont-family%3AArial%2C%20Helvetica%2C%20Open%20Sans%2C%20sans-serif%2C%20monospace%3Bfont-size%3A14pt%20%7D%20%3C%2Fstyle%3E%3C%2Fdefs%3E%3Cg%20id%3D%22holder_18e5fca5cc8%22%3E%3Crect%20width%3D%22288%22%20height%3D%22225%22%20fill%3D%22%2355595c%22%3E%3C%2Frect%3E%3Cg%3E%3Ctext%20x%3D%2296.82500076293945%22%20y%3D%22118.74000034332275%22%3EHotel%202%20Photo%202%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E' }
                  ]
                },
                {
                  hotel_id: `${destination.toLowerCase().replace(/\s+/g, '-')}-hotel-3`,
                  hotel_name: `City Center Hotel ${destination}`,
                  address: `Downtown, ${destination}`,
                  review_score: 7.8,
                  max_photo_url: 'data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%22288%22%20height%3D%22225%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20288%20225%22%20preserveAspectRatio%3D%22none%22%3E%3Cdefs%3E%3Cstyle%20type%3D%22text%2Fcss%22%3E%23holder_18e5fca5cc8%20text%20%7B%20fill%3A%23eceeef%3Bfont-weight%3Abold%3Bfont-family%3AArial%2C%20Helvetica%2C%20Open%20Sans%2C%20sans-serif%2C%20monospace%3Bfont-size%3A14pt%20%7D%20%3C%2Fstyle%3E%3C%2Fdefs%3E%3Cg%20id%3D%22holder_18e5fca5cc8%22%3E%3Crect%20width%3D%22288%22%20height%3D%22225%22%20fill%3D%22%2355595c%22%3E%3C%2Frect%3E%3Cg%3E%3Ctext%20x%3D%2296.82500076293945%22%20y%3D%22118.74000034332275%22%3EHotel%203%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E',
                  min_total_price: 120,
                  facilities: ['Free Wi-Fi', 'Restaurant', 'Business Center'],
                  distance_to_cc: '0.1 km',
                  class: 3,
                  hotel_description: `A convenient hotel located in downtown ${destination}, perfect for business travelers.`,
                  photos: [
                    { url_max: 'data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%22288%22%20height%3D%22225%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20288%20225%22%20preserveAspectRatio%3D%22none%22%3E%3Cdefs%3E%3Cstyle%20type%3D%22text%2Fcss%22%3E%23holder_18e5fca5cc8%20text%20%7B%20fill%3A%23eceeef%3Bfont-weight%3Abold%3Bfont-family%3AArial%2C%20Helvetica%2C%20Open%20Sans%2C%20sans-serif%2C%20monospace%3Bfont-size%3A14pt%20%7D%20%3C%2Fstyle%3E%3C%2Fdefs%3E%3Cg%20id%3D%22holder_18e5fca5cc8%22%3E%3Crect%20width%3D%22288%22%20height%3D%22225%22%20fill%3D%22%2355595c%22%3E%3C%2Frect%3E%3Cg%3E%3Ctext%20x%3D%2296.82500076293945%22%20y%3D%22118.74000034332275%22%3EHotel%203%20Photo%201%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E', url_1440: 'data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%22288%22%20height%3D%22225%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20288%20225%22%20preserveAspectRatio%3D%22none%22%3E%3Cdefs%3E%3Cstyle%20type%3D%22text%2Fcss%22%3E%23holder_18e5fca5cc8%20text%20%7B%20fill%3A%23eceeef%3Bfont-weight%3Abold%3Bfont-family%3AArial%2C%20Helvetica%2C%20Open%20Sans%2C%20sans-serif%2C%20monospace%3Bfont-size%3A14pt%20%7D%20%3C%2Fstyle%3E%3C%2Fdefs%3E%3Cg%20id%3D%22holder_18e5fca5cc8%22%3E%3Crect%20width%3D%22288%22%20height%3D%22225%22%20fill%3D%22%2355595c%22%3E%3C%2Frect%3E%3Cg%3E%3Ctext%20x%3D%2296.82500076293945%22%20y%3D%22118.74000034332275%22%3EHotel%203%20Photo%201%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E' },
                    { url_max: 'data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%22288%22%20height%3D%22225%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20288%20225%22%20preserveAspectRatio%3D%22none%22%3E%3Cdefs%3E%3Cstyle%20type%3D%22text%2Fcss%22%3E%23holder_18e5fca5cc8%20text%20%7B%20fill%3A%23eceeef%3Bfont-weight%3Abold%3Bfont-family%3AArial%2C%20Helvetica%2C%20Open%20Sans%2C%20sans-serif%2C%20monospace%3Bfont-size%3A14pt%20%7D%20%3C%2Fstyle%3E%3C%2Fdefs%3E%3Cg%20id%3D%22holder_18e5fca5cc8%22%3E%3Crect%20width%3D%22288%22%20height%3D%22225%22%20fill%3D%22%2355595c%22%3E%3C%2Frect%3E%3Cg%3E%3Ctext%20x%3D%2296.82500076293945%22%20y%3D%22118.74000034332275%22%3EHotel%203%20Photo%202%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E', url_1440: 'data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%22288%22%20height%3D%22225%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20288%20225%22%20preserveAspectRatio%3D%22none%22%3E%3Cdefs%3E%3Cstyle%20type%3D%22text%2Fcss%22%3E%23holder_18e5fca5cc8%20text%20%7B%20fill%3A%23eceeef%3Bfont-weight%3Abold%3Bfont-family%3AArial%2C%20Helvetica%2C%20Open%20Sans%2C%20sans-serif%2C%20monospace%3Bfont-size%3A14pt%20%7D%20%3C%2Fstyle%3E%3C%2Fdefs%3E%3Cg%20id%3D%22holder_18e5fca5cc8%22%3E%3Crect%20width%3D%22288%22%20height%3D%22225%22%20fill%3D%22%2355595c%22%3E%3C%2Frect%3E%3Cg%3E%3Ctext%20x%3D%2296.82500076293945%22%20y%3D%22118.74000034332275%22%3EHotel%203%20Photo%202%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E' }
                  ]
                }
              ]
            };

            // Update debug info
            setDebugInfo(prev => ({
              ...prev,
              steps: [...prev.steps, 'Fallback to mock hotel data'],
              responses: {
                ...prev.responses,
                hotels: hotelsResponse
              }
            }));
          }
        } catch (hotelErr: any) {
          console.error('Hotel search completely failed:', hotelErr);

          // Update debug info
          setDebugInfo(prev => ({
            ...prev,
            steps: [...prev.steps, `Hotel search failed: ${hotelErr.message}`]
          }));

          throw new Error(`Failed to search hotels: ${hotelErr.message}`);
        }

        // Log the full response for debugging
        console.log('Full hotel response:', JSON.stringify(hotelsResponse));

        // The API response structure might vary, so let's handle different formats
        let hotelData = [];

        console.log('Processing hotel response:', JSON.stringify(hotelsResponse));

        // Add detailed logging of the response structure
        console.log('Response type:', typeof hotelsResponse);
        if (hotelsResponse) {
          console.log('Response keys:', Object.keys(hotelsResponse));
          if (hotelsResponse.data) {
            console.log('Data type:', typeof hotelsResponse.data);
            console.log('Is data array:', Array.isArray(hotelsResponse.data));
            if (Array.isArray(hotelsResponse.data) && hotelsResponse.data.length > 0) {
              console.log('First hotel in data:', hotelsResponse.data[0]);
              console.log('First hotel keys:', Object.keys(hotelsResponse.data[0]));
            }
          } else if (hotelsResponse.result) {
            console.log('Result type:', typeof hotelsResponse.result);
            console.log('Is result array:', Array.isArray(hotelsResponse.result));
            if (Array.isArray(hotelsResponse.result) && hotelsResponse.result.length > 0) {
              console.log('First hotel in result:', hotelsResponse.result[0]);
              console.log('First hotel keys:', Object.keys(hotelsResponse.result[0]));
            }
          }
        }

        // Check if the response has a data property
        if (hotelsResponse?.data) {
          // If data is an array, use it directly
          if (Array.isArray(hotelsResponse.data)) {
            hotelData = hotelsResponse.data;
          }
          // If data is an object, wrap it in an array
          else if (typeof hotelsResponse.data === 'object') {
            hotelData = [hotelsResponse.data];
          }
        }
        // Check if the response has a result property (searchHotels endpoint)
        else if (hotelsResponse?.result) {
          if (Array.isArray(hotelsResponse.result)) {
            hotelData = hotelsResponse.result;
          } else if (typeof hotelsResponse.result === 'object') {
            hotelData = [hotelsResponse.result];
          }
        }
        // Check if the response has a results property
        else if (hotelsResponse?.results) {
          if (Array.isArray(hotelsResponse.results)) {
            hotelData = hotelsResponse.results;
          } else if (typeof hotelsResponse.results === 'object') {
            hotelData = [hotelsResponse.results];
          }
        }
        // If no data property but the response itself is an array
        else if (Array.isArray(hotelsResponse)) {
          hotelData = hotelsResponse;
        }
        // If the response itself is an object (not null)
        else if (hotelsResponse && typeof hotelsResponse === 'object') {
          // Check if it looks like a hotel object (has hotel_name)
          if (hotelsResponse.hotel_name) {
            hotelData = [hotelsResponse];
          }
        }

        // Log the extracted hotel data
        console.log('Extracted hotel data length:', hotelData.length);
        if (hotelData.length > 0) {
          console.log('First extracted hotel:', hotelData[0]);
          console.log('First hotel keys:', Object.keys(hotelData[0]));

          // Check if hotels have photos
          const firstHotel = hotelData[0];
          if (firstHotel.photos) {
            console.log('First hotel has photos array with length:', firstHotel.photos.length);
            if (firstHotel.photos.length > 0) {
              console.log('First photo:', firstHotel.photos[0]);
            }
          } else if (firstHotel.max_photo_url) {
            console.log('First hotel has max_photo_url:', firstHotel.max_photo_url);
          }
        }

        // Log the extracted hotel data
        console.log('Extracted hotel data:', hotelData);
        console.log('Hotel data length:', hotelData.length);
        if (hotelData.length > 0) {
          console.log('First hotel:', hotelData[0]);
          console.log('First hotel keys:', Object.keys(hotelData[0]));
        }

        // If we still don't have any hotel data, try to use mock data
        if (hotelData.length === 0) {
          console.error('No hotel data found in response:', hotelsResponse);

          // Use mock data for demonstration purposes
          hotelData = [
            {
              hotel_id: 'mock-1',
              hotel_name: 'Grand Hotel ' + destination,
              address: 'Main Street, ' + destination,
              review_score: 8.5,
              max_photo_url: 'https://cf.bstatic.com/xdata/images/hotel/max1024x768/405276856.jpg?k=4a4a8e3ba5a0d0d27bd5e6c9622dbc8e9a8001c66dc9f9f72d5fd3a6a8e2a71a&o=&hp=1',
              min_total_price: 150,
              facilities: ['Free Wi-Fi', 'Swimming Pool', 'Restaurant', 'Spa'],
              distance_to_cc: '0.5 km',
              class: 4,
              hotel_description: 'A luxurious hotel in the heart of ' + destination + ' with excellent amenities and service.',
              photos: [
                { url_max: 'https://cf.bstatic.com/xdata/images/hotel/max1024x768/405276856.jpg?k=4a4a8e3ba5a0d0d27bd5e6c9622dbc8e9a8001c66dc9f9f72d5fd3a6a8e2a71a&o=&hp=1', url_1440: 'https://cf.bstatic.com/xdata/images/hotel/max1024x768/405276856.jpg?k=4a4a8e3ba5a0d0d27bd5e6c9622dbc8e9a8001c66dc9f9f72d5fd3a6a8e2a71a&o=&hp=1' },
                { url_max: 'https://cf.bstatic.com/xdata/images/hotel/max1024x768/223496641.jpg?k=070c9a65c52e7944d8f0c1d3c75e4e35c1310adcec65cb1c22b9d2a4b52af4cf&o=&hp=1', url_1440: 'https://cf.bstatic.com/xdata/images/hotel/max1024x768/223496641.jpg?k=070c9a65c52e7944d8f0c1d3c75e4e35c1310adcec65cb1c22b9d2a4b52af4cf&o=&hp=1' }
              ]
            },
            {
              hotel_id: 'mock-2',
              hotel_name: 'Luxury Resort ' + destination,
              address: 'Beach Road, ' + destination,
              review_score: 9.2,
              max_photo_url: 'https://cf.bstatic.com/xdata/images/hotel/max1024x768/223496641.jpg?k=070c9a65c52e7944d8f0c1d3c75e4e35c1310adcec65cb1c22b9d2a4b52af4cf&o=&hp=1',
              min_total_price: 250,
              facilities: ['Free Wi-Fi', 'Swimming Pool', 'Restaurant', 'Spa', 'Gym', 'Beach Access'],
              distance_to_cc: '2.1 km',
              class: 5,
              hotel_description: 'An exclusive resort in ' + destination + ' offering premium amenities and breathtaking views.',
              photos: [
                { url_max: 'https://cf.bstatic.com/xdata/images/hotel/max1024x768/223496641.jpg?k=070c9a65c52e7944d8f0c1d3c75e4e35c1310adcec65cb1c22b9d2a4b52af4cf&o=&hp=1', url_1440: 'https://cf.bstatic.com/xdata/images/hotel/max1024x768/223496641.jpg?k=070c9a65c52e7944d8f0c1d3c75e4e35c1310adcec65cb1c22b9d2a4b52af4cf&o=&hp=1' },
                { url_max: 'https://cf.bstatic.com/xdata/images/hotel/max1024x768/430342048.jpg?k=a9f54a35e36e1a4d51a7a0b64e1a4a6258feea7a5d5f5b9b18c9e3c8a0a1c55c&o=&hp=1', url_1440: 'https://cf.bstatic.com/xdata/images/hotel/max1024x768/430342048.jpg?k=a9f54a35e36e1a4d51a7a0b64e1a4a6258feea7a5d5f5b9b18c9e3c8a0a1c55c&o=&hp=1' }
              ]
            },
            {
              hotel_id: 'mock-3',
              hotel_name: 'City Center Hotel ' + destination,
              address: 'Downtown, ' + destination,
              review_score: 7.8,
              max_photo_url: 'https://cf.bstatic.com/xdata/images/hotel/max1024x768/187855079.jpg?k=8c3c9e3850da452c9a20065c8d8994b4d87a4a31dc93b137d3fa2ce24394b1a7&o=&hp=1',
              min_total_price: 120,
              facilities: ['Free Wi-Fi', 'Restaurant', 'Business Center'],
              distance_to_cc: '0.1 km',
              class: 3,
              hotel_description: 'A convenient hotel located in downtown ' + destination + ', perfect for business travelers.',
              photos: [
                { url_max: 'https://cf.bstatic.com/xdata/images/hotel/max1024x768/187855079.jpg?k=8c3c9e3850da452c9a20065c8d8994b4d87a4a31dc93b137d3fa2ce24394b1a7&o=&hp=1', url_1440: 'https://cf.bstatic.com/xdata/images/hotel/max1024x768/187855079.jpg?k=8c3c9e3850da452c9a20065c8d8994b4d87a4a31dc93b137d3fa2ce24394b1a7&o=&hp=1' },
                { url_max: 'https://cf.bstatic.com/xdata/images/hotel/max1024x768/430342036.jpg?k=0a5bc4c1a7f7d7c3055b9a4e53c2683f4e0e47f8b1b3e8e9e3b9c863451ede20&o=&hp=1', url_1440: 'https://cf.bstatic.com/xdata/images/hotel/max1024x768/430342036.jpg?k=0a5bc4c1a7f7d7c3055b9a4e53c2683f4e0e47f8b1b3e8e9e3b9c863451ede20&o=&hp=1' }
              ]
            }
          ];

          // Update debug info
          setDebugInfo(prev => ({
            ...prev,
            steps: [...prev.steps, 'Using mock data due to empty API response']
          }));
        }

        console.log('Processed hotel data:', hotelData);

        // Set the hotels from the processed data
        setHotels(hotelData);
      } catch (err: any) {
        console.error('Error fetching hotels:', err);

        // Update debug info with error
        setDebugInfo(prev => ({
          ...prev,
          steps: [...prev.steps, `Error: ${err.message}`]
        }));

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
      <div className="min-h-screen p-4">
        <div className="max-w-6xl mx-auto">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            <p className="font-bold">Error:</p>
            <p>{error}</p>
          </div>

          <button
            onClick={() => router.push('/')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 mb-6"
          >
            Return Home
          </button>

          {/* Debug Information */}
          <div className="bg-white p-4 rounded-lg shadow">
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
                  <pre className="bg-gray-100 p-2 rounded text-xs overflow-auto max-h-96">
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

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-50 to-purple-50 p-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Hotels in {destination}</h1>

        <div className="space-y-6">
          {hotels.map((hotel, index) => {
            // Extract hotel properties with improved fallbacks and logging
            console.log(`Processing hotel ${index}:`, hotel);
            console.log(`Hotel ${index} keys:`, Object.keys(hotel));

            // Log photo-related properties specifically
            console.log(`Hotel ${index} photo properties:`, {
              max_photo_url: hotel.max_photo_url,
              photo: hotel.photo,
              main_photo_url: hotel.main_photo_url,
              photos: hotel.photos,
              image: hotel.image
            });

            const hotelId = hotel.hotel_id || hotel.id || `hotel-${index}`;
            const hotelName = hotel.hotel_name || hotel.name || `Hotel ${index + 1} in ${destination}`;
            const hotelAddress = hotel.address || hotel.location || `${destination}`;
            const hotelRating = hotel.review_score || hotel.rating || 4.0;
            const hotelPrice = hotel.min_total_price || hotel.price || 'N/A';
            const hotelClass = hotel.class || hotel.stars || 4;

            // Enhanced photo URL extraction with better fallbacks
            let hotelImage = '';

            // First try to get image from photos array
            if (hotel.photos && Array.isArray(hotel.photos) && hotel.photos.length > 0) {
              const firstPhoto = hotel.photos[0];
              if (typeof firstPhoto === 'object') {
                if (firstPhoto.url_max) {
                  hotelImage = firstPhoto.url_max;
                  console.log(`Hotel ${index} using photos[0].url_max`);
                } else if (firstPhoto.url_1440) {
                  hotelImage = firstPhoto.url_1440;
                  console.log(`Hotel ${index} using photos[0].url_1440`);
                } else if (firstPhoto.url) {
                  hotelImage = firstPhoto.url;
                  console.log(`Hotel ${index} using photos[0].url`);
                }
              } else if (typeof firstPhoto === 'string') {
                hotelImage = firstPhoto;
                console.log(`Hotel ${index} using photos[0] as string`);
              }
            }

            // If no image from photos array, try other properties
            if (!hotelImage) {
              if (hotel.max_photo_url) {
                hotelImage = hotel.max_photo_url;
                console.log(`Hotel ${index} using max_photo_url`);
              } else if (hotel.photo) {
                hotelImage = hotel.photo;
                console.log(`Hotel ${index} using photo`);
              } else if (hotel.main_photo_url) {
                hotelImage = hotel.main_photo_url;
                console.log(`Hotel ${index} using main_photo_url`);
              } else if (hotel.image) {
                hotelImage = hotel.image;
                console.log(`Hotel ${index} using image`);
              }
            }

            // If still no image, use a data URL placeholder
            if (!hotelImage) {
              hotelImage = 'data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%22288%22%20height%3D%22225%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20288%20225%22%20preserveAspectRatio%3D%22none%22%3E%3Cdefs%3E%3Cstyle%20type%3D%22text%2Fcss%22%3E%23holder_18e5fca5cc8%20text%20%7B%20fill%3A%23eceeef%3Bfont-weight%3Abold%3Bfont-family%3AArial%2C%20Helvetica%2C%20Open%20Sans%2C%20sans-serif%2C%20monospace%3Bfont-size%3A14pt%20%7D%20%3C%2Fstyle%3E%3C%2Fdefs%3E%3Cg%20id%3D%22holder_18e5fca5cc8%22%3E%3Crect%20width%3D%22288%22%20height%3D%22225%22%20fill%3D%22%2355595c%22%3E%3C%2Frect%3E%3Cg%3E%3Ctext%20x%3D%2296.82500076293945%22%20y%3D%22118.74000034332275%22%3EHotel%20Image%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E';
              console.log(`Hotel ${index} using data URL placeholder image`);
            }

            const hotelFacilities = hotel.facilities || hotel.amenities || [];

            // Debug this specific hotel
            console.log(`Hotel ${index} name:`, hotelName);
            console.log(`Hotel ${index} image:`, hotelImage);

            return (
              <div key={index} className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="md:flex">
                  <div className="md:w-1/3 h-64 relative">
                    <img
                      src={hotelImage}
                      alt={hotelName}
                      className="w-full h-full object-cover"
                      onError={async (e) => {
                        // If image fails to load, use a fallback
                        console.error(`Image failed to load for hotel ${index}:`, hotelImage);
                        const target = e.target as HTMLImageElement;
                        target.onerror = null; // Prevent infinite loop

                        // Try to fetch hotel photos from our API endpoint using fetch
                        if (hotel.hotel_id) {
                          try {
                            // Use the Booking.com API directly with fetch
                            const url = `https://booking-com15.p.rapidapi.com/api/v1/hotels/getHotelPhotos?hotel_id=${hotel.hotel_id}`;
                            const options = {
                              method: 'GET',
                              headers: {
                                'X-RapidAPI-Key': '43f4d26f35mshce7092ec3b58911p1dd88bjsneeb2ab5758d7',
                                'X-RapidAPI-Host': 'booking-com15.p.rapidapi.com'
                              }
                            };

                            console.log(`Hotel photos API URL for hotel ${index}:`, url);

                            const response = await fetch(url, options);

                            if (!response.ok) {
                              const errorText = await response.text();
                              console.error(`Hotel photos API error response for hotel ${index}:`, errorText);
                              throw new Error(`Hotel photos API responded with status: ${response.status}, message: ${errorText}`);
                            }

                            const data = await response.json();
                            console.log(`Hotel photos API response for hotel ${index}:`, data);

                            // Try to extract photos from the response, handling different possible formats
                            let photos = [];

                            // Check if data has the expected structure
                            if (data.status && data.data && Array.isArray(data.data)) {
                              photos = data.data;
                            }
                            // Check if data itself is an array
                            else if (Array.isArray(data)) {
                              photos = data;
                            }
                            // Check if data has a results property that's an array
                            else if (data.results && Array.isArray(data.results)) {
                              photos = data.results;
                            }
                            // Check if data has a photos property that's an array
                            else if (data.photos && Array.isArray(data.photos)) {
                              photos = data.photos;
                            }

                            console.log(`Extracted ${photos.length} photos for hotel ${index}`);

                            // Try to find a usable photo URL
                            if (photos.length > 0) {
                              for (const photo of photos) {
                                // Try different possible property names for the URL
                                const photoUrl = photo.url_max || photo.url_1440 || photo.url ||
                                  photo.max_url || photo.large_url || photo.original ||
                                  (typeof photo === 'string' ? photo : '');

                                if (photoUrl) {
                                  target.src = photoUrl;
                                  console.log(`Loaded image from API for hotel ${index}: ${photoUrl}`);
                                  return;
                                }
                              }
                            }
                            // If we get here, no valid photo was found in the API response
                            throw new Error('No valid photos found in API response');
                          } catch (err) {
                            console.error(`Error fetching photos for hotel ${index}:`, err);
                            // Fall through to use local fallback
                          }
                        }

                        // If we get here, either there's no hotel_id, the API call failed,
                        // or no valid photos were found - use a data URL for the fallback image
                        const hotelName = hotel.hotel_name || `Hotel ${index}`;
                        target.src = `data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%22288%22%20height%3D%22225%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20288%20225%22%20preserveAspectRatio%3D%22none%22%3E%3Cdefs%3E%3Cstyle%20type%3D%22text%2Fcss%22%3E%23holder_18e5fca5cc8%20text%20%7B%20fill%3A%23eceeef%3Bfont-weight%3Abold%3Bfont-family%3AArial%2C%20Helvetica%2C%20Open%20Sans%2C%20sans-serif%2C%20monospace%3Bfont-size%3A14pt%20%7D%20%3C%2Fstyle%3E%3C%2Fdefs%3E%3Cg%20id%3D%22holder_18e5fca5cc8%22%3E%3Crect%20width%3D%22288%22%20height%3D%22225%22%20fill%3D%22%2355595c%22%3E%3C%2Frect%3E%3Cg%3E%3Ctext%20x%3D%2296.82500076293945%22%20y%3D%22118.74000034332275%22%3E${encodeURIComponent(hotelName)}%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E`;
                        console.log(`Using SVG placeholder for hotel ${index}: ${hotelName}`);
                      }}
                    />
                  </div>

                  <div className="md:w-2/3 p-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <h2 className="text-xl font-bold mb-2">{hotelName}</h2>

                        <div className="flex items-center mb-2">
                          {[...Array(hotelClass)].map((_, i) => (
                            <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                          ))}
                        </div>

                        <div className="flex items-center text-gray-600 mb-4">
                          <MapPin className="h-4 w-4 mr-1" />
                          <span className="text-sm">{hotelAddress}</span>
                        </div>

                        {hotel.distance_to_cc && (
                          <p className="text-sm text-gray-600 mb-2">
                            {hotel.distance_to_cc} from city center
                          </p>
                        )}
                      </div>

                      <div className="text-right">
                        {hotelRating && (
                          <div className="bg-blue-600 text-white px-3 py-2 rounded-lg font-bold mb-2">
                            {typeof hotelRating === 'number' ? hotelRating.toFixed(1) : hotelRating}
                          </div>
                        )}

                        <div className="text-lg font-bold text-blue-600">
                          ${hotelPrice}
                          <span className="text-sm text-gray-500">/night</span>
                        </div>

                        {hotel.original_price && (
                          <div className="text-sm text-gray-500 line-through">
                            ${hotel.original_price}
                          </div>
                        )}
                      </div>
                    </div>

                    {hotelFacilities.length > 0 && (
                      <div className="mt-4">
                        <h3 className="text-sm font-semibold mb-2">Amenities</h3>
                        <div className="flex flex-wrap gap-3">
                          {hotelFacilities.slice(0, 4).map((facility, i) => (
                            <div key={i} className="flex items-center text-sm text-gray-600">
                              {amenityIcons[facility] || <Star className="h-3 w-3 mr-1" />}
                              <span>{facility}</span>
                            </div>
                          ))}
                          {hotelFacilities.length > 4 && (
                            <span className="text-sm text-gray-500">+{hotelFacilities.length - 4} more</span>
                          )}
                        </div>
                      </div>
                    )}

                    {hotel.review_details && (
                      <div className="mt-4">
                        <h3 className="text-sm font-semibold mb-1">Reviews</h3>
                        <div className="flex items-center">
                          <div className="text-sm">
                            <span className="font-medium">{hotel.review_details.score.toFixed(1)}</span>
                            <span className="text-gray-500"> ({hotel.review_details.review_count} reviews)</span>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="mt-6 flex justify-end">
                      <Link
                        href={`/hotel-fixed?destination=${destination}&hotel_id=${hotelId}`}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
                      >
                        <span>View Details</span>
                        <ChevronRight className="h-4 w-4 ml-1" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {hotels.length === 0 && !loading && !error && (
          <div className="text-center py-12">
            <p className="text-gray-600">No hotels found for this destination.</p>
          </div>
        )}
      </div>

      {/* Debug Information */}
      <div className="mt-8 bg-white p-4 rounded-lg shadow">
        <h2 className="text-xl font-bold mb-2">Debug Information</h2>
        <div className="space-y-2">
          <p><strong>Destination:</strong> {destination || 'None'}</p>
          <p><strong>Hotels count:</strong> {hotels.length}</p>
          <p><strong>First hotel:</strong> {hotels.length > 0 ? (hotels[0].hotel_name || 'No name') : 'No hotels'}</p>
          <p><strong>Steps:</strong></p>
          <ul className="list-disc pl-5">
            {debugInfo.steps.map((step, index) => (
              <li key={index}>{step}</li>
            ))}
          </ul>

          {/* Hotel Data Preview */}
          <div>
            <p><strong>Hotel Data Preview:</strong></p>
            <div className="bg-gray-100 p-2 rounded text-xs overflow-auto max-h-40">
              {hotels.length > 0 ? (
                <div>
                  <p>First hotel keys: {Object.keys(hotels[0]).join(', ')}</p>
                  <p>Hotel name: {hotels[0].hotel_name || 'undefined'}</p>
                  <p>Hotel image: {hotels[0].max_photo_url || 'undefined'}</p>
                </div>
              ) : 'No hotels data'}
            </div>
          </div>

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
  );
}
