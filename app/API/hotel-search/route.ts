import { NextRequest, NextResponse } from 'next/server';

// Define interfaces for API responses
interface DestinationData {
  dest_id: string;
  city_name?: string;
  country?: string;
  [key: string]: any;
}

interface DestinationResponse {
  status: boolean;
  message: string;
  timestamp: number;
  data: DestinationData[];
  [key: string]: any;
}

interface HotelData {
  hotel_id?: string;
  hotel_name?: string;
  max_photo_url?: string;
  photos?: Array<{
    url_max?: string;
    url_1440?: string;
    url?: string;
  }>;
  [key: string]: any;
}

interface HotelResponse {
  status: boolean;
  message: string;
  timestamp: number;
  data: HotelData[];
  [key: string]: any;
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const destination = searchParams.get('destination');

  if (!destination) {
    return NextResponse.json({ error: 'Destination parameter is required' }, { status: 400 });
  }

  try {
    // Step 1: Get destination ID using fetch
    const destUrl = `https://booking-com15.p.rapidapi.com/api/v1/hotels/searchDestination?query=${encodeURIComponent(destination)}`;
    const options = {
      method: 'GET',
      headers: {
        'X-RapidAPI-Key': '43f4d26f35mshce7092ec3b58911p1dd88bjsneeb2ab5758d7',
        'X-RapidAPI-Host': 'booking-com15.p.rapidapi.com'
      }
    };

    const destResponse = await fetch(destUrl, options);

    if (!destResponse.ok) {
      throw new Error(`Destination API responded with status: ${destResponse.status}`);
    }

    const destinationResponse: DestinationResponse = await destResponse.json();
    console.log('Destination API response:', destinationResponse);

    if (!destinationResponse?.data || !Array.isArray(destinationResponse.data) || destinationResponse.data.length === 0) {
      return NextResponse.json({ error: `No destinations found for "${destination}"` }, { status: 404 });
    }

    const destId = destinationResponse.data[0].dest_id;

    // Step 2: Search for hotels using fetch
    const hotelUrl = `https://booking-com15.p.rapidapi.com/api/v1/hotels/search?destination_id=${destId}&checkin=2024-09-27&checkout=2024-09-28&adults=2&room_qty=1&currency_code=USD`;

    const hotelResponse = await fetch(hotelUrl, options);

    if (!hotelResponse.ok) {
      throw new Error(`Hotel search API responded with status: ${hotelResponse.status}`);
    }

    const hotelsResponse: HotelResponse = await hotelResponse.json();
    console.log('Hotels API response:', hotelsResponse);

    if (!hotelsResponse?.data || !Array.isArray(hotelsResponse.data) || hotelsResponse.data.length === 0) {
      return NextResponse.json({ error: 'No hotels found for this destination' }, { status: 404 });
    }

    // Process hotel data to ensure photos are properly formatted
    const processedHotels = hotelsResponse.data.map(hotel => {
      // Ensure photos array is properly formatted
      let processedPhotos: Array<{ url_max: string, url_1440: string }> = [];

      if (hotel.photos && Array.isArray(hotel.photos) && hotel.photos.length > 0) {
        processedPhotos = hotel.photos.map(photo => ({
          url_max: photo.url_max || photo.url || '',
          url_1440: photo.url_1440 || photo.url || ''
        }));
      } else if (hotel.max_photo_url) {
        // If no photos array but has max_photo_url, create a photos array
        processedPhotos = [{
          url_max: hotel.max_photo_url,
          url_1440: hotel.max_photo_url
        }];
      }

      return {
        ...hotel,
        photos: processedPhotos
      };
    });

    // Return the response with destination and processed hotels data
    return NextResponse.json({
      status: true,
      message: "Success",
      timestamp: Date.now(),
      destination: destinationResponse,
      hotels: {
        ...hotelsResponse,
        data: processedHotels
      }
    });
  } catch (error: any) {
    console.error('API error:', error);
    return NextResponse.json(
      {
        error: error.message || 'An error occurred while fetching hotel data',
        details: error.response?.data || {}
      },
      { status: 500 }
    );
  }
}
