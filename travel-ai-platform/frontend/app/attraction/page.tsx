"use client";

// Force dynamic rendering
export const dynamic = 'force-dynamic';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';

interface UnsplashImage {
    id: string;
    urls: {
        small: string;
        regular: string;
    };
    user: {
        name: string;
        links: {
            html: string;
        };
    };
    description: string;
}

interface UnsplashResponse {
    results: UnsplashImage[];
}

function AttractionsPageContent() {
    const searchParams = useSearchParams();
    const destination = searchParams.get("destination")?.toLowerCase() || "";
    const [images, setImages] = useState<UnsplashImage[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [backgroundElements, setBackgroundElements] = useState<Array<{
        width: number;
        height: number;
        top: number;
        left: number;
        boxShadow: string;
        opacity: number;
    }>>([]);

    useEffect(() => {
        // Generate background elements on the client side
        setBackgroundElements(
            Array.from({ length: 20 }, () => ({
                width: Math.random() * 4,
                height: Math.random() * 4,
                top: Math.random() * 100,
                left: Math.random() * 100,
                boxShadow: `0 0 ${Math.random() * 10 + 5}px ${Math.random() * 3 + 1}px rgba(34, 211, 238, ${Math.random() * 0.5 + 0.1})`,
                opacity: Math.random() * 0.7 + 0.3
            }))
        );
    }, []); // Empty dependency array means this runs once on mount

    useEffect(() => {
        if (destination) {
            setPage(1);
            setImages([]);
            fetchImages(1, true);
        }
    }, [destination]);

    const fetchImages = async (pageNum: number, replace = false) => {
        setLoading(true);
        try {
            const response = await axios.get<UnsplashResponse>("https://api.unsplash.com/search/photos?page=1&query={destination}&client_id=XKEydipHTuEq932S-VH7b59iqr24Uel8BUryLRtITqI", {
                params: {
                    page: pageNum,
                    query: destination,
                    client_id: process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY,
                    per_page: 12,
                    orientation: 'landscape'
                }
            });

            setImages(prev =>
                replace ? response.data.results : [...prev, ...response.data.results]
            );
        } catch (error) {
            console.error("Error fetching images:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleLoadMore = () => {
        const nextPage = page + 1;
        setPage(nextPage);
        fetchImages(nextPage);
    };

    if (!destination) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center p-4">
                <div className="backdrop-blur-lg bg-gradient-to-r from-purple-900/50 to-blue-900/50 border-2 border-cyan-400/30 rounded-xl p-8 text-center text-white shadow-lg shadow-cyan-500/20">
                    <div className="text-4xl mb-4">⚠️</div>
                    <p className="text-xl font-light tracking-wider">Please select a valid destination</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black p-8 text-white overflow-hidden relative">
            {/* Futuristic background elements */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-purple-900/10 via-black to-blue-900/10"></div>
                {backgroundElements.length > 0 && (
                    <div className="absolute top-0 left-0 w-full h-full opacity-20">
                        {backgroundElements.map((element, i) => (
                            <div
                                key={i}
                                className="absolute rounded-full bg-cyan-400"
                                style={{
                                    width: `${element.width}px`,
                                    height: `${element.height}px`,
                                    top: `${element.top}%`,
                                    left: `${element.left}%`,
                                    boxShadow: element.boxShadow,
                                    opacity: element.opacity
                                }}
                            />
                        ))}
                    </div>
                )}
            </div>

            <div className="container mx-auto relative z-10">
                <motion.h1
                    className="text-6xl font-bold text-center mb-16 tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-400"
                    initial={{ opacity: 0, y: -30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    key={destination}
                >
                    <span className="inline-block px-2 py-1 border-b-4 border-cyan-400/50">
                        {destination.charAt(0).toUpperCase() + destination.slice(1)}
                    </span>
                </motion.h1>

                <div className="relative">
                    {loading && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/80 backdrop-blur-sm z-10 rounded-xl">
                            <div className="flex flex-col items-center">
                                <div className="relative w-20 h-20 mb-4">
                                    <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-cyan-400 border-r-purple-400 animate-spin"></div>
                                    <div className="absolute inset-2 rounded-full border-4 border-transparent border-b-purple-400 border-l-cyan-400 animate-spin-reverse"></div>
                                </div>
                                <p className="text-cyan-300 font-mono tracking-wider">LOADING DATA STREAM...</p>
                            </div>
                        </div>
                    )}

                    <AnimatePresence mode="wait">
                        <motion.div
                            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ staggerChildren: 0.1 }}
                            key={destination + page}
                        >
                            {images.map((image) => (
                                <motion.div
                                    key={image.id}
                                    className="rounded-xl overflow-hidden group relative"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5 }}
                                    whileHover={{ scale: 1.03 }}
                                >
                                    <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10"></div>
                                    <div className="relative h-80 overflow-hidden">
                                        <Image
                                            src={image.urls.regular}
                                            alt={image.description || `${destination} attraction`}
                                            fill
                                            className="object-cover transition-transform duration-700 group-hover:scale-110"
                                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-6">
                                            <div className="transform translate-y-8 group-hover:translate-y-0 transition-transform duration-500">
                                                <p className="text-cyan-300 font-mono text-xs tracking-widest mb-1">PHOTOGRAPHER</p>
                                                <a
                                                    href={image.user.links.html}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-white font-medium hover:text-cyan-300 transition-colors"
                                                >
                                                    {image.user.name}
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-400 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                </motion.div>
                            ))}
                        </motion.div>
                    </AnimatePresence>
                </div>

                {images.length > 0 && (
                    <motion.button
                        onClick={handleLoadMore}
                        className="mt-16 mx-auto block px-10 py-4 bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 text-white rounded-lg font-mono tracking-wider border border-cyan-400/30 shadow-lg transition-all duration-300 ease-in-out hover:shadow-cyan-400/30 relative overflow-hidden group"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        disabled={loading}
                    >
                        <span className="relative z-10">
                            {loading ? (
                                <span className="flex items-center justify-center">
                                    <span className="mr-2">PROCESSING</span>
                                    <span className="inline-block w-2 h-2 bg-white rounded-full animate-bounce mx-0.5"></span>
                                    <span className="inline-block w-2 h-2 bg-white rounded-full animate-bounce mx-0.5" style={{ animationDelay: "0.1s" }}></span>
                                    <span className="inline-block w-2 h-2 bg-white rounded-full animate-bounce mx-0.5" style={{ animationDelay: "0.2s" }}></span>
                                </span>
                            ) : (
                                "LOAD MORE DATA"
                            )}
                        </span>
                        <span className="absolute inset-0 bg-gradient-to-r from-cyan-400/30 to-purple-400/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></span>
                    </motion.button>
                )}
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