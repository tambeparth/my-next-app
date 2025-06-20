"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
// import { useRouter } from "next/navigation"; // Uncomment when needed

// Type definitions for API responses
interface HotelBasicInfo {
    hotel_id: string;
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
}

interface HotelSearchParams {
    destId: string;
    checkIn: string;
    checkOut: string;
    adults: number;
    rooms: number;
}
import {
    Star,
    MapPin,
    ChevronRight,
    Loader,
    Wifi,
    Waves,
    Utensils,
    Heart,
    Users,
    ChevronLeft,
    ChevronDown,
    ChevronUp,
    // Unused icons but kept for future use
    // Calendar,
    // Check,
    // X,
    // Image,
} from "lucide-react";
import Link from "next/link";

import { searchDestination, searchHotels as apiSearchHotels, getHotelPhotos as apiGetHotelPhotos, getStaticHotelPhotos } from "../../utils/api";

// API functions
async function getDestinationId(destination: string): Promise<string | undefined> {
    try {
        console.log('Searching for destination ID for:', destination);
        try {
            // Try to use the real API
            const destResponse = await searchDestination(destination) as any;
            console.log('API destination response:', destResponse);

            if (destResponse?.data && Array.isArray(destResponse.data) && destResponse.data.length > 0) {
                return destResponse.data[0].dest_id;
            }

            // Fallback to mock if API response doesn't have what we need
            return 'dest-123456';
        } catch (apiError) {
            console.error('API destination search failed, using mock data:', apiError);
            return 'dest-123456';
        }
    } catch (error) {
        console.error('Error fetching destination ID:', error);
        return undefined;
    }
}

async function searchHotels(params: HotelSearchParams): Promise<HotelBasicInfo[]> {
    try {
        console.log('Searching for hotels with params:', params);
        try {
            // Try to use the real API
            const hotelsResponse = await apiSearchHotels({
                dest_id: params.destId,
                search_type: 'CITY',
                adults: params.adults.toString(),
                room_qty: params.rooms.toString(),
                page_number: '1',
                sort_by: 'popularity'
            }) as any;
            console.log('API hotels response:', hotelsResponse);

            if (hotelsResponse?.data && Array.isArray(hotelsResponse.data) && hotelsResponse.data.length > 0) {
                return hotelsResponse.data;
            }

            // Fallback to mock if API response doesn't have what we need
            return [
                {
                    hotel_id: 'mock-1',
                    hotel_name: 'Grand Hotel ' + params.destId,
                    address: 'Main Street, City Center',
                    review_score: 8.5,
                    max_photo_url: 'https://cf.bstatic.com/xdata/images/hotel/max1024x768/405276856.jpg?k=4a4a8e3ba5a0d0d27bd5e6c9622dbc8e9a8001c66dc9f9f72d5fd3a6a8e2a71a&o=&hp=1',
                    min_total_price: 150,
                    facilities: ['Free Wi-Fi', 'Swimming Pool', 'Restaurant', 'Spa'],
                    distance_to_cc: '0.5 km',
                    class: 4
                }
            ];
        } catch (apiError) {
            console.error('API hotel search failed, using mock data:', apiError);
            return [
                {
                    hotel_id: 'mock-1',
                    hotel_name: 'Grand Hotel ' + params.destId,
                    address: 'Main Street, City Center',
                    review_score: 8.5,
                    max_photo_url: 'https://cf.bstatic.com/xdata/images/hotel/max1024x768/405276856.jpg?k=4a4a8e3ba5a0d0d27bd5e6c9622dbc8e9a8001c66dc9f9f72d5fd3a6a8e2a71a&o=&hp=1',
                    min_total_price: 150,
                    facilities: ['Free Wi-Fi', 'Swimming Pool', 'Restaurant', 'Spa'],
                    distance_to_cc: '0.5 km',
                    class: 4
                }
            ];
        }
    } catch (error) {
        console.error('Error searching hotels:', error);
        return [];
    }
}

async function getHotelPhotos(hotelId: string): Promise<Array<{ url_max: string; url_1440: string }>> {
    try {
        console.log('Fetching hotel photos for:', hotelId);
        try {
            // Try to use the real API
            const photosResponse = await apiGetHotelPhotos(hotelId) as any;
            console.log('API photos response:', photosResponse);

            if (photosResponse?.data && Array.isArray(photosResponse.data) && photosResponse.data.length > 0) {
                return photosResponse.data;
            }

            // Fallback to static photos if API response doesn't have what we need
            return getStaticHotelPhotos();
        } catch (apiError) {
            console.error('API hotel photos failed, using static photos:', apiError);
            return getStaticHotelPhotos();
        }
    } catch (error) {
        console.error('Error fetching hotel photos:', error);
        return [];
    }
}

async function getHotelReviews(hotelId: string): Promise<HotelData['review_details']> {
    try {
        // Mock implementation for now
        console.log('Mocking hotel reviews for:', hotelId);
        return {
            score: 8.5,
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
    } catch (error) {
        console.error('Error fetching hotel reviews:', error);
        return undefined;
    }
}

async function getRoomAvailability(hotelId: string): Promise<HotelData['room_availability']> {
    try {
        // Mock implementation for now
        console.log('Mocking room availability for:', hotelId);
        return {
            available: true,
            rooms: [
                {
                    name: 'Deluxe Room',
                    price: 150,
                    description: 'Spacious room with city view',
                    amenities: ['Free Wi-Fi', 'TV', 'Mini-bar'],
                    max_occupancy: 2,
                    available_rooms: 5
                },
                {
                    name: 'Suite',
                    price: 250,
                    description: 'Luxury suite with separate living area',
                    amenities: ['Free Wi-Fi', 'TV', 'Mini-bar', 'Jacuzzi'],
                    max_occupancy: 4,
                    available_rooms: 2
                }
            ]
        };
    } catch (error) {
        console.error('Error fetching room availability:', error);
        return undefined;
    }
}

interface HotelData {
    id?: string;
    name: string;
    rating: number;
    location: string;
    photo: string;
    photos?: Array<{
        url_max: string;
        url_1440: string;
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
    // const router = useRouter(); // Uncomment when needed
    const destination = searchParams?.get("destination") || "";
    const hotelId = searchParams?.get("hotel_id");
    const [hotel, setHotel] = useState<HotelData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [activePhotoIndex, setActivePhotoIndex] = useState(0);
    // const [showAllPhotos, setShowAllPhotos] = useState(false); // Uncomment when implementing photo gallery
    const [showAllAmenities, setShowAllAmenities] = useState(false);
    const [showAllRooms, setShowAllRooms] = useState(false);

    useEffect(() => {
        const fetchHotelData = async () => {
            if (!destination) return;

            try {
                setLoading(true);
                setError('');

                // Step 1: Get destination ID
                console.log('Fetching destination ID for:', destination);
                const destId = await getDestinationId(destination);

                if (!destId) {
                    throw new Error('Could not find destination ID');
                }

                // Step 2: Search for hotels
                const hotels = await searchHotels({
                    destId,
                    checkIn: "2024-09-27",
                    checkOut: "2024-09-28",
                    adults: 2,
                    rooms: 1,
                });

                if (!hotels || hotels.length === 0) {
                    throw new Error('No hotels found for this destination');
                }

                // Use the specified hotel_id from URL or default to the first hotel
                const urlHotelId = hotelId; // Rename to avoid conflict
                const targetHotelIndex: number = urlHotelId
                    ? hotels.findIndex((h: HotelBasicInfo) => h.hotel_id === urlHotelId)
                    : 0;

                const hotelData: HotelBasicInfo = hotels[targetHotelIndex >= 0 ? targetHotelIndex : 0];
                const selectedHotelId: string = hotelData.hotel_id || '';

                // Step 3: Fetch additional hotel data if we have an ID
                let photos: Array<{ url_max: string; url_1440: string }> = [];
                let reviewDetails: HotelData['review_details'] = undefined;
                let roomAvailability: HotelData['room_availability'] = undefined;

                if (selectedHotelId) {
                    try {
                        // Get photos
                        const photosData = await getHotelPhotos(selectedHotelId);
                        photos = photosData || [];

                        // Get reviews
                        const reviewsData = await getHotelReviews(selectedHotelId);
                        reviewDetails = reviewsData || undefined;

                        // Get room availability
                        const availabilityData = await getRoomAvailability(selectedHotelId);
                        roomAvailability = availabilityData || undefined;
                    } catch (detailsErr) {
                        console.error('Error fetching additional hotel details:', detailsErr);
                        // Continue with basic hotel data even if additional details fail
                    }
                }

                // Log the hotel data for debugging
                console.log('Hotel data:', hotelData);
                console.log('Hotel data keys:', Object.keys(hotelData));

                // Extract hotel properties with fallbacks
                // Use type assertion to avoid TypeScript errors with optional properties
                const hotelData_any = hotelData as any;

                const processedHotelId = selectedHotelId || hotelData.hotel_id || hotelData_any.id || 'hotel-1';
                const hotelName = hotelData.hotel_name || hotelData_any.name || `Hotel in ${destination}`;
                const hotelRating = hotelData.review_score || hotelData_any.rating || 4.5;
                const hotelLocation = hotelData.address || hotelData_any.location || destination;
                const hotelPhoto = hotelData.max_photo_url || hotelData_any.photo || hotelData_any.main_photo_url || `https://source.unsplash.com/random/800x600/?hotel,${destination}`;
                const hotelFacilities = hotelData.facilities || hotelData_any.amenities || [
                    "Free Wi-Fi",
                    "Swimming Pool",
                    "Restaurant",
                    "Spa",
                ];
                const hotelReviews = hotelData.reviews || [];
                const hotelPrice = hotelData.min_total_price || hotelData_any.price || 200;
                const hotelOriginalPrice = hotelData.original_price;
                const hotelDescription = hotelData.hotel_description || hotelData_any.description || "A comfortable hotel with modern amenities.";
                const hotelDistanceToCenter = hotelData.distance_to_cc || hotelData_any.distance_to_center;
                const hotelStars = hotelData.class || hotelData_any.stars || 4;

                setHotel({
                    id: processedHotelId,
                    name: hotelName,
                    rating: hotelRating,
                    location: hotelLocation,
                    photo: hotelPhoto,
                    photos: photos.slice(0, 10),
                    amenities: hotelFacilities,
                    reviews: hotelReviews,
                    review_details: reviewDetails,
                    price: {
                        current: `$${hotelPrice}`,
                        original: hotelOriginalPrice
                            ? `$${hotelOriginalPrice}`
                            : undefined,
                    },
                    description: hotelDescription || "",
                    distance_to_center: hotelDistanceToCenter,
                    stars: hotelStars,
                    room_availability: roomAvailability,
                });
            } catch (err: any) {
                console.error("Error fetching hotel data:", err);
                setError(err.message || "Failed to load hotel data. Please try again later.");
            } finally {
                setLoading(false);
            }
        };

        fetchHotelData();
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
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-red-600">{error}</div>
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
                                    src={hotel.photos[activePhotoIndex]?.url_max || hotel.photo}
                                    alt={hotel.name}
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                        // If image fails to load, use a fallback
                                        const target = e.target as HTMLImageElement;
                                        target.onerror = null; // Prevent infinite loop
                                        target.src = 'https://cf.bstatic.com/xdata/images/hotel/max1024x768/405276856.jpg?k=4a4a8e3ba5a0d0d27bd5e6c9622dbc8e9a8001c66dc9f9f72d5fd3a6a8e2a71a&o=&hp=1';
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
                                                // Will implement photo gallery modal in future
                                                // onClick={() => setShowAllPhotos(true)}
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
                                    src={hotel.photo}
                                    alt={hotel.name}
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                        // If image fails to load, use a fallback
                                        const target = e.target as HTMLImageElement;
                                        target.onerror = null; // Prevent infinite loop
                                        target.src = 'https://cf.bstatic.com/xdata/images/hotel/max1024x768/405276856.jpg?k=4a4a8e3ba5a0d0d27bd5e6c9622dbc8e9a8001c66dc9f9f72d5fd3a6a8e2a71a&o=&hp=1';
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

                                {/* Room availability section */}
                                {hotel.room_availability && hotel.room_availability.rooms && hotel.room_availability.rooms.length > 0 && (
                                    <div>
                                        <div className="flex justify-between items-center mb-4">
                                            <h2 className="text-2xl font-semibold">Available Rooms</h2>
                                            {hotel.room_availability.rooms.length > 3 && (
                                                <button
                                                    onClick={() => setShowAllRooms(!showAllRooms)}
                                                    className="text-blue-600 text-sm flex items-center"
                                                >
                                                    {showAllRooms ? (
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
                                        <div className="space-y-4">
                                            {(showAllRooms ? hotel.room_availability.rooms : hotel.room_availability.rooms.slice(0, 3)).map((room, index) => (
                                                <div key={index} className="border rounded-lg p-4">
                                                    <div className="flex justify-between mb-2">
                                                        <h3 className="font-semibold">{room.name}</h3>
                                                        <div className="text-blue-600 font-bold">${room.price}</div>
                                                    </div>
                                                    <p className="text-sm text-gray-600 mb-2">{room.description}</p>
                                                    <div className="flex items-center text-sm text-gray-600 mb-2">
                                                        <Users className="h-4 w-4 mr-1" />
                                                        <span>Max {room.max_occupancy} guests</span>
                                                    </div>
                                                    {room.available_rooms > 0 ? (
                                                        <div className="text-green-600 text-sm">
                                                            {room.available_rooms} rooms available
                                                        </div>
                                                    ) : (
                                                        <div className="text-red-600 text-sm">Sold out</div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
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
