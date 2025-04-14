"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { Camera } from "lucide-react";
// @ts-ignore
import React360Viewer from "react-360-view"; // Library for 360-degree rotation

// Define the type for an attraction
type Attraction = {
    name: string;
    type: string;
    duration: string;
    photo: string;
};

export default function AttractionsPage() {
    const searchParams = useSearchParams();
    const destination = searchParams.get("destination");
    const [fullScreenImage, setFullScreenImage] = useState<string | null>(null); // Track full-screen image

    // Hardcoded attractions data with your provided photos
    const attractions: Attraction[] = [
        {
            name: "Attraction 1",
            type: "Sightseeing",
            duration: "2 hours",
            photo: "/Paris.jpg", // Replace with your photo path
        },
        {
            name: "Attraction 2",
            type: "Sightseeing",
            duration: "2 hours",
            photo: "/Rom.jpg", // Replace with your photo path
        },
        {
            name: "Attraction 3",
            type: "Sightseeing",
            duration: "2 hours",
            photo: "/Tokyo.jpg", // Replace with your photo path
        },
        // Add more attractions as needed
    ];

    // Handle full-screen image display
    const handleImageClick = (photo: string) => {
        setFullScreenImage(photo);
    };

    // Close full-screen view
    const closeFullScreen = () => {
        setFullScreenImage(null);
    };

    return (
        <div className="min-h-screen bg-gradient-to-r from-blue-50 to-purple-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-2xl p-8 max-w-6xl w-full">
                <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
                    Popular Attractions in {destination}
                </h1>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {attractions.map((attraction, index) => (
                        <div
                            key={index}
                            className="bg-gray-100 p-6 rounded-lg cursor-pointer hover:bg-gray-200 transition-transform transform hover:scale-105"
                            onClick={() => handleImageClick(attraction.photo)} // Open full-screen on click
                        >
                            <div className="flex flex-col items-center space-y-4">
                                <img
                                    src={attraction.photo}
                                    alt={attraction.name}
                                    className="w-full h-64 object-cover rounded-lg"
                                />
                                <div className="space-y-2 text-center">
                                    <div className="flex items-center justify-center space-x-2">
                                        <Camera className="h-6 w-6 text-purple-600" />
                                        <p className="text-lg font-semibold">{attraction.name}</p>
                                    </div>
                                    <p className="text-gray-600">
                                        {attraction.type} - {attraction.duration}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Full-screen 360-degree viewer */}
            {fullScreenImage && (
                <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50">
                    <button
                        onClick={closeFullScreen}
                        className="absolute top-4 right-4 text-white text-2xl bg-gray-800 rounded-full p-2 hover:bg-gray-700"
                    >
                        &times;
                    </button>
                    <React360Viewer
                        imagesBaseUrl={fullScreenImage} // Base URL for 360-degree images
                        imagesCount={36} // Number of images for 360-degree rotation
                        imagesFiletype="jpg" // File type of the images
                        mouseDrag={true} // Enable mouse drag for rotation
                        width="80%" // Width of the viewer
                        height="80%" // Height of the viewer
                    />
                </div>
            )}
        </div>
    );
}