"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
    Star,
    MapPin,
    ChevronRight,
    Loader,
    Wifi,
    Waves,
    Utensils,
    Heart,
    Calendar,
    Users,
    Check,
    X,
    ChevronLeft,
    ChevronDown,
    ChevronUp,
    Image,
} from "lucide-react";
import Link from "next/link";
import { searchDestination, searchHotels, getHotelDetails, getHotelPhotos, getStaticHotelPhotos } from "../../utils/api";

interface HotelData {
    id?: string;
    name: string;
    rating: number;
    location: string;
    photo: string;
    photos?: Array<{
        url_max?: string;
        url_1440?: string;
        url?: string;
    }>;
    amenities: string[];
    reviews: Array<{
        name: string;
        comment: string;
        rating: number;
        date: string;
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
    price: {
        current: string;
        original?: string;
    };
    description: string;
    distance_to_center?: string;
    stars: number;
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

const amenityIcons: Record<string, React.ReactNode> = {
    "Free Wi-Fi": <Wifi className="h-4 w-4" />,
    "Swimming Pool": <Waves className="h-4 w-4" />,
    "Restaurant": <Utensils className="h-4 w-4" />,
    Spa: <Heart className="h-4 w-4" />,
};

export default function HotelPage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const destination = searchParams?.get("destination");
    const hotelId = searchParams?.get("hotel_id");
    const [hotel, setHotel] = useState<HotelData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [activePhotoIndex, setActivePhotoIndex] = useState(0);
    const [showAllPhotos, setShowAllPhotos] = useState(false);
    const [showAllAmenities, setShowAllAmenities] = useState(false);
    const [showAllRooms, setShowAllRooms] = useState(false);

    // Debug state
    const [debugInfo, setDebugInfo] = useState<{
        steps: string[];
        responses: Record<string, any>;
    }>({
        steps: [],
        responses: {}
    });

    useEffect(() => {
        const fetchHotelDetails = async () => {
            if (!destination) {
                setError("No destination specified");
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                setError("");

                // Reset debug info
                setDebugInfo({
                    steps: ['Starting API calls'],
                    responses: {}
                });

                // Step 1: Search for destination using the API
                let destResponse: any;
                let destId: string;

                try {
                    setDebugInfo(prev => ({
                        ...prev,
                        steps: [...prev.steps, `Searching for destination: ${destination}`]
                    }));

                    // Try to use the real API first
                    try {
                        setDebugInfo(prev => ({
                            ...prev,
                            steps: [...prev.steps, `Attempting API destination search for: ${destination}`]
                        }));

                        destResponse = await searchDestination(destination || '');
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
                                    dest_id: `${destination?.toLowerCase().replace(/\s+/g, '-') || 'unknown'}-123456`,
                                    dest_type: "city",
                                    city_name: destination || 'Unknown Location',
                                    country_name: "Country",
                                    image_url: `https://source.unsplash.com/random/800x600/?${encodeURIComponent(destination || 'city')},city`
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

                    // Use the destination ID
                    destId = destResponse.data[0].dest_id;
                    console.log('Destination ID:', destId);
                } catch (destErr: any) {
                    console.error('Destination search completely failed:', destErr);

                    // Update debug info
                    setDebugInfo(prev => ({
                        ...prev,
                        steps: [...prev.steps, `Destination search failed: ${destErr.message}`]
                    }));

                    throw new Error(`Failed to search destination: ${destErr.message}`);
                }

                // Step 2: Search for hotels using the API
                interface HotelResponseItem {
                    hotel_id?: string;
                    hotel_name?: string;
                    address?: string;
                    review_score?: number;
                    max_photo_url?: string;
                    min_total_price?: number;
                    facilities?: string[];
                    distance_to_cc?: string;
                    class?: number;
                    hotel_description?: string;
                    photos?: Array<{
                        url_max?: string;
                        url_1440?: string;
                        url?: string; // Added for different API response formats
                    }>;
                    reviews?: Array<{
                        name: string;
                        comment: string;
                        rating: number;
                        date: string;
                    }>;
                    // Optional properties that might be used in fallbacks
                    rating?: number;
                    location?: string;
                    photo?: string;
                    main_photo_url?: string;
                    amenities?: string[];
                    price?: number;
                    original_price?: number;
                    description?: string;
                    distance_to_center?: string;
                    stars?: number;
                    id?: string;
                    name?: string; // Added for different API response formats
                }

                let hotelsResponse: any;
                try {
                    setDebugInfo(prev => ({
                        ...prev,
                        steps: [...prev.steps, `Searching for hotels with destination ID: ${destId}`]
                    }));

                    // Format dates for the API
                    const today = new Date();
                    const tomorrow = new Date(today);
                    tomorrow.setDate(tomorrow.getDate() + 1);
                    const checkIn = today.toISOString().split('T')[0];
                    const checkOut = tomorrow.toISOString().split('T')[0];

                    console.log('Searching for hotels with params:', { destId, checkIn, checkOut });

                    // Try to use the real API first
                    try {
                        setDebugInfo(prev => ({
                            ...prev,
                            steps: [...prev.steps, `Attempting API hotel search for destination ID: ${destId}`]
                        }));

                        hotelsResponse = await searchHotels({
                            dest_id: destId,
                            search_type: 'CITY',
                            arrival_date: checkIn,
                            departure_date: checkOut,
                            adults: '2',
                            children_age: '0,0',
                            room_qty: '1',
                            page_number: '1',
                            sort_by: 'popularity',
                            price_min: '10',
                            price_max: '1000',
                            currency_code: 'USD'
                        });

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
                                    hotel_id: `${destination?.toLowerCase().replace(/\s+/g, '-') || 'unknown'}-hotel-1`,
                                    hotel_name: `Grand Hotel ${destination || 'Unknown Location'}`,
                                    address: `Main Street, ${destination || 'Unknown Location'}`,
                                    review_score: 8.5,
                                    max_photo_url: `data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%22288%22%20height%3D%22225%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20288%20225%22%20preserveAspectRatio%3D%22none%22%3E%3Cdefs%3E%3Cstyle%20type%3D%22text%2Fcss%22%3E%23holder_18e5fca5cc8%20text%20%7B%20fill%3A%23eceeef%3Bfont-weight%3Abold%3Bfont-family%3AArial%2C%20Helvetica%2C%20Open%20Sans%2C%20sans-serif%2C%20monospace%3Bfont-size%3A14pt%20%7D%20%3C%2Fstyle%3E%3C%2Fdefs%3E%3Cg%20id%3D%22holder_18e5fca5cc8%22%3E%3Crect%20width%3D%22288%22%20height%3D%22225%22%20fill%3D%22%2355595c%22%3E%3C%2Frect%3E%3Cg%3E%3Ctext%20x%3D%2296.82500076293945%22%20y%3D%22118.74000034332275%22%3EGrand%20Hotel%20${encodeURIComponent(destination || 'Unknown Location')}%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E`,
                                    min_total_price: 150,
                                    facilities: ['Free Wi-Fi', 'Swimming Pool', 'Restaurant', 'Spa'],
                                    distance_to_cc: '0.5 km',
                                    class: 4,
                                    hotel_description: `A luxurious hotel in the heart of ${destination || 'the city'} with excellent amenities and service.`,
                                    photos: [
                                        {
                                            url_max: `data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%22288%22%20height%3D%22225%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20288%20225%22%20preserveAspectRatio%3D%22none%22%3E%3Cdefs%3E%3Cstyle%20type%3D%22text%2Fcss%22%3E%23holder_18e5fca5cc8%20text%20%7B%20fill%3A%23eceeef%3Bfont-weight%3Abold%3Bfont-family%3AArial%2C%20Helvetica%2C%20Open%20Sans%2C%20sans-serif%2C%20monospace%3Bfont-size%3A14pt%20%7D%20%3C%2Fstyle%3E%3C%2Fdefs%3E%3Cg%20id%3D%22holder_18e5fca5cc8%22%3E%3Crect%20width%3D%22288%22%20height%3D%22225%22%20fill%3D%22%2355595c%22%3E%3C%2Frect%3E%3Cg%3E%3Ctext%20x%3D%2296.82500076293945%22%20y%3D%22118.74000034332275%22%3EHotel%20Photo%201%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E`,
                                            url_1440: `data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%22288%22%20height%3D%22225%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20288%20225%22%20preserveAspectRatio%3D%22none%22%3E%3Cdefs%3E%3Cstyle%20type%3D%22text%2Fcss%22%3E%23holder_18e5fca5cc8%20text%20%7B%20fill%3A%23eceeef%3Bfont-weight%3Abold%3Bfont-family%3AArial%2C%20Helvetica%2C%20Open%20Sans%2C%20sans-serif%2C%20monospace%3Bfont-size%3A14pt%20%7D%20%3C%2Fstyle%3E%3C%2Fdefs%3E%3Cg%20id%3D%22holder_18e5fca5cc8%22%3E%3Crect%20width%3D%22288%22%20height%3D%22225%22%20fill%3D%22%2355595c%22%3E%3C%2Frect%3E%3Cg%3E%3Ctext%20x%3D%2296.82500076293945%22%20y%3D%22118.74000034332275%22%3EHotel%20Photo%201%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E`
                                        },
                                        {
                                            url_max: `data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%22288%22%20height%3D%22225%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20288%20225%22%20preserveAspectRatio%3D%22none%22%3E%3Cdefs%3E%3Cstyle%20type%3D%22text%2Fcss%22%3E%23holder_18e5fca5cc8%20text%20%7B%20fill%3A%23eceeef%3Bfont-weight%3Abold%3Bfont-family%3AArial%2C%20Helvetica%2C%20Open%20Sans%2C%20sans-serif%2C%20monospace%3Bfont-size%3A14pt%20%7D%20%3C%2Fstyle%3E%3C%2Fdefs%3E%3Cg%20id%3D%22holder_18e5fca5cc8%22%3E%3Crect%20width%3D%22288%22%20height%3D%22225%22%20fill%3D%22%2355595c%22%3E%3C%2Frect%3E%3Cg%3E%3Ctext%20x%3D%2296.82500076293945%22%20y%3D%22118.74000034332275%22%3EHotel%20Photo%202%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E`,
                                            url_1440: `data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%22288%22%20height%3D%22225%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20288%20225%22%20preserveAspectRatio%3D%22none%22%3E%3Cdefs%3E%3Cstyle%20type%3D%22text%2Fcss%22%3E%23holder_18e5fca5cc8%20text%20%7B%20fill%3A%23eceeef%3Bfont-weight%3Abold%3Bfont-family%3AArial%2C%20Helvetica%2C%20Open%20Sans%2C%20sans-serif%2C%20monospace%3Bfont-size%3A14pt%20%7D%20%3C%2Fstyle%3E%3C%2Fdefs%3E%3Cg%20id%3D%22holder_18e5fca5cc8%22%3E%3Crect%20width%3D%22288%22%20height%3D%22225%22%20fill%3D%22%2355595c%22%3E%3C%2Frect%3E%3Cg%3E%3Ctext%20x%3D%2296.82500076293945%22%20y%3D%22118.74000034332275%22%3EHotel%20Photo%202%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E`
                                        },
                                        {
                                            url_max: `data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%22288%22%20height%3D%22225%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20288%20225%22%20preserveAspectRatio%3D%22none%22%3E%3Cdefs%3E%3Cstyle%20type%3D%22text%2Fcss%22%3E%23holder_18e5fca5cc8%20text%20%7B%20fill%3A%23eceeef%3Bfont-weight%3Abold%3Bfont-family%3AArial%2C%20Helvetica%2C%20Open%20Sans%2C%20sans-serif%2C%20monospace%3Bfont-size%3A14pt%20%7D%20%3C%2Fstyle%3E%3C%2Fdefs%3E%3Cg%20id%3D%22holder_18e5fca5cc8%22%3E%3Crect%20width%3D%22288%22%20height%3D%22225%22%20fill%3D%22%2355595c%22%3E%3C%2Frect%3E%3Cg%3E%3Ctext%20x%3D%2296.82500076293945%22%20y%3D%22118.74000034332275%22%3EHotel%20Photo%203%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E`,
                                            url_1440: `data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%22288%22%20height%3D%22225%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20288%20225%22%20preserveAspectRatio%3D%22none%22%3E%3Cdefs%3E%3Cstyle%20type%3D%22text%2Fcss%22%3E%23holder_18e5fca5cc8%20text%20%7B%20fill%3A%23eceeef%3Bfont-weight%3Abold%3Bfont-family%3AArial%2C%20Helvetica%2C%20Open%20Sans%2C%20sans-serif%2C%20monospace%3Bfont-size%3A14pt%20%7D%20%3C%2Fstyle%3E%3C%2Fdefs%3E%3Cg%20id%3D%22holder_18e5fca5cc8%22%3E%3Crect%20width%3D%22288%22%20height%3D%22225%22%20fill%3D%22%2355595c%22%3E%3C%2Frect%3E%3Cg%3E%3Ctext%20x%3D%2296.82500076293945%22%20y%3D%22118.74000034332275%22%3EHotel%20Photo%203%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E`
                                        }
                                    ],
                                    reviews: [
                                        {
                                            name: "John D.",
                                            comment: "Great hotel with excellent service. The rooms were clean and comfortable.",
                                            rating: 9,
                                            date: "2023-12-15"
                                        },
                                        {
                                            name: "Sarah M.",
                                            comment: "Wonderful location and amenities. Would definitely stay here again.",
                                            rating: 8,
                                            date: "2023-11-20"
                                        }
                                    ]
                                },
                                {
                                    hotel_id: `${destination?.toLowerCase().replace(/\s+/g, '-') || 'unknown'}-hotel-2`,
                                    hotel_name: `Luxury Resort ${destination || 'Unknown Location'}`,
                                    address: `Beach Road, ${destination || 'Unknown Location'}`,
                                    review_score: 9.2,
                                    max_photo_url: `data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%22288%22%20height%3D%22225%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20288%20225%22%20preserveAspectRatio%3D%22none%22%3E%3Cdefs%3E%3Cstyle%20type%3D%22text%2Fcss%22%3E%23holder_18e5fca5cc8%20text%20%7B%20fill%3A%23eceeef%3Bfont-weight%3Abold%3Bfont-family%3AArial%2C%20Helvetica%2C%20Open%20Sans%2C%20sans-serif%2C%20monospace%3Bfont-size%3A14pt%20%7D%20%3C%2Fstyle%3E%3C%2Fdefs%3E%3Cg%20id%3D%22holder_18e5fca5cc8%22%3E%3Crect%20width%3D%22288%22%20height%3D%22225%22%20fill%3D%22%2355595c%22%3E%3C%2Frect%3E%3Cg%3E%3Ctext%20x%3D%2296.82500076293945%22%20y%3D%22118.74000034332275%22%3ELuxury%20Resort%20${encodeURIComponent(destination || 'Unknown Location')}%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E`,
                                    min_total_price: 250,
                                    facilities: ['Free Wi-Fi', 'Swimming Pool', 'Restaurant', 'Spa', 'Gym', 'Beach Access'],
                                    distance_to_cc: '2.1 km',
                                    class: 5,
                                    hotel_description: `An exclusive resort in ${destination || 'this location'} offering premium amenities and breathtaking views.`,
                                    photos: [
                                        {
                                            url_max: `data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%22288%22%20height%3D%22225%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20288%20225%22%20preserveAspectRatio%3D%22none%22%3E%3Cdefs%3E%3Cstyle%20type%3D%22text%2Fcss%22%3E%23holder_18e5fca5cc8%20text%20%7B%20fill%3A%23eceeef%3Bfont-weight%3Abold%3Bfont-family%3AArial%2C%20Helvetica%2C%20Open%20Sans%2C%20sans-serif%2C%20monospace%3Bfont-size%3A14pt%20%7D%20%3C%2Fstyle%3E%3C%2Fdefs%3E%3Cg%20id%3D%22holder_18e5fca5cc8%22%3E%3Crect%20width%3D%22288%22%20height%3D%22225%22%20fill%3D%22%2355595c%22%3E%3C%2Frect%3E%3Cg%3E%3Ctext%20x%3D%2296.82500076293945%22%20y%3D%22118.74000034332275%22%3EResort%20Photo%201%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E`,
                                            url_1440: `data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%22288%22%20height%3D%22225%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20288%20225%22%20preserveAspectRatio%3D%22none%22%3E%3Cdefs%3E%3Cstyle%20type%3D%22text%2Fcss%22%3E%23holder_18e5fca5cc8%20text%20%7B%20fill%3A%23eceeef%3Bfont-weight%3Abold%3Bfont-family%3AArial%2C%20Helvetica%2C%20Open%20Sans%2C%20sans-serif%2C%20monospace%3Bfont-size%3A14pt%20%7D%20%3C%2Fstyle%3E%3C%2Fdefs%3E%3Cg%20id%3D%22holder_18e5fca5cc8%22%3E%3Crect%20width%3D%22288%22%20height%3D%22225%22%20fill%3D%22%2355595c%22%3E%3C%2Frect%3E%3Cg%3E%3Ctext%20x%3D%2296.82500076293945%22%20y%3D%22118.74000034332275%22%3EResort%20Photo%201%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E`
                                        },
                                        {
                                            url_max: `data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%22288%22%20height%3D%22225%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20288%20225%22%20preserveAspectRatio%3D%22none%22%3E%3Cdefs%3E%3Cstyle%20type%3D%22text%2Fcss%22%3E%23holder_18e5fca5cc8%20text%20%7B%20fill%3A%23eceeef%3Bfont-weight%3Abold%3Bfont-family%3AArial%2C%20Helvetica%2C%20Open%20Sans%2C%20sans-serif%2C%20monospace%3Bfont-size%3A14pt%20%7D%20%3C%2Fstyle%3E%3C%2Fdefs%3E%3Cg%20id%3D%22holder_18e5fca5cc8%22%3E%3Crect%20width%3D%22288%22%20height%3D%22225%22%20fill%3D%22%2355595c%22%3E%3C%2Frect%3E%3Cg%3E%3Ctext%20x%3D%2296.82500076293945%22%20y%3D%22118.74000034332275%22%3EResort%20Photo%202%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E`,
                                            url_1440: `data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%22288%22%20height%3D%22225%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20288%20225%22%20preserveAspectRatio%3D%22none%22%3E%3Cdefs%3E%3Cstyle%20type%3D%22text%2Fcss%22%3E%23holder_18e5fca5cc8%20text%20%7B%20fill%3A%23eceeef%3Bfont-weight%3Abold%3Bfont-family%3AArial%2C%20Helvetica%2C%20Open%20Sans%2C%20sans-serif%2C%20monospace%3Bfont-size%3A14pt%20%7D%20%3C%2Fstyle%3E%3C%2Fdefs%3E%3Cg%20id%3D%22holder_18e5fca5cc8%22%3E%3Crect%20width%3D%22288%22%20height%3D%22225%22%20fill%3D%22%2355595c%22%3E%3C%2Frect%3E%3Cg%3E%3Ctext%20x%3D%2296.82500076293945%22%20y%3D%22118.74000034332275%22%3EResort%20Photo%202%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E`
                                        },
                                        {
                                            url_max: `data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%22288%22%20height%3D%22225%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20288%20225%22%20preserveAspectRatio%3D%22none%22%3E%3Cdefs%3E%3Cstyle%20type%3D%22text%2Fcss%22%3E%23holder_18e5fca5cc8%20text%20%7B%20fill%3A%23eceeef%3Bfont-weight%3Abold%3Bfont-family%3AArial%2C%20Helvetica%2C%20Open%20Sans%2C%20sans-serif%2C%20monospace%3Bfont-size%3A14pt%20%7D%20%3C%2Fstyle%3E%3C%2Fdefs%3E%3Cg%20id%3D%22holder_18e5fca5cc8%22%3E%3Crect%20width%3D%22288%22%20height%3D%22225%22%20fill%3D%22%2355595c%22%3E%3C%2Frect%3E%3Cg%3E%3Ctext%20x%3D%2296.82500076293945%22%20y%3D%22118.74000034332275%22%3EResort%20Photo%203%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E`,
                                            url_1440: `data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%22288%22%20height%3D%22225%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20288%20225%22%20preserveAspectRatio%3D%22none%22%3E%3Cdefs%3E%3Cstyle%20type%3D%22text%2Fcss%22%3E%23holder_18e5fca5cc8%20text%20%7B%20fill%3A%23eceeef%3Bfont-weight%3Abold%3Bfont-family%3AArial%2C%20Helvetica%2C%20Open%20Sans%2C%20sans-serif%2C%20monospace%3Bfont-size%3A14pt%20%7D%20%3C%2Fstyle%3E%3C%2Fdefs%3E%3Cg%20id%3D%22holder_18e5fca5cc8%22%3E%3Crect%20width%3D%22288%22%20height%3D%22225%22%20fill%3D%22%2355595c%22%3E%3C%2Frect%3E%3Cg%3E%3Ctext%20x%3D%2296.82500076293945%22%20y%3D%22118.74000034332275%22%3EResort%20Photo%203%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E`
                                        }
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

                // Process hotel response with improved handling of different response formats
                let hotelData: HotelResponseItem[] = [];

                console.log('Processing hotel response:', JSON.stringify(hotelsResponse));
                console.log('Response type:', typeof hotelsResponse);

                // Log detailed information about the response structure
                if (hotelsResponse) {
                    console.log('Response keys:', Object.keys(hotelsResponse));

                    // Check for data property
                    if (hotelsResponse.data) {
                        console.log('Data property type:', typeof hotelsResponse.data);
                        console.log('Is data an array:', Array.isArray(hotelsResponse.data));
                        if (Array.isArray(hotelsResponse.data) && hotelsResponse.data.length > 0) {
                            console.log('First item in data:', hotelsResponse.data[0]);
                        }
                    }

                    // Check for result property
                    if (hotelsResponse.result) {
                        console.log('Result property type:', typeof hotelsResponse.result);
                        console.log('Is result an array:', Array.isArray(hotelsResponse.result));
                        if (Array.isArray(hotelsResponse.result) && hotelsResponse.result.length > 0) {
                            console.log('First item in result:', hotelsResponse.result[0]);
                        }
                    }
                }

                // Try to extract hotel data from different possible response structures
                if (hotelsResponse?.data && Array.isArray(hotelsResponse.data)) {
                    hotelData = hotelsResponse.data;
                } else if (hotelsResponse?.result && Array.isArray(hotelsResponse.result)) {
                    hotelData = hotelsResponse.result;
                } else if (hotelsResponse?.results && Array.isArray(hotelsResponse.results)) {
                    hotelData = hotelsResponse.results;
                } else if (Array.isArray(hotelsResponse)) {
                    hotelData = hotelsResponse;
                } else if (hotelsResponse && typeof hotelsResponse === 'object') {
                    // If the response is an object with hotel properties, wrap it in an array
                    if (hotelsResponse.hotel_id || hotelsResponse.hotel_name) {
                        hotelData = [hotelsResponse as HotelResponseItem];
                    }
                }

                // If we still don't have any hotel data, create additional mock data
                if (hotelData.length === 0) {
                    console.error('No hotel data found in response:', hotelsResponse);
                    setDebugInfo(prev => ({
                        ...prev,
                        steps: [...prev.steps, 'No hotel data found in API response, using mock data']
                    }));

                    // Use mock data for demonstration purposes
                    hotelData = [
                        {
                            hotel_id: `${destination.toLowerCase().replace(/\s+/g, '-')}-hotel-1`,
                            hotel_name: `Grand Hotel ${destination}`,
                            address: `Main Street, ${destination}`,
                            review_score: 8.5,
                            max_photo_url: `data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%22288%22%20height%3D%22225%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20288%20225%22%20preserveAspectRatio%3D%22none%22%3E%3Cdefs%3E%3Cstyle%20type%3D%22text%2Fcss%22%3E%23holder_18e5fca5cc8%20text%20%7B%20fill%3A%23eceeef%3Bfont-weight%3Abold%3Bfont-family%3AArial%2C%20Helvetica%2C%20Open%20Sans%2C%20sans-serif%2C%20monospace%3Bfont-size%3A14pt%20%7D%20%3C%2Fstyle%3E%3C%2Fdefs%3E%3Cg%20id%3D%22holder_18e5fca5cc8%22%3E%3Crect%20width%3D%22288%22%20height%3D%22225%22%20fill%3D%22%2355595c%22%3E%3C%2Frect%3E%3Cg%3E%3Ctext%20x%3D%2296.82500076293945%22%20y%3D%22118.74000034332275%22%3EGrand%20Hotel%20${encodeURIComponent(destination)}%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E`,
                            min_total_price: 150,
                            facilities: ['Free Wi-Fi', 'Swimming Pool', 'Restaurant', 'Spa'],
                            distance_to_cc: '0.5 km',
                            class: 4,
                            hotel_description: `A luxurious hotel in the heart of ${destination} with excellent amenities and service.`,
                            photos: [
                                {
                                    url_max: `data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%22288%22%20height%3D%22225%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20288%20225%22%20preserveAspectRatio%3D%22none%22%3E%3Cdefs%3E%3Cstyle%20type%3D%22text%2Fcss%22%3E%23holder_18e5fca5cc8%20text%20%7B%20fill%3A%23eceeef%3Bfont-weight%3Abold%3Bfont-family%3AArial%2C%20Helvetica%2C%20Open%20Sans%2C%20sans-serif%2C%20monospace%3Bfont-size%3A14pt%20%7D%20%3C%2Fstyle%3E%3C%2Fdefs%3E%3Cg%20id%3D%22holder_18e5fca5cc8%22%3E%3Crect%20width%3D%22288%22%20height%3D%22225%22%20fill%3D%22%2355595c%22%3E%3C%2Frect%3E%3Cg%3E%3Ctext%20x%3D%2296.82500076293945%22%20y%3D%22118.74000034332275%22%3EMock%20Hotel%20Room%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E`,
                                    url_1440: `data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%22288%22%20height%3D%22225%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20288%20225%22%20preserveAspectRatio%3D%22none%22%3E%3Cdefs%3E%3Cstyle%20type%3D%22text%2Fcss%22%3E%23holder_18e5fca5cc8%20text%20%7B%20fill%3A%23eceeef%3Bfont-weight%3Abold%3Bfont-family%3AArial%2C%20Helvetica%2C%20Open%20Sans%2C%20sans-serif%2C%20monospace%3Bfont-size%3A14pt%20%7D%20%3C%2Fstyle%3E%3C%2Fdefs%3E%3Cg%20id%3D%22holder_18e5fca5cc8%22%3E%3Crect%20width%3D%22288%22%20height%3D%22225%22%20fill%3D%22%2355595c%22%3E%3C%2Frect%3E%3Cg%3E%3Ctext%20x%3D%2296.82500076293945%22%20y%3D%22118.74000034332275%22%3EMock%20Hotel%20Room%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E`
                                },
                                {
                                    url_max: `data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%22288%22%20height%3D%22225%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20288%20225%22%20preserveAspectRatio%3D%22none%22%3E%3Cdefs%3E%3Cstyle%20type%3D%22text%2Fcss%22%3E%23holder_18e5fca5cc8%20text%20%7B%20fill%3A%23eceeef%3Bfont-weight%3Abold%3Bfont-family%3AArial%2C%20Helvetica%2C%20Open%20Sans%2C%20sans-serif%2C%20monospace%3Bfont-size%3A14pt%20%7D%20%3C%2Fstyle%3E%3C%2Fdefs%3E%3Cg%20id%3D%22holder_18e5fca5cc8%22%3E%3Crect%20width%3D%22288%22%20height%3D%22225%22%20fill%3D%22%2355595c%22%3E%3C%2Frect%3E%3Cg%3E%3Ctext%20x%3D%2296.82500076293945%22%20y%3D%22118.74000034332275%22%3EMock%20Hotel%20Lobby%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E`,
                                    url_1440: `data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%22288%22%20height%3D%22225%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20288%20225%22%20preserveAspectRatio%3D%22none%22%3E%3Cdefs%3E%3Cstyle%20type%3D%22text%2Fcss%22%3E%23holder_18e5fca5cc8%20text%20%7B%20fill%3A%23eceeef%3Bfont-weight%3Abold%3Bfont-family%3AArial%2C%20Helvetica%2C%20Open%20Sans%2C%20sans-serif%2C%20monospace%3Bfont-size%3A14pt%20%7D%20%3C%2Fstyle%3E%3C%2Fdefs%3E%3Cg%20id%3D%22holder_18e5fca5cc8%22%3E%3Crect%20width%3D%22288%22%20height%3D%22225%22%20fill%3D%22%2355595c%22%3E%3C%2Frect%3E%3Cg%3E%3Ctext%20x%3D%2296.82500076293945%22%20y%3D%22118.74000034332275%22%3EMock%20Hotel%20Lobby%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E`
                                }
                            ],
                            reviews: [
                                {
                                    name: "John D.",
                                    comment: "Great hotel with excellent service. The rooms were clean and comfortable.",
                                    rating: 9,
                                    date: "2023-12-15"
                                },
                                {
                                    name: "Sarah M.",
                                    comment: "Wonderful location and amenities. Would definitely stay here again.",
                                    rating: 8,
                                    date: "2023-11-20"
                                }
                            ]
                        }
                    ];

                    // Update debug info
                    setDebugInfo(prev => ({
                        ...prev,
                        steps: [...prev.steps, 'Using additional mock data due to empty response']
                    }));
                }

                // Use the specified hotel_id from URL or default to the first hotel
                const urlHotelId = hotelId; // Rename to avoid conflict
                const targetHotelIndex: number = urlHotelId
                    ? hotelData.findIndex((h: HotelResponseItem) => h.hotel_id === urlHotelId)
                    : 0;

                const selectedHotel: HotelResponseItem = hotelData[targetHotelIndex >= 0 ? targetHotelIndex : 0];

                if (!selectedHotel) {
                    throw new Error('Selected hotel not found');
                }

                setDebugInfo(prev => ({
                    ...prev,
                    steps: [...prev.steps, `Selected hotel: ${selectedHotel.hotel_name}`]
                }));

                // Log the selected hotel for debugging
                console.log('Selected hotel data:', selectedHotel);
                console.log('Selected hotel keys:', Object.keys(selectedHotel));

                // Extract hotel properties with improved fallbacks and logging
                console.log('Selected hotel for extraction:', selectedHotel);
                console.log('Selected hotel keys:', Object.keys(selectedHotel));

                // Log photo-related properties specifically
                console.log('Photo properties:', {
                    max_photo_url: selectedHotel.max_photo_url,
                    photo: selectedHotel.photo,
                    main_photo_url: selectedHotel.main_photo_url,
                    photos: selectedHotel.photos
                });

                if (selectedHotel.photos) {
                    console.log('Photos array type:', typeof selectedHotel.photos);
                    console.log('Is photos an array:', Array.isArray(selectedHotel.photos));
                    console.log('Photos length:', Array.isArray(selectedHotel.photos) ? selectedHotel.photos.length : 'not an array');
                    if (Array.isArray(selectedHotel.photos) && selectedHotel.photos.length > 0) {
                        console.log('First photo:', selectedHotel.photos[0]);
                        console.log('First photo keys:', Object.keys(selectedHotel.photos[0]));
                    }
                }

                const processedHotelId = selectedHotel.hotel_id || selectedHotel.id || 'hotel-1';
                const hotelName = selectedHotel.hotel_name || selectedHotel.name || `Hotel in ${destination || 'Unknown Location'}`;
                const hotelRating = selectedHotel.review_score || selectedHotel.rating || 4.5;
                const hotelLocation = selectedHotel.address || selectedHotel.location || destination;

                // Improved photo URL extraction with better fallbacks
                let hotelPhoto = '';
                if (selectedHotel.max_photo_url) {
                    hotelPhoto = selectedHotel.max_photo_url;
                    console.log('Using max_photo_url for main photo');
                } else if (selectedHotel.photo) {
                    hotelPhoto = selectedHotel.photo;
                    console.log('Using photo for main photo');
                } else if (selectedHotel.main_photo_url) {
                    hotelPhoto = selectedHotel.main_photo_url;
                    console.log('Using main_photo_url for main photo');
                } else if (selectedHotel.photos && Array.isArray(selectedHotel.photos) && selectedHotel.photos.length > 0) {
                    // Try to get the first photo from the photos array
                    const firstPhoto = selectedHotel.photos[0];
                    if (firstPhoto.url_max) {
                        hotelPhoto = firstPhoto.url_max;
                        console.log('Using first photo url_max for main photo');
                    } else if (firstPhoto.url_1440) {
                        hotelPhoto = firstPhoto.url_1440;
                        console.log('Using first photo url_1440 for main photo');
                    } else if (firstPhoto.url) {
                        hotelPhoto = firstPhoto.url;
                        console.log('Using first photo url for main photo');
                    }
                }

                // If still no photo, use a fallback
                if (!hotelPhoto) {
                    const hotelName = selectedHotel.hotel_name || selectedHotel.name || 'Hotel';
                    hotelPhoto = `data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%22288%22%20height%3D%22225%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20288%20225%22%20preserveAspectRatio%3D%22none%22%3E%3Cdefs%3E%3Cstyle%20type%3D%22text%2Fcss%22%3E%23holder_18e5fca5cc8%20text%20%7B%20fill%3A%23eceeef%3Bfont-weight%3Abold%3Bfont-family%3AArial%2C%20Helvetica%2C%20Open%20Sans%2C%20sans-serif%2C%20monospace%3Bfont-size%3A14pt%20%7D%20%3C%2Fstyle%3E%3C%2Fdefs%3E%3Cg%20id%3D%22holder_18e5fca5cc8%22%3E%3Crect%20width%3D%22288%22%20height%3D%22225%22%20fill%3D%22%2355595c%22%3E%3C%2Frect%3E%3Cg%3E%3Ctext%20x%3D%2296.82500076293945%22%20y%3D%22118.74000034332275%22%3E${encodeURIComponent(hotelName)}%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E`;
                    console.log('Using fallback image for main photo');
                }

                // Process photos array with better handling
                let hotelPhotos = [];
                if (selectedHotel.photos && Array.isArray(selectedHotel.photos) && selectedHotel.photos.length > 0) {
                    // Make sure each photo has the expected properties
                    hotelPhotos = selectedHotel.photos.map(photo => {
                        // If the photo already has the expected structure, use it
                        if (photo.url_max && photo.url_1440) {
                            return photo;
                        }

                        // Otherwise, create a proper structure
                        return {
                            url_max: photo.url_max || photo.url || photo.url_1440 || hotelPhoto,
                            url_1440: photo.url_1440 || photo.url || photo.url_max || hotelPhoto
                        };
                    });
                    console.log('Processed photos array:', hotelPhotos);
                } else {
                    // If no photos array, create one with the main photo
                    hotelPhotos = [
                        { url_max: hotelPhoto, url_1440: hotelPhoto }
                    ];
                    console.log('Created photos array from main photo');
                }

                const hotelFacilities = selectedHotel.facilities || selectedHotel.amenities || [
                    "Free Wi-Fi",
                    "Swimming Pool",
                    "Restaurant",
                    "Spa",
                ];
                const hotelReviews = selectedHotel.reviews || [];
                const hotelPrice = selectedHotel.min_total_price || selectedHotel.price || 200;
                const hotelOriginalPrice = selectedHotel.original_price;
                const hotelDescription = selectedHotel.hotel_description || selectedHotel.description || "A comfortable hotel with modern amenities.";
                const hotelDistanceToCenter = selectedHotel.distance_to_cc || selectedHotel.distance_to_center;
                const hotelStars = selectedHotel.class || selectedHotel.stars || 4;

                // Add mock review details and room availability
                const mockReviewDetails = {
                    score: hotelRating,
                    total_score: 10,
                    score_breakdown: {
                        cleanliness: 8.7,
                        facilities: 8.3,
                        comfort: 8.6,
                        value_for_money: 8.2,
                        staff: 9.0,
                        location: 8.8,
                        wifi: 7.9
                    },
                    review_count: 245,
                    review_categories: [
                        { name: 'Business travelers', count: 45 },
                        { name: 'Couples', count: 120 },
                        { name: 'Families', count: 80 }
                    ]
                };

                const mockRoomAvailability = {
                    available: true,
                    rooms: [
                        {
                            name: 'Standard Room',
                            price: hotelPrice,
                            description: 'Comfortable room with city view',
                            amenities: ['Free Wi-Fi', 'TV', 'Mini-bar'],
                            max_occupancy: 2,
                            available_rooms: 5
                        },
                        {
                            name: 'Deluxe Room',
                            price: Math.round(hotelPrice * 1.5),
                            description: 'Spacious room with premium amenities',
                            amenities: ['Free Wi-Fi', 'TV', 'Mini-bar', 'Coffee Machine'],
                            max_occupancy: 2,
                            available_rooms: 3
                        },
                        {
                            name: 'Suite',
                            price: Math.round(hotelPrice * 2),
                            description: 'Luxury suite with separate living area',
                            amenities: ['Free Wi-Fi', 'TV', 'Mini-bar', 'Jacuzzi', 'Kitchenette'],
                            max_occupancy: 4,
                            available_rooms: 2
                        }
                    ]
                };

                // Set the hotel data with all details
                setHotel({
                    id: processedHotelId,
                    name: hotelName,
                    rating: hotelRating,
                    location: hotelLocation,
                    photo: hotelPhoto,
                    photos: hotelPhotos,
                    amenities: hotelFacilities,
                    reviews: hotelReviews,
                    review_details: mockReviewDetails,
                    price: {
                        current: `$${hotelPrice}`,
                        original: hotelOriginalPrice
                            ? `$${hotelOriginalPrice}`
                            : undefined,
                    },
                    description: hotelDescription,
                    distance_to_center: hotelDistanceToCenter,
                    stars: hotelStars,
                    room_availability: mockRoomAvailability
                });
            } catch (err: any) {
                console.error('Error fetching hotel details:', err);

                // Update debug info with error
                setDebugInfo(prev => ({
                    ...prev,
                    steps: [...prev.steps, `Error: ${err.message}`]
                }));

                setError(err.message || 'Failed to load hotel details. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchHotelDetails();
    }, [destination, hotelId]);

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

                    <Link
                        href={`/hotels?destination=${destination}`}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 inline-block mb-6"
                    >
                        Return to Hotels
                    </Link>

                    {/* Debug Information */}
                    <div className="bg-white p-4 rounded-lg shadow">
                        <h2 className="text-xl font-bold mb-2">Debug Information</h2>
                        <div className="space-y-2">
                            <p><strong>Destination:</strong> {destination || 'None'}</p>
                            <p><strong>Hotel ID:</strong> {hotelId || 'None'}</p>
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

    if (!hotel) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div>No hotel data available</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-r from-blue-50 to-purple-50 p-4">
            <div className="max-w-6xl mx-auto">
                {/* Back to hotels link */}
                <div className="mb-4">
                    <Link
                        href={`/hotels?destination=${destination}`}
                        className="flex items-center text-blue-600 hover:underline"
                    >
                        <ChevronLeft className="h-4 w-4 mr-1" />
                        Back to all hotels in {destination}
                    </Link>
                </div>

                <div className="bg-white rounded-xl shadow-2xl overflow-hidden">
                    {/* Main photo with gallery */}
                    <div className="relative">
                        {/* Photo gallery */}
                        {hotel.photos && hotel.photos.length > 0 ? (
                            <div className="h-96">
                                <img
                                    src={hotel.photos && hotel.photos[activePhotoIndex] ?
                                        (hotel.photos[activePhotoIndex].url_max ||
                                            hotel.photos[activePhotoIndex].url ||
                                            hotel.photos[activePhotoIndex].url_1440 ||
                                            hotel.photo) :
                                        hotel.photo
                                    }
                                    alt={hotel.name}
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                        // If image fails to load, use a data URL fallback
                                        console.error('Image failed to load, using fallback');
                                        const target = e.target as HTMLImageElement;
                                        target.onerror = null; // Prevent infinite loop
                                        const hotelName = hotel.name || 'Hotel';
                                        target.src = `data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%22288%22%20height%3D%22225%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20288%20225%22%20preserveAspectRatio%3D%22none%22%3E%3Cdefs%3E%3Cstyle%20type%3D%22text%2Fcss%22%3E%23holder_18e5fca5cc8%20text%20%7B%20fill%3A%23eceeef%3Bfont-weight%3Abold%3Bfont-family%3AArial%2C%20Helvetica%2C%20Open%20Sans%2C%20sans-serif%2C%20monospace%3Bfont-size%3A14pt%20%7D%20%3C%2Fstyle%3E%3C%2Fdefs%3E%3Cg%20id%3D%22holder_18e5fca5cc8%22%3E%3Crect%20width%3D%22288%22%20height%3D%22225%22%20fill%3D%22%2355595c%22%3E%3C%2Frect%3E%3Cg%3E%3Ctext%20x%3D%2296.82500076293945%22%20y%3D%22118.74000034332275%22%3E${encodeURIComponent(hotelName)}%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E`;
                                        console.log(`Using SVG placeholder for hotel: ${hotelName}`);
                                    }}
                                />

                                {/* Photo navigation */}
                                {hotel.photos.length > 1 && (
                                    <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2">
                                        {hotel.photos.slice(0, 5).map((_, index) => (
                                            <button
                                                key={index}
                                                onClick={() => setActivePhotoIndex(index)}
                                                className={`w-3 h-3 rounded-full ${index === activePhotoIndex ? 'bg-white' : 'bg-white/50'}`}
                                                aria-label={`View photo ${index + 1}`}
                                            />
                                        ))}
                                        {hotel.photos.length > 5 && (
                                            <button
                                                onClick={() => setShowAllPhotos(true)}
                                                className="text-xs text-white bg-black/50 px-2 py-1 rounded-full"
                                            >
                                                +{hotel.photos.length - 5}
                                            </button>
                                        )}
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="h-96">
                                <img
                                    src={hotel.photo || `data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%22288%22%20height%3D%22225%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20288%20225%22%20preserveAspectRatio%3D%22none%22%3E%3Cdefs%3E%3Cstyle%20type%3D%22text%2Fcss%22%3E%23holder_18e5fca5cc8%20text%20%7B%20fill%3A%23eceeef%3Bfont-weight%3Abold%3Bfont-family%3AArial%2C%20Helvetica%2C%20Open%20Sans%2C%20sans-serif%2C%20monospace%3Bfont-size%3A14pt%20%7D%20%3C%2Fstyle%3E%3C%2Fdefs%3E%3Cg%20id%3D%22holder_18e5fca5cc8%22%3E%3Crect%20width%3D%22288%22%20height%3D%22225%22%20fill%3D%22%2355595c%22%3E%3C%2Frect%3E%3Cg%3E%3Ctext%20x%3D%2296.82500076293945%22%20y%3D%22118.74000034332275%22%3E${encodeURIComponent(hotel.name || 'Hotel')}%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E`}
                                    alt={hotel.name}
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                        // If image fails to load, use a data URL fallback
                                        console.error('Fallback image failed to load, using SVG fallback');
                                        const target = e.target as HTMLImageElement;
                                        target.onerror = null; // Prevent infinite loop
                                        const hotelName = hotel.name || 'Hotel';
                                        target.src = `data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%22288%22%20height%3D%22225%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20288%20225%22%20preserveAspectRatio%3D%22none%22%3E%3Cdefs%3E%3Cstyle%20type%3D%22text%2Fcss%22%3E%23holder_18e5fca5cc8%20text%20%7B%20fill%3A%23eceeef%3Bfont-weight%3Abold%3Bfont-family%3AArial%2C%20Helvetica%2C%20Open%20Sans%2C%20sans-serif%2C%20monospace%3Bfont-size%3A14pt%20%7D%20%3C%2Fstyle%3E%3C%2Fdefs%3E%3Cg%20id%3D%22holder_18e5fca5cc8%22%3E%3Crect%20width%3D%22288%22%20height%3D%22225%22%20fill%3D%22%2355595c%22%3E%3C%2Frect%3E%3Cg%3E%3Ctext%20x%3D%2296.82500076293945%22%20y%3D%22118.74000034332275%22%3E${encodeURIComponent(hotelName)}%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E`;
                                        console.log(`Using SVG placeholder for hotel: ${hotelName}`);
                                    }}
                                />
                            </div>
                        )}

                        {/* Hotel info overlay */}
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6">
                            <h1 className="text-4xl font-bold text-white mb-2">{hotel.name}</h1>
                            <div className="flex items-center space-x-4 text-white">
                                <div className="flex items-center">
                                    {[...Array(hotel.stars)].map((_, i) => (
                                        <Star
                                            key={i}
                                            className="h-5 w-5 fill-current text-yellow-400"
                                        />
                                    ))}
                                </div>
                                <span>|</span>
                                <div className="flex items-center space-x-1">
                                    <MapPin className="h-5 w-5" />
                                    <span>{hotel.location}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="p-6 space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-6">
                                {/* About section */}
                                <div>
                                    <h2 className="text-2xl font-semibold mb-4">About</h2>
                                    <p className="text-gray-600">{hotel.description}</p>
                                </div>

                                {/* Amenities section */}
                                <div>
                                    <div className="flex justify-between items-center mb-4">
                                        <h2 className="text-2xl font-semibold">Amenities</h2>
                                        {hotel.amenities.length > 8 && (
                                            <button
                                                onClick={() => setShowAllAmenities(!showAllAmenities)}
                                                className="text-blue-600 text-sm flex items-center"
                                            >
                                                {showAllAmenities ? (
                                                    <>
                                                        <span>Show less</span>
                                                        <ChevronUp className="h-4 w-4 ml-1" />
                                                    </>
                                                ) : (
                                                    <>
                                                        <span>Show all</span>
                                                        <ChevronDown className="h-4 w-4 ml-1" />
                                                    </>
                                                )}
                                            </button>
                                        )}
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        {(showAllAmenities ? hotel.amenities : hotel.amenities.slice(0, 8)).map((amenity, index) => (
                                            <div
                                                key={index}
                                                className="flex items-center space-x-2"
                                            >
                                                {amenityIcons[amenity] || <Star className="h-4 w-4" />}
                                                <span>{amenity}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Review details section */}
                                {hotel.review_details && (
                                    <div>
                                        <h2 className="text-2xl font-semibold mb-4">Ratings</h2>
                                        <div className="bg-gray-50 p-4 rounded-lg">
                                            <div className="flex items-center justify-between mb-4">
                                                <div className="text-3xl font-bold text-blue-600">
                                                    {hotel.review_details.score.toFixed(1)}
                                                </div>
                                                <div className="text-sm text-gray-600">
                                                    Based on {hotel.review_details.review_count} reviews
                                                </div>
                                            </div>

                                            {/* Score breakdown */}
                                            {hotel.review_details.score_breakdown && (
                                                <div className="space-y-2">
                                                    {Object.entries(hotel.review_details.score_breakdown).map(([category, score]) => (
                                                        <div key={category} className="flex items-center justify-between">
                                                            <span className="text-sm capitalize">{category.replace('_', ' ')}</span>
                                                            <div className="flex items-center">
                                                                <span className="text-sm font-medium mr-2">{Number(score).toFixed(1)}</span>
                                                                <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                                                                    <div
                                                                        className="h-full bg-blue-600 rounded-full"
                                                                        style={{ width: `${(Number(score) / 10) * 100}%` }}
                                                                    />
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="space-y-6">
                                {/* Booking section */}
                                <div className="bg-gray-50 p-6 rounded-lg">
                                    <div className="text-center">
                                        <div className="text-3xl font-bold text-blue-600">
                                            {hotel.price.current}
                                            <span className="text-sm text-gray-500">/night</span>
                                        </div>
                                        {hotel.price.original && (
                                            <div className="text-gray-500 line-through">
                                                {hotel.price.original}
                                            </div>
                                        )}
                                    </div>

                                    <button className="mt-6 w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2">
                                        <span>Book Now</span>
                                        <ChevronRight className="h-5 w-5" />
                                    </button>
                                </div>

                                {/* Debug Information */}
                                <div className="bg-white border border-gray-200 p-4 rounded-lg">
                                    <h2 className="text-lg font-semibold mb-2">Debug Information</h2>
                                    <div className="space-y-2 text-sm">
                                        <p><strong>Hotel ID:</strong> {hotel.id}</p>
                                        <p><strong>API Steps:</strong></p>
                                        <ul className="list-disc pl-5 text-xs">
                                            {debugInfo.steps.slice(0, 3).map((step, index) => (
                                                <li key={index}>{step}</li>
                                            ))}
                                            {debugInfo.steps.length > 3 && (
                                                <li>...and {debugInfo.steps.length - 3} more steps</li>
                                            )}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Reviews section */}
                        {hotel.reviews && hotel.reviews.length > 0 && (
                            <div>
                                <h2 className="text-2xl font-semibold mb-4">Guest Reviews</h2>
                                <div className="space-y-4">
                                    {hotel.reviews.map((review, index) => (
                                        <div key={index} className="bg-gray-50 p-4 rounded-lg">
                                            <div className="flex items-center justify-between mb-2">
                                                <div className="font-semibold">{review.name}</div>
                                                <div className="flex items-center">
                                                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                                                    <span className="ml-1">{review.rating}</span>
                                                </div>
                                            </div>
                                            <p className="text-gray-600">{review.comment}</p>
                                            {review.date && (
                                                <p className="text-xs text-gray-500 mt-2">{review.date}</p>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
