// services/hotelApi.ts
import axios, { AxiosResponse, AxiosRequestConfig } from "axios";

// Types
interface LocationResponse {
    status: boolean;
    message: string;
    timestamp: number;
    data: Array<{
        dest_id: string;
        city_name: string;
        country: string;
        label: string;
    }>;
}

interface HotelSearchParams {
    destId: string;
    checkIn: string;
    checkOut: string;
    adults: number;
    rooms: number;
}

interface HotelSearchResponse {
    status: boolean;
    message: string;
    data: HotelApiData[];
}

interface HotelApiData {
    hotel_id?: string;
    hotel_name: string;
    review_score?: number;
    address: string;
    max_photo_url?: string;
    facilities?: string[];
    reviews?: Array<{
        name: string;
        comment: string;
        rating: number;
        date: string;
    }>;
    min_total_price?: number;
    original_price?: number;
    hotel_description?: string;
    distance_to_cc?: string;
    class?: number;
    photos?: Array<{
        url_max: string;
        url_1440: string;
    }>;
    review_details?: {
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
    };
    room_availability?: {
        available: boolean;
        rooms: Array<{
            name: string;
            price: number;
            description: string;
            amenities: string[];
            max_occupancy: number;
            available_rooms: number;
        }>;
    };
}

// Debug environment variables
console.log('API Key:', process.env.NEXT_PUBLIC_HOTEL_API_KEY ? 'Set (length: ' + process.env.NEXT_PUBLIC_HOTEL_API_KEY.length + ')' : 'Not set');
console.log('API Host:', process.env.NEXT_PUBLIC_HOTEL_API_HOST ? 'Set (value: ' + process.env.NEXT_PUBLIC_HOTEL_API_HOST + ')' : 'Not set');

// Axios Instance
const api = axios.create({
    baseURL: 'https://booking-com15.p.rapidapi.com/api/v1',
    headers: {
        'X-RapidAPI-Key': process.env.NEXT_PUBLIC_HOTEL_API_KEY || '43f4d26f35mshce7092ec3b58911p1dd88bjsneeb2ab5758d7',
        'X-RapidAPI-Host': process.env.NEXT_PUBLIC_HOTEL_API_HOST || 'booking-com15.p.rapidapi.com',
    },
});

// Log the API configuration
console.log('API Configuration:', {
    baseURL: api.defaults.baseURL,
    headers: 'Headers configured with API key and host'
});

// Rate Limiting
let lastRequestTime = 0;
const MIN_REQUEST_INTERVAL = 1000;

api.interceptors.request.use(async (config: AxiosRequestConfig) => {
    const now = Date.now();
    const timeSinceLastRequest = now - lastRequestTime;

    if (timeSinceLastRequest < MIN_REQUEST_INTERVAL) {
        await new Promise((resolve) =>
            setTimeout(resolve, MIN_REQUEST_INTERVAL - timeSinceLastRequest)
        );
    }

    lastRequestTime = Date.now();
    return config;
});

// Get Destination ID
export const getDestinationId = async (destination: string): Promise<string> => {
    try {
        const response: AxiosResponse<LocationResponse> = await api.get('/hotels/searchDestination', {
            params: { query: destination },
        });

        // Validate response data
        if (!response.data?.data || !Array.isArray(response.data.data) || response.data.data.length === 0) {
            throw new Error(`No destinations found for "${destination}"`);
        }

        const location = response.data.data[0];
        return location.dest_id;

    } catch (error: any) {
        if (error.response?.status === 429) {
            console.warn('Rate limit hit, retrying...');
            await new Promise(resolve => setTimeout(resolve, 2000));
            return getDestinationId(destination);
        }

        // Log the full error for debugging
        console.error('Error fetching destination:', {
            error,
            response: error.response?.data,
            destination
        });

        // Throw a user-friendly error
        throw new Error(
            error.response?.data?.message ||
            error.message ||
            `Failed to find destination "${destination}"`
        );
    }
};

// Search Hotels
export const searchHotels = async (params: HotelSearchParams): Promise<HotelApiData[]> => {
    try {
        const response: AxiosResponse<HotelSearchResponse> = await api.get("/hotels/search", {
            params: {
                destination_id: params.destId,
                checkin: params.checkIn,
                checkout: params.checkOut,
                adults: params.adults,
                room_qty: params.rooms,
                currency_code: "USD",
            },
        });

        if (response.data.status) {
            return response.data.data;
        }

        throw new Error(response.data.message || "Failed to fetch hotels");
    } catch (error: any) {
        if (error.response?.status === 429) {
            console.warn("Rate limit hit, retrying...");
            await new Promise((resolve) => setTimeout(resolve, 2000));
            return searchHotels(params);
        }
        console.error("Error searching hotels:", error);
        throw error;
    }
};

// Search Destination
export const searchDestination = async (query: string): Promise<LocationResponse> => {
    try {
        const response: AxiosResponse<LocationResponse> = await api.get('/hotels/searchDestination', {
            params: { query }
        });

        if (!response.data?.data || !Array.isArray(response.data.data)) {
            throw new Error(`No destinations found for "${query}"`);
        }

        return response.data;
    } catch (error: any) {
        if (error.response?.status === 429) {
            console.warn('Rate limit hit, retrying...');
            await new Promise(resolve => setTimeout(resolve, 2000));
            return searchDestination(query);
        }

        console.error('Error searching destinations:', {
            error,
            response: error.response?.data,
            query
        });

        throw new Error(
            error.response?.data?.message ||
            error.message ||
            `Failed to search destinations for "${query}"`
        );
    }
};

// Get Hotel Photos
export const getHotelPhotos = async (hotelId: string) => {
    try {
        const response: AxiosResponse<any> = await api.get('/hotels/getHotelPhotos', {
            params: { hotel_id: hotelId }
        });

        if (!response.data?.data) {
            throw new Error(`No photos found for hotel ID ${hotelId}`);
        }

        return response.data.data;
    } catch (error: any) {
        if (error.response?.status === 429) {
            console.warn('Rate limit hit, retrying...');
            await new Promise(resolve => setTimeout(resolve, 2000));
            return getHotelPhotos(hotelId);
        }

        console.error('Error fetching hotel photos:', {
            error,
            response: error.response?.data,
            hotelId
        });

        throw new Error(
            error.response?.data?.message ||
            error.message ||
            `Failed to fetch photos for hotel ID ${hotelId}`
        );
    }
};

// Get Hotel Reviews
export const getHotelReviews = async (hotelId: string, languageCode: string = 'en-us') => {
    try {
        const response: AxiosResponse<any> = await api.get('/hotels/getHotelReviewScores', {
            params: {
                hotel_id: hotelId,
                languagecode: languageCode
            }
        });

        if (!response.data?.data) {
            throw new Error(`No reviews found for hotel ID ${hotelId}`);
        }

        return response.data.data;
    } catch (error: any) {
        if (error.response?.status === 429) {
            console.warn('Rate limit hit, retrying...');
            await new Promise(resolve => setTimeout(resolve, 2000));
            return getHotelReviews(hotelId, languageCode);
        }

        console.error('Error fetching hotel reviews:', {
            error,
            response: error.response?.data,
            hotelId
        });

        throw new Error(
            error.response?.data?.message ||
            error.message ||
            `Failed to fetch reviews for hotel ID ${hotelId}`
        );
    }
};

// Get Room Availability
export const getRoomAvailability = async (hotelId: string, currencyCode: string = 'USD', location: string = 'US') => {
    try {
        const response: AxiosResponse<any> = await api.get('/hotels/getAvailability', {
            params: {
                hotel_id: hotelId,
                currency_code: currencyCode,
                location: location
            }
        });

        if (!response.data?.data) {
            throw new Error(`No availability data found for hotel ID ${hotelId}`);
        }

        return response.data.data;
    } catch (error: any) {
        if (error.response?.status === 429) {
            console.warn('Rate limit hit, retrying...');
            await new Promise(resolve => setTimeout(resolve, 2000));
            return getRoomAvailability(hotelId, currencyCode, location);
        }

        console.error('Error fetching room availability:', {
            error,
            response: error.response?.data,
            hotelId
        });

        throw new Error(
            error.response?.data?.message ||
            error.message ||
            `Failed to fetch room availability for hotel ID ${hotelId}`
        );
    }
};

// Check environment variables
if (!process.env.NEXT_PUBLIC_HOTEL_API_KEY) {
    console.warn('Warning: NEXT_PUBLIC_HOTEL_API_KEY is not set');
}

if (!process.env.NEXT_PUBLIC_HOTEL_API_HOST) {
    console.warn('Warning: NEXT_PUBLIC_HOTEL_API_HOST is not set');
}
