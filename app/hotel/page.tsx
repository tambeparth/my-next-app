"use client";

import { useSearchParams } from "next/navigation";
import { Hotel, Star, MapPin, ChevronRight } from "lucide-react";

export default function HotelPage() {
    const searchParams = useSearchParams();
    const destination = searchParams.get("destination");

    // Mock hotel data
    const hotel = {
        name: "Luxury Hotel",
        rating: "4.8 ★",
        location: "Central Location",
        photo: "/hotel.jpg",
        amenities: ["Free Wi-Fi", "Swimming Pool", "Spa", "Restaurant"],
        reviews: [
            { name: "John Doe", comment: "Amazing stay! Highly recommended." },
        ],
        price: "$200/night",
    };

    return (
        <div className="min-h-screen bg-gradient-to-r from-blue-50 to-purple-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-2xl p-8 max-w-4xl w-full">
                <h1 className="text-4xl font-bold text-gray-800 mb-2">
                    Welcome to {hotel.name} in {destination}
                </h1>
                <p className="text-gray-600">Your perfect stay awaits!</p>

                <div className="flex flex-col md:flex-row items-center space-y-6 md:space-y-0 md:space-x-6">
                    <img
                        src={hotel.photo}
                        alt={hotel.name}
                        className="w-full md:w-1/2 h-64 md:h-96 object-cover rounded-lg shadow-md"
                    />
                    <div className="w-full md:w-1/2 space-y-6">
                        <div className="flex items-center space-x-2">
                            <Hotel className="h-6 w-6 text-green-600" />
                            <h2 className="text-2xl font-bold text-gray-800">{hotel.name}</h2>
                            <div className="flex items-center space-x-1">
                                <Star className="h-4 w-4 text-yellow-500" />
                                <p className="text-sm text-gray-600">{hotel.rating}</p>
                            </div>
                        </div>

                        <div className="flex items-center space-x-2">
                            <MapPin className="h-5 w-5 text-blue-600" />
                            <p className="text-gray-600">{hotel.location}</p>
                        </div>

                        <div className="space-y-2">
                            <h3 className="text-lg font-semibold text-gray-800">Amenities</h3>
                            <div className="flex flex-wrap gap-2">
                                {hotel.amenities.map((amenity, index) => (
                                    <span
                                        key={index}
                                        className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                                    >
                                        {amenity}
                                    </span>
                                ))}
                            </div>
                        </div>

                        <div className="text-lg font-bold text-gray-800">
                            Starting at {hotel.price}
                        </div>

                        <button className="w-full md:w-auto bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 flex items-center justify-center space-x-2">
                            <span>Book Now</span>
                            <ChevronRight className="h-5 w-5" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}