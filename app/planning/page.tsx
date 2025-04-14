"use client"; // Required for client-side interactivity

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaArrowRight, FaCheck, FaEdit, FaSpinner } from "react-icons/fa";

const PlanningPage = () => {
    const [step, setStep] = useState(1);
    const [preferences, setPreferences] = useState({
        travelStyle: "",
        interests: "",
        budget: "",
        requirements: "",
    });
    const [itinerary, setItinerary] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isBooked, setIsBooked] = useState(false);

    const nextStep = () => setStep((prev) => Math.min(prev + 1, 3));
    const prevStep = () => setStep((prev) => Math.max(prev - 1, 1));

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setPreferences((prev) => ({ ...prev, [name]: value }));
    };

    const generateItinerary = () => {
        setIsLoading(true);
        // Simulate AI itinerary generation
        setTimeout(() => {
            setItinerary([
                "Day 1: Arrival and city tour",
                "Day 2: Adventure activities",
                "Day 3: Relaxation and spa",
                "Day 4: Departure",
            ]);
            setIsLoading(false);
        }, 2000);
    };

    const handleBook = () => {
        setIsBooked(true);
        // Simulate booking process
        setTimeout(() => {
            alert("Booking confirmed! Thank you for choosing us.");
        }, 1000);
    };

    return (
        <div className="min-h-screen bg-gradient-to-r from-blue-50 to-purple-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-2xl p-8 max-w-4xl w-full">
                <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
                    Plan Your Perfect Trip
                </h1>

                {/* Progress Bar */}
                <div className="w-full bg-gray-200 rounded-full h-2 mb-8">
                    <motion.div
                        className="bg-blue-500 h-2 rounded-full"
                        initial={{ width: "0%" }}
                        animate={{ width: `${(step / 3) * 100}%` }}
                        transition={{ duration: 0.5 }}
                    />
                </div>

                {/* Step Indicator */}
                <div className="flex justify-between mb-8">
                    {[1, 2, 3].map((s) => (
                        <div
                            key={s}
                            className={`flex items-center justify-center w-10 h-10 rounded-full ${step >= s ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-600"
                                }`}
                        >
                            {s}
                        </div>
                    ))}
                </div>

                {/* Step Content */}
                <AnimatePresence mode="wait">
                    <motion.div
                        key={step}
                        initial={{ opacity: 0, x: step > 1 ? 50 : -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: step > 1 ? -50 : 50 }}
                        transition={{ duration: 0.3 }}
                        className="space-y-6"
                    >
                        {step === 1 && (
                            <Step1 preferences={preferences} handleInputChange={handleInputChange} />
                        )}
                        {step === 2 && (
                            <Step2
                                isLoading={isLoading}
                                itinerary={itinerary}
                                generateItinerary={generateItinerary}
                            />
                        )}
                        {step === 3 && (
                            <Step3 itinerary={itinerary} isBooked={isBooked} handleBook={handleBook} />
                        )}
                    </motion.div>
                </AnimatePresence>

                {/* Navigation Buttons */}
                <div className="flex justify-between mt-8">
                    <button
                        onClick={prevStep}
                        disabled={step === 1}
                        className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg disabled:opacity-50"
                    >
                        Previous
                    </button>
                    <button
                        onClick={nextStep}
                        disabled={step === 3}
                        className="bg-blue-500 text-white px-6 py-2 rounded-lg flex items-center disabled:opacity-50"
                    >
                        Next <FaArrowRight className="ml-2" />
                    </button>
                </div>
            </div>
        </div>
    );
};

// Step 1: Share Your Preferences
const Step1 = ({
    preferences,
    handleInputChange,
}: {
    preferences: any;
    handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}) => (
    <div>
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">Share Your Preferences</h2>
        <p className="text-gray-600 mb-6">
            Tell us about your travel style, interests, budget, and any specific requirements you have.
        </p>
        <div className="space-y-4">
            <input
                type="text"
                name="travelStyle"
                value={preferences.travelStyle}
                onChange={handleInputChange}
                placeholder="Travel Style (e.g., Adventure, Relaxation)"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
                type="text"
                name="interests"
                value={preferences.interests}
                onChange={handleInputChange}
                placeholder="Interests (e.g., Hiking, Museums)"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
                type="text"
                name="budget"
                value={preferences.budget}
                onChange={handleInputChange}
                placeholder="Budget (e.g., $1000)"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <textarea
                name="requirements"
                value={preferences.requirements}
                onChange={handleInputChange}
                placeholder="Specific Requirements"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={3}
            />
        </div>
    </div>
);

// Step 2: AI Creates Your Itinerary
const Step2 = ({
    isLoading,
    itinerary,
    generateItinerary,
}: {
    isLoading: boolean;
    itinerary: string[];
    generateItinerary: () => void;
}) => (
    <div>
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">AI Creates Your Itinerary</h2>
        <p className="text-gray-600 mb-6">
            Our AI analyzes thousands of options to create a personalized travel plan just for you.
        </p>
        <div className="bg-gray-100 p-6 rounded-lg">
            {isLoading ? (
                <div className="flex items-center justify-center">
                    <FaSpinner className="animate-spin text-blue-500 text-2xl" />
                    <p className="ml-2 text-gray-700">Generating your itinerary...</p>
                </div>
            ) : itinerary.length > 0 ? (
                <ul className="space-y-2">
                    {itinerary.map((item, index) => (
                        <li key={index} className="text-gray-700">
                            {item}
                        </li>
                    ))}
                </ul>
            ) : (
                <button
                    onClick={generateItinerary}
                    className="bg-blue-500 text-white px-6 py-2 rounded-lg"
                >
                    Generate Itinerary
                </button>
            )}
        </div>
    </div>
);

// Step 3: Customize & Book
const Step3 = ({
    itinerary,
    isBooked,
    handleBook,
}: {
    itinerary: string[];
    isBooked: boolean;
    handleBook: () => void;
}) => (
    <div>
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">Customize & Book</h2>
        <p className="text-gray-600 mb-6">
            Review your plan, make any adjustments, and book all your reservations in one place.
        </p>
        <div className="bg-gray-100 p-6 rounded-lg">
            {itinerary.length > 0 ? (
                <>
                    <ul className="space-y-2 mb-6">
                        {itinerary.map((item, index) => (
                            <li key={index} className="text-gray-700">
                                {item}
                            </li>
                        ))}
                    </ul>
                    <button
                        onClick={handleBook}
                        disabled={isBooked}
                        className="bg-blue-500 text-white px-6 py-2 rounded-lg disabled:opacity-50"
                    >
                        {isBooked ? "Booked!" : "Confirm & Book"}
                    </button>
                </>
            ) : (
                <p className="text-gray-700">No itinerary generated yet. Please go back to Step 2.</p>
            )}
        </div>
    </div>
);

export default PlanningPage;