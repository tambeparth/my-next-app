import axios from 'axios';

// Base configuration for all Booking.com API calls
const createBookingApiClient = () => {
  return axios.create({
    baseURL: 'https://booking-com15.p.rapidapi.com/api/v1/hotels',
    headers: {
      'X-RapidAPI-Key': process.env.NEXT_PUBLIC_rapidapi_key || '',
      'X-RapidAPI-Host': process.env.NEXT_PUBLIC_rapidapi_host || 'booking-com15.p.rapidapi.com'
    }
  });
};

// Search for destinations (cities, regions, etc.)
export const searchDestination = async (query: string) => {
  try {
    const apiClient = createBookingApiClient();
    const response = await apiClient.get('/searchDestination', {
      params: { query }
    });
    return response.data;
  } catch (error) {
    console.error('Error searching destination:', error);
    throw error;
  }
};

// Search for hotels in a destination
export const searchHotels = async (params: {
  dest_id: string;
  search_type?: string;
  arrival_date?: string;
  departure_date?: string;
  adults?: string;
  children_age?: string;
  room_qty?: string;
  page_number?: string;
  currency_code?: string;
  sort_by?: string;
  price_min?: string;
  price_max?: string;
}) => {
  try {
    const apiClient = createBookingApiClient();
    const defaultParams = {
      search_type: 'CITY',
      adults: '2',
      children_age: '0,0',
      room_qty: '1',
      page_number: '1',
      sort_by: 'popularity',
      currency_code: 'USD'
    };

    const response = await apiClient.get('/searchHotels', {
      params: { ...defaultParams, ...params }
    });
    return response.data;
  } catch (error) {
    console.error('Error searching hotels:', error);
    throw error;
  }
};

// Get hotel details
export const getHotelDetails = async (params: {
  hotel_id: string;
  arrival_date?: string;
  departure_date?: string;
  adults?: string;
  children_age?: string;
  room_qty?: string;
  currency_code?: string;
}) => {
  try {
    const apiClient = createBookingApiClient();
    const defaultParams = {
      adults: '2',
      children_age: '0,0',
      room_qty: '1',
      currency_code: 'USD'
    };

    const response = await apiClient.get('/getHotelDetails', {
      params: { ...defaultParams, ...params }
    });
    return response.data;
  } catch (error) {
    console.error('Error getting hotel details:', error);
    throw error;
  }
};

// Get hotel photos
export const getHotelPhotos = async (hotelId: string) => {
  try {
    const apiClient = createBookingApiClient();
    const response = await apiClient.get('/getHotelPhotos', {
      params: { hotel_id: hotelId }
    });
    return response.data;
  } catch (error) {
    console.error('Error getting hotel photos:', error);
    throw error;
  }
};

// Fallback function to get static hotel photos if API fails
export const getStaticHotelPhotos = () => {
  return [
    {
      url_max: '/images/hotel-placeholder-1.jpg',
      url_1440: '/images/hotel-placeholder-1.jpg'
    },
    {
      url_max: '/images/hotel-placeholder-2.jpg',
      url_1440: '/images/hotel-placeholder-2.jpg'
    },
    {
      url_max: '/images/hotel-placeholder-3.jpg',
      url_1440: '/images/hotel-placeholder-3.jpg'
    },
    {
      url_max: '/images/hotel-placeholder-4.jpg',
      url_1440: '/images/hotel-placeholder-4.jpg'
    },
    {
      url_max: '/images/hotel-placeholder-5.jpg',
      url_1440: '/images/hotel-placeholder-5.jpg'
    }
  ];
};
