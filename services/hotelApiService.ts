/**
 * Hotel API Service
 *
 * This service provides functions to interact with the Booking.com RapidAPI
 * using fetch instead of axios for API calls.
 */

// Types for API responses
export interface DestinationData {
  dest_id: string;
  dest_type: string;
  cc1?: string;
  city_name?: string;
  label?: string;
  longitude?: number;
  latitude?: number;
  type?: string;
  region?: string;
  city_ufi?: number;
  name: string;
  roundtrip?: string;
  country?: string;
  image_url?: string;
  nr_hotels?: number;
  lc?: string;
  hotels?: number;
}

export interface DestinationResponse {
  status: boolean;
  message: string;
  timestamp: number;
  data: DestinationData[];
}

export interface HotelPhoto {
  id?: number;
  url?: string;
  url_max?: string;
  url_1440?: string;
}

export interface HotelPhotosResponse {
  status: boolean;
  message: string;
  timestamp: number;
  data: HotelPhoto[];
}

export interface HotelReviewScore {
  score: number;
  total_score: number;
  score_breakdown: {
    cleanliness: number;
    facilities: number;
    comfort: number;
    value_for_money: number;
    staff: number;
    location: number;
    wifi: number;
  };
  review_count: number;
  review_categories: Array<{
    name: string;
    count: number;
  }>;
}

export interface HotelReviewResponse {
  status: boolean;
  message: string;
  timestamp: number;
  data: HotelReviewScore;
}

export interface HotelData {
  hotel_id: string;
  hotel_name: string;
  review_score?: number;
  address?: string;
  max_photo_url?: string;
  facilities?: string[];
  min_total_price?: number;
  original_price?: number;
  hotel_description?: string;
  distance_to_cc?: string;
  class?: number;
  photos?: HotelPhoto[];
  review_details?: HotelReviewScore;
}

export interface HotelSearchResponse {
  status: boolean;
  message: string;
  timestamp: number;
  data: HotelData[];
}

export interface HotelDetailsResponse {
  status: boolean;
  message: string;
  timestamp: number;
  data: HotelData;
}

export interface HotelAvailabilityResponse {
  status: boolean;
  message: string;
  timestamp: number;
  data: any; // Define more specific type if needed
}

export interface HotelDescriptionResponse {
  status: boolean;
  message: string;
  timestamp: number;
  data: {
    description: string;
    info: any[]; // Define more specific type if needed
  };
}

export interface RoomData {
  id: string;
  name: string;
  description?: string;
  price?: number;
  availability?: boolean;
  photos?: HotelPhoto[];
  amenities?: string[];
}

export interface RoomListResponse {
  status: boolean;
  message: string;
  timestamp: number;
  data: RoomData[];
}

export interface HotelPoliciesResponse {
  status: boolean;
  message: string;
  timestamp: number;
  data: any; // Define more specific type if needed
}

export interface NearbyCitiesResponse {
  status: boolean;
  message: string;
  timestamp: number;
  data: any[]; // Define more specific type if needed
}

export interface HotelQuestionsResponse {
  status: boolean;
  message: string;
  timestamp: number;
  data: any[]; // Define more specific type if needed
}

// API configuration
const API_BASE_URL = 'https://booking-com15.p.rapidapi.com/api/v1/hotels';
const API_KEY = process.env.NEXT_PUBLIC_HOTEL_API_KEY || '';
const API_HOST = process.env.NEXT_PUBLIC_HOTEL_API_HOST || 'booking-com15.p.rapidapi.com';

// Rate limiting
let lastRequestTime = 0;
const MIN_REQUEST_INTERVAL = 1000; // 1 second between requests

/**
 * Helper function to handle rate limiting
 */
const waitForRateLimit = async (): Promise<void> => {
  const now = Date.now();
  const timeSinceLastRequest = now - lastRequestTime;

  if (timeSinceLastRequest < MIN_REQUEST_INTERVAL) {
    await new Promise((resolve) =>
      setTimeout(resolve, MIN_REQUEST_INTERVAL - timeSinceLastRequest)
    );
  }

  lastRequestTime = Date.now();
};

/**
 * Helper function to make API requests with proper headers and rate limiting
 */
const fetchApi = async <T>(endpoint: string, params: Record<string, string> = {}): Promise<T> => {
  await waitForRateLimit();

  // Build URL with query parameters
  const queryParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    queryParams.append(key, value);
  });

  const url = `${API_BASE_URL}/${endpoint}?${queryParams.toString()}`;

  const options = {
    method: 'GET',
    headers: {
      'X-RapidAPI-Key': API_KEY,
      'X-RapidAPI-Host': API_HOST
    }
  };

  try {
    console.log(`Fetching from: ${url}`);
    const response = await fetch(url, options);

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`API error (${response.status}): ${errorText}`);
      throw new Error(`API responded with status: ${response.status}, message: ${errorText}`);
    }

    return await response.json() as T;
  } catch (error) {
    console.error(`Error fetching from ${endpoint}:`, error);
    throw error;
  }
};

/**
 * Search for destinations (cities, regions, etc.)
 */
export const searchDestination = async (query: string): Promise<DestinationResponse> => {
  return fetchApi<DestinationResponse>('searchDestination', { query });
};

/**
 * Search for hotels in a destination
 */
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
}): Promise<HotelSearchResponse> => {
  const defaultParams = {
    search_type: 'CITY',
    adults: '2',
    children_age: '0,0',
    room_qty: '1',
    page_number: '1',
    currency_code: 'USD',
    sort_by: 'popularity'
  };

  return fetchApi<HotelSearchResponse>('searchHotels', { ...defaultParams, ...params });
};

/**
 * Search for hotels by coordinates
 */
export const searchHotelsByCoordinates = async (params: {
  latitude: string;
  longitude: string;
  adults?: string;
  children_age?: string;
  room_qty?: string;
  page_number?: string;
  currency_code?: string;
  units?: string;
  temperature_unit?: string;
  languagecode?: string;
}): Promise<HotelSearchResponse> => {
  const defaultParams = {
    adults: '1',
    children_age: '0,0',
    room_qty: '1',
    units: 'metric',
    page_number: '1',
    temperature_unit: 'c',
    languagecode: 'en-us',
    currency_code: 'USD'
  };

  return fetchApi<HotelSearchResponse>('searchHotelsByCoordinates', { ...defaultParams, ...params });
};

/**
 * Get hotel details
 */
export const getHotelDetails = async (params: {
  hotel_id: string;
  adults?: string;
  children_age?: string;
  room_qty?: string;
  units?: string;
  temperature_unit?: string;
  languagecode?: string;
  currency_code?: string;
}): Promise<HotelDetailsResponse> => {
  const defaultParams = {
    adults: '1',
    children_age: '0,0',
    room_qty: '1',
    units: 'metric',
    temperature_unit: 'c',
    languagecode: 'en-us',
    currency_code: 'USD'
  };

  return fetchApi<HotelDetailsResponse>('getHotelDetails', { ...defaultParams, ...params });
};

/**
 * Get hotel photos
 */
export const getHotelPhotos = async (hotel_id: string): Promise<HotelPhotosResponse> => {
  return fetchApi<HotelPhotosResponse>('getHotelPhotos', { hotel_id });
};

/**
 * Get hotel room availability
 */
export const getHotelAvailability = async (params: {
  hotel_id: string;
  currency_code?: string;
  location?: string;
}): Promise<HotelAvailabilityResponse> => {
  const defaultParams = {
    currency_code: 'USD',
    location: 'US'
  };

  return fetchApi<HotelAvailabilityResponse>('getAvailability', { ...defaultParams, ...params });
};

/**
 * Get hotel description and information
 */
export const getHotelDescription = async (params: {
  hotel_id: string;
  languagecode?: string;
}): Promise<HotelDescriptionResponse> => {
  const defaultParams = {
    languagecode: 'en-us'
  };

  return fetchApi<HotelDescriptionResponse>('getDescriptionAndInfo', { ...defaultParams, ...params });
};

/**
 * Get hotel room list
 */
export const getHotelRoomList = async (params: {
  hotel_id: string;
  adults?: string;
  children_age?: string;
  room_qty?: string;
  units?: string;
  temperature_unit?: string;
  languagecode?: string;
  currency_code?: string;
  location?: string;
}): Promise<RoomListResponse> => {
  const defaultParams = {
    adults: '1',
    children_age: '0,0',
    room_qty: '1',
    units: 'metric',
    temperature_unit: 'c',
    languagecode: 'en-us',
    currency_code: 'USD',
    location: 'US'
  };

  return fetchApi<RoomListResponse>('getRoomList', { ...defaultParams, ...params });
};

/**
 * Get hotel policies
 */
export const getHotelPolicies = async (params: {
  hotel_id: string;
  languagecode?: string;
}): Promise<HotelPoliciesResponse> => {
  const defaultParams = {
    languagecode: 'en-us'
  };

  return fetchApi<HotelPoliciesResponse>('getHotelPolicies', { ...defaultParams, ...params });
};

/**
 * Get hotel review scores
 */
export const getHotelReviewScores = async (params: {
  hotel_id: string;
  languagecode?: string;
}): Promise<HotelReviewResponse> => {
  const defaultParams = {
    languagecode: 'en-us'
  };

  return fetchApi<HotelReviewResponse>('getHotelReviewScores', { ...defaultParams, ...params });
};

/**
 * Get hotel review filter metadata
 */
export const getHotelReviewFilterMetadata = async (params: {
  hotel_id: string;
  languagecode?: string;
}): Promise<any> => {
  const defaultParams = {
    languagecode: 'en-us'
  };

  return fetchApi<any>('getHotelReviewsFilterMetadata', { ...defaultParams, ...params });
};

/**
 * Get nearby cities
 */
export const getNearbyCities = async (params: {
  latitude: string;
  longitude: string;
  languagecode?: string;
}): Promise<NearbyCitiesResponse> => {
  const defaultParams = {
    languagecode: 'en-us'
  };

  return fetchApi<NearbyCitiesResponse>('getNearbyCities', { ...defaultParams, ...params });
};

/**
 * Get hotel questions and answers
 */
export const getHotelQuestions = async (params: {
  hotel_id: string;
  languagecode?: string;
}): Promise<HotelQuestionsResponse> => {
  const defaultParams = {
    languagecode: 'en-us'
  };

  return fetchApi<HotelQuestionsResponse>('getQuestionAndAnswer', { ...defaultParams, ...params });
};

/**
 * Get hotel room list with availability
 */
export const getRoomListWithAvailability = async (params: {
  hotel_id: string;
  adults?: string;
  children_age?: string;
  room_qty?: string;
  units?: string;
  temperature_unit?: string;
  languagecode?: string;
  currency_code?: string;
  location?: string;
}): Promise<any> => {
  const defaultParams = {
    adults: '1',
    children_age: '0,0',
    room_qty: '1',
    units: 'metric',
    temperature_unit: 'c',
    languagecode: 'en-us',
    currency_code: 'USD',
    location: 'US'
  };

  return fetchApi<any>('getRoomListWithAvailability', { ...defaultParams, ...params });
};

/**
 * Get hotel filter options
 */
export const getHotelFilter = async (params: {
  dest_id: string;
  search_type?: string;
  adults?: string;
  children_age?: string;
  room_qty?: string;
}): Promise<any> => {
  const defaultParams = {
    search_type: 'CITY',
    adults: '1',
    children_age: '0,0',
    room_qty: '1'
  };

  return fetchApi<any>('getFilter', { ...defaultParams, ...params });
};

/**
 * Get hotel sort options
 */
export const getHotelSortBy = async (params: {
  dest_id: string;
  search_type?: string;
  adults?: string;
  children_age?: string;
  room_qty?: string;
}): Promise<any> => {
  const defaultParams = {
    search_type: 'CITY',
    adults: '1',
    children_age: '0,0',
    room_qty: '1'
  };

  return fetchApi<any>('getSortBy', { ...defaultParams, ...params });
};

/**
 * Fallback function to get static hotel photos if API fails
 */
export const getStaticHotelPhotos = (): { url: string }[] => {
  return [
    {
      url: 'https://cf.bstatic.com/xdata/images/hotel/max1024x768/405276856.jpg?k=4a4a8e3ba5a0d0d27bd5e6c9622dbc8e9a8001c66dc9f9f72d5fd3a6a8e2a71a&o=&hp=1'
    },
    {
      url: 'https://cf.bstatic.com/xdata/images/hotel/max1024x768/223496641.jpg?k=070c9a65c52e7944d8f0c1d3c75e4e35c1310adcec65cb1c22b9d2a4b52af4cf&o=&hp=1'
    },
    {
      url: 'https://cf.bstatic.com/xdata/images/hotel/max1024x768/187855079.jpg?k=8c3c9e3850da452c9a20065c8d8994b4d87a4a31dc93b137d3fa2ce24394b1a7&o=&hp=1'
    },
    {
      url: 'https://cf.bstatic.com/xdata/images/hotel/max1024x768/430342048.jpg?k=a9f54a35e36e1a4d51a7a0b64e1a4a6258feea7a5d5f5b9b18c9e3c8a0a1c55c&o=&hp=1'
    },
    {
      url: 'https://cf.bstatic.com/xdata/images/hotel/max1024x768/430342036.jpg?k=0a5bc4c1a7f7d7c3055b9a4e53c2683f4e0e47f8b1b3e8e9e3b9c863451ede20&o=&hp=1'
    }
  ];
};
