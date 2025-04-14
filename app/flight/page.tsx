"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { PlaneTakeoff } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function FlightsPage() {
    const searchParams = useSearchParams();
    const destination = searchParams.get("destination");

    // Mock flight data with additional entries for variety
    const flightData = [
        {
            id: 1,
            airline: "Airline A",
            price: "$300",
            duration: "2h 30m",
            stops: "Non-stop",
            departure: "10:00 AM",
            arrival: "12:30 PM",
        },
        {
            id: 2,
            airline: "Airline B",
            price: "$350",
            duration: "3h 15m",
            stops: "1 Stop",
            departure: "1:00 PM",
            arrival: "4:15 PM",
        },
        {
            id: 3,
            airline: "Airline C",
            price: "$280",
            duration: "2h 45m",
            stops: "Non-stop",
            departure: "8:30 AM",
            arrival: "11:15 AM",
        },
    ];

    const [flights, setFlights] = useState(flightData.slice(0, 1)); // Start with one flight
    const [currentIndex, setCurrentIndex] = useState(1); // For dynamic loading

    // Dynamic flight loading effect
    useEffect(() => {
        if (currentIndex < flightData.length) {
            const interval = setInterval(() => {
                setFlights((prev) => [...prev, flightData[currentIndex]]);
                setCurrentIndex((prev) => prev + 1);
            }, 2000); // Add a new flight every 2 seconds
            return () => clearInterval(interval);
        }
    }, [currentIndex]);

    return (
        <div className="min-h-screen bg-gradient-to-r from-blue-50 to-purple-50 flex items-center justify-center p-4 relative overflow-hidden">
            {/* Subtle Background Effects */}
            <div className="fixed inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-100/20 to-transparent" style={{ backgroundAttachment: "fixed" }}></div>
            <div className="fixed inset-0 -z-20 bg-gradient-to-b from-purple-100/10 to-transparent animate-pulse" style={{ backgroundAttachment: "fixed" }}></div>

            <motion.div
                className="bg-white rounded-lg shadow-2xl p-8 max-w-4xl w-full"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
            >
                <motion.h1
                    className="text-3xl font-bold text-center mb-8 text-gray-800"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                >
                    Flights to {destination || "Your Destination"}
                </motion.h1>

                <div className="space-y-4">
                    <AnimatePresence>
                        {flights.map((flight) => (
                            <motion.div
                                key={flight.id}
                                className="bg-gray-100 p-6 rounded-lg cursor-pointer transition-all hover:bg-gray-200 hover:shadow-lg hover:-translate-y-1"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.5 }}
                                whileHover={{ scale: 1.02 }}
                            >
                                <div className="flex justify-between items-center">
                                    <div>
                                        <h3 className="text-lg font-semibold transition-colors hover:text-blue-600">{flight.airline}</h3>
                                        <p className="text-gray-600">{flight.duration}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-lg font-bold text-green-600">{flight.price}</p>
                                        <p className="text-gray-600">{flight.stops}</p>
                                    </div>
                                </div>
                                <motion.div
                                    className="mt-4 flex items-center space-x-2"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.3, duration: 0.5 }}
                                >
                                    <PlaneTakeoff className="h-4 w-4 text-blue-600 transition-transform hover:scale-125" />
                                    <p className="text-sm text-gray-600">
                                        Departure: {flight.departure} | Arrival: {flight.arrival}
                                    </p>
                                </motion.div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>

                {/* Dynamic Loading Indicator */}
                {currentIndex < flightData.length && (
                    <motion.p
                        className="text-center text-gray-500 mt-4"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5 }}
                    >
                        Loading more flights...
                    </motion.p>
                )}
            </motion.div>
        </div>
    );
}