import { NextRequest, NextResponse } from 'next/server';

// Define interfaces for API responses
interface HotelPhoto {
  id?: string;
  url?: string;
  url_max?: string;
  url_1440?: string;
  [key: string]: any;
}

interface HotelPhotosResponse {
  status: boolean;
  message: string;
  timestamp: number;
  data: HotelPhoto[];
  [key: string]: any;
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const hotelId = searchParams.get('hotel_id');

  if (!hotelId) {
    return NextResponse.json({ error: 'hotel_id parameter is required' }, { status: 400 });
  }

  try {
    // Get hotel photos from Booking.com API using fetch
    const url = `https://booking-com15.p.rapidapi.com/api/v1/hotels/getHotelPhotos?hotel_id=${hotelId}`;
    const options = {
      method: 'GET',
      headers: {
        'X-RapidAPI-Key': process.env.NEXT_PUBLIC_HOTEL_API_KEY || '43f4d26f35mshce7092ec3b58911p1dd88bjsneeb2ab5758d7',
        'X-RapidAPI-Host': process.env.NEXT_PUBLIC_HOTEL_API_HOST || 'booking-com15.p.rapidapi.com'
      }
    };

    const response = await fetch(url, options);

    if (!response.ok) {
      throw new Error(`API responded with status: ${response.status}`);
    }

    const photosResponse: HotelPhotosResponse = await response.json();
    console.log('Hotel photos API response:', photosResponse);

    // We'll handle empty responses in the processing logic below instead of returning an error

    // Process photos to ensure they have the expected format
    let processedPhotos = [];

    // Check if data has the expected structure
    if (photosResponse.data && Array.isArray(photosResponse.data)) {
      processedPhotos = photosResponse.data.map(photo => ({
        id: photo.id || '',
        url_max: photo.url_max || photo.url || '',
        url_1440: photo.url_1440 || photo.url || ''
      }));
    }
    // Check if data itself is an array
    else if (Array.isArray(photosResponse)) {
      processedPhotos = photosResponse.map(photo => ({
        id: photo.id || '',
        url_max: photo.url_max || photo.url || '',
        url_1440: photo.url_1440 || photo.url || ''
      }));
    }
    // Check if data has a results property that's an array
    else if (photosResponse.results && Array.isArray(photosResponse.results)) {
      processedPhotos = photosResponse.results.map(photo => ({
        id: photo.id || '',
        url_max: photo.url_max || photo.url || '',
        url_1440: photo.url_1440 || photo.url || ''
      }));
    }

    // If no photos were found, return a default placeholder
    if (processedPhotos.length === 0) {
      processedPhotos = [{
        id: 'placeholder',
        url_max: 'data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%22288%22%20height%3D%22225%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20288%20225%22%20preserveAspectRatio%3D%22none%22%3E%3Cdefs%3E%3Cstyle%20type%3D%22text%2Fcss%22%3E%23holder_18e5fca5cc8%20text%20%7B%20fill%3A%23eceeef%3Bfont-weight%3Abold%3Bfont-family%3AArial%2C%20Helvetica%2C%20Open%20Sans%2C%20sans-serif%2C%20monospace%3Bfont-size%3A14pt%20%7D%20%3C%2Fstyle%3E%3C%2Fdefs%3E%3Cg%20id%3D%22holder_18e5fca5cc8%22%3E%3Crect%20width%3D%22288%22%20height%3D%22225%22%20fill%3D%22%2355595c%22%3E%3C%2Frect%3E%3Cg%3E%3Ctext%20x%3D%2296.82500076293945%22%20y%3D%22118.74000034332275%22%3EHotel%20Image%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E',
        url_1440: 'data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%22288%22%20height%3D%22225%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20288%20225%22%20preserveAspectRatio%3D%22none%22%3E%3Cdefs%3E%3Cstyle%20type%3D%22text%2Fcss%22%3E%23holder_18e5fca5cc8%20text%20%7B%20fill%3A%23eceeef%3Bfont-weight%3Abold%3Bfont-family%3AArial%2C%20Helvetica%2C%20Open%20Sans%2C%20sans-serif%2C%20monospace%3Bfont-size%3A14pt%20%7D%20%3C%2Fstyle%3E%3C%2Fdefs%3E%3Cg%20id%3D%22holder_18e5fca5cc8%22%3E%3Crect%20width%3D%22288%22%20height%3D%22225%22%20fill%3D%22%2355595c%22%3E%3C%2Frect%3E%3Cg%3E%3Ctext%20x%3D%2296.82500076293945%22%20y%3D%22118.74000034332275%22%3EHotel%20Image%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E'
      }];
    }

    return NextResponse.json({
      status: true,
      message: "Success",
      timestamp: Date.now(),
      data: processedPhotos
    });
  } catch (error: any) {
    console.error('API error:', error);
    return NextResponse.json(
      {
        error: error.message || 'An error occurred while fetching hotel photos',
        details: {}
      },
      { status: 500 }
    );
  }
}
