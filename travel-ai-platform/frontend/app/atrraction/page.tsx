"use client";

// Force dynamic rendering
export const dynamic = 'force-dynamic';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, Clock, Star, DollarSign, Sun, Lightbulb } from 'lucide-react';
import { destinationsData } from '@/data/destinations';
import Image from 'next/image';
import axios from 'axios';
import { getAttractionImage } from '@/services/unsplash';

interface UnsplashPhoto {
    urls: {
        regular: string;
    };
    user: {
        name: string;
        links: {
            html: string;
        };
    };
}

interface UnsplashResponse {
    results: UnsplashPhoto[];
}

interface AttractionProps {
    name: string;
    type: string;
    duration: string;
    description: string;
    rating: number;
    price: string;
    bestTime: string;
    tips: string;
    cityName: string;
    imageUrl?: string;
    photographer?: string;
    photographerUrl?: string;
}

function AttractionsPageContent() {
    const searchParams = useSearchParams();
    const destination = searchParams.get("destination")?.toLowerCase() || "";
    const [currentAttractionIndex, setCurrentAttractionIndex] = useState<number>(0);
    const [isLoading, setIsLoading] = useState(true);
    const [attractions, setAttractions] = useState<AttractionProps[]>([]);
    const [destinationPhoto, setDestinationPhoto] = useState<{
        url: string;
        photographer: string;
        photographerUrl: string;
    }>({
        url: '/placeholder-image.jpg',
        photographer: '',
        photographerUrl: '',
    });

    useEffect(() => {
        const fetchDestinationPhoto = async () => {
            try {
                const response = await axios.get<UnsplashResponse>('https://api.unsplash.com/search/photos', {
                    params: {
                        query: destination,
                        client_id: process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY,
                        per_page: 1,
                        orientation: 'landscape'
                    }
                });

                if (response.data.results.length > 0) {
                    const photo = response.data.results[0];
                    setDestinationPhoto({
                        url: photo.urls.regular,
                        photographer: photo.user.name,
                        photographerUrl: photo.user.links.html
                    });
                }
            } catch (error) {
                console.error('Error fetching destination photo:', error);
            }
        };

        if (destination) {
            fetchDestinationPhoto();
        }
    }, [destination]);

    useEffect(() => {
        const loadAttractions = async () => {
            if (!destination || !destinationsData[destination as keyof typeof destinationsData]) {
                setIsLoading(false);
                return;
            }

            const rawAttractions = destinationsData[destination as keyof typeof destinationsData]?.attractions || [];
            const attractionsWithImages = await Promise.all(
                rawAttractions.map(async (attraction) => {
                    const imageData = await getAttractionImage(attraction.name, destination);
                    return {
                        ...attraction,
                        imageUrl: imageData.url,
                        photographer: imageData.photographer,
                        photographerUrl: imageData.photographerUrl,
                        cityName: destination
                    };
                })
            );

            setAttractions(attractionsWithImages);
            setIsLoading(false);
        };

        loadAttractions();
    }, [destination]);

    if (!destination || !destinationsData[destination as keyof typeof destinationsData]) {
        return (
            <div className="min-h-screen bg-gradient-to-r from-blue-50 to-purple-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-lg shadow-2xl p-8 max-w-md w-full text-center">
                    <p className="text-gray-800">Please select a valid destination.</p>
                </div>
            </div>
        );
    }

    if (isLoading || attractions.length === 0) {
        return (
            <div className="min-h-screen bg-gradient-to-r from-blue-50 to-purple-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    const currentAttraction = attractions[currentAttractionIndex];

    const nextAttraction = () => {
        setCurrentAttractionIndex((prev) =>
            prev === attractions.length - 1 ? 0 : prev + 1
        );
    };

    const previousAttraction = () => {
        setCurrentAttractionIndex((prev) =>
            prev === 0 ? attractions.length - 1 : prev - 1
        );
    };

    return (
        <div className="min-h-screen bg-gradient-to-r from-blue-50 to-purple-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-2xl p-8 max-w-6xl w-full">
                <div className="relative h-[300px] mb-8 rounded-lg overflow-hidden">
                    <Image
                        src={destinationPhoto.url}
                        alt={`${destination} cityscape`}
                        fill
                        style={{ objectFit: 'cover' }}
                        priority
                    />
                    {destinationPhoto.photographer && (
                        <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs p-2">
                            Photo by{' '}
                            <a
                                href={destinationPhoto.photographerUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="underline"
                            >
                                {destinationPhoto.photographer}
                            </a>{' '}
                            on Unsplash
                        </div>
                    )}
                </div>

                <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
                    Popular Attractions in {destination.charAt(0).toUpperCase() + destination.slice(1)}
                </h1>

                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentAttractionIndex}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="grid md:grid-cols-2 gap-8"
                    >
                        {/* Image Section */}
                        <div className="relative h-[400px] rounded-lg overflow-hidden">
                            {currentAttraction.imageUrl ? (
                                <>
                                    <Image
                                        src={currentAttraction.imageUrl}
                                        alt={currentAttraction.name}
                                        fill
                                        style={{ objectFit: 'cover' }}
                                        priority
                                    />
                                    {currentAttraction.photographer && (
                                        <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs p-2">
                                            Photo by{' '}
                                            <a
                                                href={currentAttraction.photographerUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="underline"
                                            >
                                                {currentAttraction.photographer}
                                            </a>{' '}
                                            on Unsplash
                                        </div>
                                    )}
                                </>
                            ) : (
                                <div className="bg-gray-200 h-full w-full flex items-center justify-center">
                                    <span className="text-gray-500">Image not available</span>
                                </div>
                            )}
                        </div>

                        {/* Info Section */}
                        <div className="space-y-6">
                            <div>
                                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                                    {currentAttraction.name}
                                </h2>
                                <div className="flex items-center space-x-2">
                                    <Star className="h-5 w-5 text-yellow-500" />
                                    <span className="text-gray-600">{currentAttraction.rating}</span>
                                </div>
                            </div>

                            <p className="text-gray-600">{currentAttraction.description}</p>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="flex items-center space-x-2">
                                    <Clock className="h-5 w-5 text-blue-500" />
                                    <span>{currentAttraction.duration}</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <DollarSign className="h-5 w-5 text-green-500" />
                                    <span>{currentAttraction.price}</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Sun className="h-5 w-5 text-orange-500" />
                                    <span>{currentAttraction.bestTime}</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Camera className="h-5 w-5 text-purple-500" />
                                    <span>{currentAttraction.type}</span>
                                </div>
                            </div>

                            <div className="bg-blue-50 p-4 rounded-lg">
                                <div className="flex items-center space-x-2 mb-2">
                                    <Lightbulb className="h-5 w-5 text-blue-600" />
                                    <span className="font-semibold">Pro Tip</span>
                                </div>
                                <p className="text-gray-700">{currentAttraction.tips}</p>
                            </div>

                            <div className="flex justify-between mt-6">
                                <button
                                    onClick={previousAttraction}
                                    className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
                                >
                                    Previous
                                </button>
                                <button
                                    onClick={nextAttraction}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                >
                                    Next Attraction
                                </button>
                            </div>

                            <div className="flex justify-center space-x-2 mt-4">
                                {attractions.map((_, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setCurrentAttractionIndex(index)}
                                        className={`w-2 h-2 rounded-full transition-colors ${index === currentAttractionIndex ? 'bg-blue-600' : 'bg-gray-300'
                                            }`}
                                    />
                                ))}
                            </div>
                        </div>
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
}

export default function AttractionsPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 flex items-center justify-center">
                <div className="text-white text-xl">Loading attractions...</div>
            </div>
        }>
            <AttractionsPageContent />
        </Suspense>
    );
}
