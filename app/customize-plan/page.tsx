"use client";

import { useState, useEffect, memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Compass, Calendar, Star, Clock, DollarSign, Sliders, Plus, Minus,
    Hotel, Plane, Train, Car, Bus, Utensils, Camera, Map, Briefcase,
    Check, MapPin, ChevronRight, ChevronLeft, Send, Globe, Home, Copy,
    MessageSquare
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Slider } from "@/components/ui/Slider";
import { Badge } from "@/components/ui/Badge";


// Custom destination input component (memoized to prevent unnecessary re-renders)
const CustomDestinationInput = memo(({
    value,
    onChange,
    onAdd
}: {
    value: string;
    onChange: (value: string) => void;
    onAdd: () => void;
}) => {
    return (
        <div className="flex gap-2">
            <input
                type="text"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder="Enter city or destination"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                onKeyDown={(e) => {
                    if (e.key === 'Enter' && value.trim() !== "") {
                        onAdd();
                    }
                }}
            />
            <Button
                onClick={onAdd}
                disabled={value.trim() === ""}
            >
                <Plus className="h-4 w-4 mr-1" /> Add
            </Button>
        </div>
    );
});

interface Activity {
    name: string;
    level: number;
    icon: React.ReactNode;
}

interface Destination {
    name: string;
    description: string;
    image?: string;
    popularActivities: string[];
}

interface Step {
    id: number;
    name: string;
    icon: React.ReactNode;
}

export default function CustomizePlanPage() {
    const [previousStep, setPreviousStep] = useState(1);

    // Available destinations - using useState to prevent recreation on every render
    const [availableDestinations, setAvailableDestinations] = useState<Destination[]>([
        {
            name: "Paris",
            description: "The City of Light",
            popularActivities: ["Eiffel Tower", "Louvre Museum", "Seine River Cruise"]
        },
        {
            name: "Tokyo",
            description: "The bustling capital of Japan",
            popularActivities: ["Tokyo Skytree", "Senso-ji Temple", "Shibuya Crossing"]
        },
        {
            name: "New York",
            description: "The Big Apple",
            popularActivities: ["Times Square", "Central Park", "Empire State Building"]
        },
        {
            name: "Bali",
            description: "Island paradise in Indonesia",
            popularActivities: ["Sacred Monkey Forest", "Ubud Art Market", "Tegallalang Rice Terraces"]
        },
        {
            name: "London",
            description: "Historic capital of England",
            popularActivities: ["Big Ben", "Tower of London", "Buckingham Palace"]
        }
    ]);

    const steps: Step[] = [
        { id: 1, name: "Destination", icon: <Globe className="h-4 w-4" /> },
        { id: 2, name: "Trip Basics", icon: <Sliders className="h-4 w-4" /> },
        { id: 3, name: "Accommodation", icon: <Hotel className="h-4 w-4" /> },
        { id: 4, name: "Transportation", icon: <Plane className="h-4 w-4" /> },
        { id: 5, name: "Activities", icon: <Camera className="h-4 w-4" /> },
        { id: 6, name: "Summary", icon: <Check className="h-4 w-4" /> },
    ];

    const [currentStep, setCurrentStep] = useState(1);
    const totalSteps = steps.length;

    // Form state
    const [destination, setDestination] = useState<string>("");
    const [duration, setDuration] = useState(7);
    const [budget, setBudget] = useState(3000);
    const [intensity, setIntensity] = useState(5);
    const [selectedDestination, setSelectedDestination] = useState<Destination | null>(null);
    const [accommodationType, setAccommodationType] = useState("hotel");
    const [hotelStars, setHotelStars] = useState(4);
    const [transportationTypes, setTransportationTypes] = useState<string[]>(["flight"]);
    const [flightClass, setFlightClass] = useState("economy");
    const [activities, setActivities] = useState<Activity[]>([
        { name: "Sightseeing", level: 3, icon: <Camera className="h-4 w-4" /> },
        { name: "Cultural", level: 4, icon: <Briefcase className="h-4 w-4" /> },
        { name: "Food & Dining", level: 5, icon: <Utensils className="h-4 w-4" /> },
        { name: "Adventure", level: 2, icon: <Map className="h-4 w-4" /> },
        { name: "Relaxation", level: 3, icon: <Star className="h-4 w-4" /> },
    ]);
    const [accommodationBudget, setAccommodationBudget] = useState(40);
    const [transportationBudget, setTransportationBudget] = useState(30);
    const [activitiesBudget, setActivitiesBudget] = useState(20);
    const [foodBudget, setFoodBudget] = useState(10);

    useEffect(() => {
        if (destination) {
            const found = availableDestinations.find(dest => dest.name === destination);
            // Only update if the selected destination is different to prevent infinite loops
            if (found && (!selectedDestination || selectedDestination.name !== found.name)) {
                setSelectedDestination(found);
            }
        }
    }, [destination, availableDestinations, selectedDestination]);

    const handleActivityLevelChange = (index: number, level: number) => {
        const newActivities = [...activities];
        newActivities[index].level = level;
        setActivities(newActivities);
    };

    // Function to toggle transportation types
    const handleTransportationToggle = (type: string) => {
        if (transportationTypes.includes(type)) {
            setTransportationTypes(transportationTypes.filter(t => t !== type));
        } else {
            setTransportationTypes([...transportationTypes, type]);
        }
    };

    const nextStep = () => {
        if (currentStep === 1 && !destination) {
            alert("Please select a destination");
            return;
        }
        if (currentStep < totalSteps) {
            setPreviousStep(currentStep);
            setCurrentStep(currentStep + 1);
        }
    };

    const prevStep = () => {
        if (currentStep > 1) {
            setPreviousStep(currentStep);
            setCurrentStep(currentStep - 1);
        }
    };

    const generateAITripPlan = () => {
        // We're using a simplified query now, but still collect activity data for the detailed summary
        const topActivities = activities
            .filter(a => a.level >= 4)
            .map(a => a.name)
            .slice(0, 3);

        // Create a detailed trip summary for localStorage (for reference if needed)
        const detailedSummary = {
            destination: destination,
            duration: duration,
            budget: budget,
            intensity: intensity,
            accommodation: {
                type: accommodationType,
                hotelStars: accommodationType === "hotel" ? hotelStars : null
            },
            transportation: {
                types: transportationTypes,
                flightClass: transportationTypes.includes("flight") ? flightClass : null
            },
            activities: topActivities,
            budgetAllocation: {
                accommodation: accommodationBudget,
                transportation: transportationBudget,
                activities: activitiesBudget,
                food: foodBudget
            }
        };

        // Create a simple query for the chatbot to minimize API issues
        const conciseQuery = `${duration} day trip to ${destination}.`;

        // Create a very simple one-line summary of the trip plan
        const oneLine = `${duration} days in ${destination}`;

        // Create a more detailed summary that matches the copyable text
        const detailedSummaryText = `${duration} day trip to ${destination} with a budget of ${budget} dollars. ${accommodationType} accommodation${accommodationType === "hotel" ? ` with ${hotelStars} star rating` : ""}. Transportation: ${transportationTypes.join(", ")}${transportationTypes.includes("flight") ? ` (${flightClass} class)` : ""}. Activities: ${activities.filter(a => a.level >= 3).map(a => a.name).join(", ")}. Trip intensity: ${intensity}/10.`;

        // Store both the detailed summary object and the text version
        localStorage.setItem('tripSummaryObject', JSON.stringify(detailedSummary));
        localStorage.setItem('tripSummaryText', detailedSummaryText);
        localStorage.setItem('tripQuery', conciseQuery);
        localStorage.setItem('tripOneLine', oneLine);
        localStorage.setItem('fromCustomizePlan', 'true');

        // Instead of automatically redirecting, just show a success message
        alert("Trip plan generated successfully! You can now copy the summary and go to the chat section to get AI recommendations.");
    };

    // State for custom destination
    const [customDestination, setCustomDestination] = useState("");

    // Function to add custom destination
    const addCustomDestination = () => {
        if (customDestination.trim() === "") return;

        // Create a new destination object
        const newDestination: Destination = {
            name: customDestination,
            description: "Custom destination",
            popularActivities: ["Explore", "Local cuisine", "Sightseeing"]
        };

        // Check if destination already exists
        const exists = availableDestinations.some(
            dest => dest.name.toLowerCase() === customDestination.toLowerCase()
        );

        if (!exists) {
            // Add to available destinations using the state setter
            setAvailableDestinations([...availableDestinations, newDestination]);
        }

        // Set as selected destination
        setDestination(customDestination);
        setCustomDestination("");

        // Automatically proceed to the next step after a short delay
        setTimeout(() => {
            nextStep();
        }, 300);
    };

    // Step components
    const Step1Destination = () => (
        <motion.div
            initial={{ opacity: 0, x: previousStep < currentStep ? 50 : -50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: previousStep < currentStep ? -50 : 50 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
        >
            <h2 className="text-2xl font-semibold mb-6 flex items-center">
                <Globe className="mr-2" /> Where do you want to go?
            </h2>

            {/* Custom destination input */}
            <div className="mb-6 p-4 border border-dashed border-gray-300 rounded-lg">
                <h3 className="text-lg font-medium mb-3">Add your own destination</h3>
                <CustomDestinationInput
                    value={customDestination}
                    onChange={setCustomDestination}
                    onAdd={addCustomDestination}
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {availableDestinations.map((dest) => (
                    <motion.div
                        key={dest.name}
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.98 }}
                        className={`p-4 border rounded-lg cursor-pointer transition-all ${destination === dest.name ? 'border-primary bg-primary/10' : 'border-gray-200 hover:border-primary/50'}`}
                        onClick={() => {
                            setDestination(dest.name);
                            // Automatically proceed to the next step after a short delay
                            setTimeout(() => nextStep(), 300);
                        }}
                    >
                        <div className="flex items-center">
                            <MapPin className="h-5 w-5 mr-2 text-primary" />
                            <h3 className="text-lg font-medium">{dest.name}</h3>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">{dest.description}</p>
                        <div className="mt-3 flex flex-wrap gap-1">
                            {dest.popularActivities.slice(0, 3).map(activity => (
                                <Badge key={activity} variant="outline" className="text-xs">
                                    {activity}
                                </Badge>
                            ))}
                        </div>
                    </motion.div>
                ))}
            </div>
        </motion.div>
    );

    const Step2TripBasics = () => (
        <motion.div
            initial={{ opacity: 0, x: previousStep < currentStep ? 50 : -50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: previousStep < currentStep ? -50 : 50 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
        >
            <h2 className="text-2xl font-semibold mb-6 flex items-center">
                <Sliders className="mr-2" /> Trip Basics
            </h2>

            <div className="space-y-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Duration (days)</label>
                    <div className="flex items-center">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setDuration((prev) => Math.max(1, prev - 1))}
                        >
                            <Minus className="h-4 w-4" />
                        </Button>
                        <span className="mx-4 text-xl font-semibold">{duration}</span>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setDuration((prev) => prev + 1)}
                        >
                            <Plus className="h-4 w-4" />
                        </Button>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Budget ($)</label>
                    <Slider
                        value={[budget]}
                        onValueChange={(value) => setBudget(value[0])}
                        max={10000}
                        step={100}
                        className="w-full"
                    />
                    <span className="text-xl font-semibold">${budget}</span>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Trip Intensity</label>
                    <Slider
                        value={[intensity]}
                        onValueChange={(value) => setIntensity(value[0])}
                        max={10}
                        step={1}
                        className="w-full"
                    />
                    <div className="flex justify-between text-sm mt-2">
                        <span>Relaxed</span>
                        <span>Balanced</span>
                        <span>Intense</span>
                    </div>
                </div>
            </div>
        </motion.div>
    );

    const Step3Accommodation = () => (
        <motion.div
            initial={{ opacity: 0, x: previousStep < currentStep ? 50 : -50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: previousStep < currentStep ? -50 : 50 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
        >
            <h2 className="text-2xl font-semibold mb-6 flex items-center">
                <Hotel className="mr-2" /> Accommodation Preferences
            </h2>

            <div className="space-y-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">Accommodation Type</label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        {["hotel", "hostel", "apartment"].map(type => (
                            <div
                                key={type}
                                className={`p-4 border rounded-lg cursor-pointer transition-all ${accommodationType === type ? 'border-primary bg-primary/10' : 'border-gray-200 hover:border-primary/50'}`}
                                onClick={() => setAccommodationType(type)}
                            >
                                <div className="flex items-center">
                                    {type === "hotel" ? <Hotel className="h-5 w-5 mr-2 text-primary" /> :
                                        type === "hostel" ? <Briefcase className="h-5 w-5 mr-2 text-primary" /> :
                                            <Home className="h-5 w-5 mr-2 text-primary" />}
                                    <span className="capitalize">{type}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {accommodationType === "hotel" && (
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Hotel Rating</label>
                        <div className="flex items-center">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setHotelStars(prev => Math.max(1, prev - 1))}
                            >
                                <Minus className="h-4 w-4" />
                            </Button>
                            <div className="mx-4 flex">
                                {[...Array(5)].map((_, i) => (
                                    <Star
                                        key={i}
                                        className={`h-5 w-5 ${i < hotelStars ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
                                    />
                                ))}
                            </div>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setHotelStars(prev => Math.min(5, prev + 1))}
                            >
                                <Plus className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </motion.div>
    );

    const Step4Transportation = () => (
        <motion.div
            initial={{ opacity: 0, x: previousStep < currentStep ? 50 : -50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: previousStep < currentStep ? -50 : 50 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
        >
            <h2 className="text-2xl font-semibold mb-6 flex items-center">
                <Plane className="mr-2" /> Transportation Options
            </h2>

            <div className="space-y-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">Transportation Types</label>
                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                        {[
                            { name: "flight", icon: <Plane className="h-5 w-5" /> },
                            { name: "train", icon: <Train className="h-5 w-5" /> },
                            { name: "car", icon: <Car className="h-5 w-5" /> },
                            { name: "bus", icon: <Bus className="h-5 w-5" /> },
                            { name: "walking", icon: <MapPin className="h-5 w-5" /> }
                        ].map(type => (
                            <div
                                key={type.name}
                                className={`p-3 border rounded-lg cursor-pointer transition-all ${transportationTypes.includes(type.name) ? 'border-primary bg-primary/10' : 'border-gray-200 hover:border-primary/50'}`}
                                onClick={() => handleTransportationToggle(type.name)}
                            >
                                <div className="flex flex-col items-center text-center">
                                    <div className="mb-1 text-primary">{type.icon}</div>
                                    <span className="text-sm capitalize">{type.name}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {transportationTypes.includes("flight") && (
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-3">Flight Class</label>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            {["economy", "business", "first"].map(cls => (
                                <div
                                    key={cls}
                                    className={`p-3 border rounded-lg cursor-pointer transition-all ${flightClass === cls ? 'border-primary bg-primary/10' : 'border-gray-200 hover:border-primary/50'}`}
                                    onClick={() => setFlightClass(cls)}
                                >
                                    <div className="flex items-center justify-center">
                                        <span className="capitalize">{cls} Class</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </motion.div>
    );

    const Step5Activities = () => (
        <motion.div
            initial={{ opacity: 0, x: previousStep < currentStep ? 50 : -50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: previousStep < currentStep ? -50 : 50 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
        >
            <h2 className="text-2xl font-semibold mb-6 flex items-center">
                <Camera className="mr-2" /> Activity Preferences
            </h2>

            <div className="space-y-6">
                {activities.map((activity, index) => (
                    <div key={activity.name} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center">
                                <div className="mr-2 text-primary">{activity.icon}</div>
                                <h3 className="font-medium">{activity.name}</h3>
                            </div>
                            <Badge variant={activity.level >= 3 ? "success" : "outline"}>
                                {activity.level < 3 ? "Low" : activity.level < 5 ? "Medium" : "High"}
                            </Badge>
                        </div>
                        <Slider
                            value={[activity.level]}
                            onValueChange={(value) => handleActivityLevelChange(index, value[0])}
                            max={5}
                            step={1}
                            className="w-full"
                        />
                        <div className="flex justify-between text-xs text-gray-500 mt-1">
                            <span>Not interested</span>
                            <span>Very interested</span>
                        </div>
                    </div>
                ))}
            </div>
        </motion.div>
    );

    const Step6Summary = () => (
        <motion.div
            initial={{ opacity: 0, x: previousStep < currentStep ? 50 : -50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: previousStep < currentStep ? -50 : 50 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
        >
            <h2 className="text-2xl font-semibold mb-6 flex items-center">
                <Check className="mr-2" /> Trip Summary
            </h2>

            <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="border rounded-lg p-4">
                        <h3 className="font-medium text-lg mb-3">Destination</h3>
                        <div className="flex items-center">
                            <MapPin className="h-5 w-5 mr-2 text-primary" />
                            <span>{destination}</span>
                        </div>
                    </div>

                    <div className="border rounded-lg p-4">
                        <h3 className="font-medium text-lg mb-3">Trip Basics</h3>
                        <div className="space-y-2">
                            <div className="flex items-center">
                                <Calendar className="h-5 w-5 mr-2 text-primary" />
                                <span>{duration} days</span>
                            </div>
                            <div className="flex items-center">
                                <DollarSign className="h-5 w-5 mr-2 text-primary" />
                                <span>${budget}</span>
                            </div>
                            <div className="flex items-center">
                                <Sliders className="h-5 w-5 mr-2 text-primary" />
                                <span>Intensity: {intensity}/10</span>
                            </div>
                        </div>
                    </div>

                    <div className="border rounded-lg p-4">
                        <h3 className="font-medium text-lg mb-3">Accommodation</h3>
                        <div className="space-y-2">
                            <div className="flex items-center">
                                <Hotel className="h-5 w-5 mr-2 text-primary" />
                                <span className="capitalize">{accommodationType}</span>
                            </div>
                            {accommodationType === "hotel" && (
                                <div className="flex items-center">
                                    <Star className="h-5 w-5 mr-2 text-primary" />
                                    <div className="flex">
                                        {[...Array(hotelStars)].map((_, i) => (
                                            <Star
                                                key={i}
                                                className="h-4 w-4 text-yellow-400 fill-yellow-400"
                                            />
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="border rounded-lg p-4">
                        <h3 className="font-medium text-lg mb-3">Transportation</h3>
                        <div className="space-y-2">
                            <div className="flex flex-wrap items-center gap-2">
                                {transportationTypes.map(type => (
                                    <Badge key={type} variant="outline" className="capitalize">
                                        {type}
                                    </Badge>
                                ))}
                            </div>
                            {transportationTypes.includes("flight") && (
                                <div className="flex items-center">
                                    <Plane className="h-5 w-5 mr-2 text-primary" />
                                    <span className="capitalize">{flightClass} Class</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="border rounded-lg p-4">
                    <h3 className="font-medium text-lg mb-3">Activity Preferences</h3>
                    <div className="flex flex-wrap gap-2">
                        {activities
                            .filter(a => a.level >= 3)
                            .map(activity => (
                                <Badge key={activity.name} variant="success">
                                    {activity.name}
                                </Badge>
                            ))}
                    </div>
                </div>

                <div className="border rounded-lg p-4">
                    <h3 className="font-medium text-lg mb-3">Budget Allocation</h3>
                    <div className="space-y-3">
                        <div>
                            <div className="flex justify-between text-sm mb-1">
                                <span>Accommodation</span>
                                <span>{accommodationBudget}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                                <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${accommodationBudget}%` }}></div>
                            </div>
                        </div>
                        <div>
                            <div className="flex justify-between text-sm mb-1">
                                <span>Transportation</span>
                                <span>{transportationBudget}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                                <div className="bg-green-500 h-2 rounded-full" style={{ width: `${transportationBudget}%` }}></div>
                            </div>
                        </div>
                        <div>
                            <div className="flex justify-between text-sm mb-1">
                                <span>Activities</span>
                                <span>{activitiesBudget}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                                <div className="bg-yellow-500 h-2 rounded-full" style={{ width: `${activitiesBudget}%` }}></div>
                            </div>
                        </div>
                        <div>
                            <div className="flex justify-between text-sm mb-1">
                                <span>Food</span>
                                <span>{foodBudget}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                                <div className="bg-red-500 h-2 rounded-full" style={{ width: `${foodBudget}%` }}></div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Copyable Summary Section */}
                <div className="border rounded-lg p-4 bg-gray-50">
                    <h3 className="font-medium text-lg mb-3 flex items-center">
                        <Copy className="h-5 w-5 mr-2 text-primary" /> Copyable Summary
                    </h3>
                    <p className="text-sm text-gray-600 mb-3">
                        Copy this summary to manually paste into the chatbot or share with others.
                    </p>
                    <div className="relative">
                        <textarea
                            readOnly
                            className="w-full h-24 p-3 border border-gray-300 rounded-lg bg-white text-sm font-mono"
                            value={`${duration} day trip to ${destination} with a budget of ${budget} dollars. ${accommodationType} accommodation${accommodationType === "hotel" ? ` with ${hotelStars} star rating` : ""}. Transportation: ${transportationTypes.join(", ")}${transportationTypes.includes("flight") ? ` (${flightClass} class)` : ""}. Activities: ${activities.filter(a => a.level >= 3).map(a => a.name).join(", ")}. Trip intensity: ${intensity}/10.`}
                        />
                        <Button
                            className="absolute top-2 right-2 p-2 h-8 w-8"
                            variant="outline"
                            size="sm"
                            onClick={() => {
                                const summary = `${duration} day trip to ${destination} with a budget of ${budget} dollars. ${accommodationType} accommodation${accommodationType === "hotel" ? ` with ${hotelStars} star rating` : ""}. Transportation: ${transportationTypes.join(", ")}${transportationTypes.includes("flight") ? ` (${flightClass} class)` : ""}. Activities: ${activities.filter(a => a.level >= 3).map(a => a.name).join(", ")}. Trip intensity: ${intensity}/10.`;
                                navigator.clipboard.writeText(summary);
                                // You could add a toast notification here
                                alert("Summary copied to clipboard!");
                            }}
                            title="Copy to clipboard"
                        >
                            <Copy className="h-4 w-4" />
                        </Button>
                    </div>
                    <div className="mt-4 flex justify-between">
                        <div className="text-xs text-gray-500">
                            This detailed summary can be pasted directly into the chatbot.
                        </div>
                        <div className="flex gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                className="flex items-center gap-1"
                                onClick={() => {
                                    const summary = `${duration} day trip to ${destination} with a budget of ${budget} dollars. ${accommodationType} accommodation${accommodationType === "hotel" ? ` with ${hotelStars} star rating` : ""}. Transportation: ${transportationTypes.join(", ")}${transportationTypes.includes("flight") ? ` (${flightClass} class)` : ""}. Activities: ${activities.filter(a => a.level >= 3).map(a => a.name).join(", ")}. Trip intensity: ${intensity}/10.`;
                                    navigator.clipboard.writeText(summary);
                                    // You could add a toast notification here
                                    alert("Summary copied to clipboard!");
                                }}
                            >
                                <Copy className="h-4 w-4" /> Copy Summary
                            </Button>
                            <Button
                                variant="default"
                                size="sm"
                                className="flex items-center gap-1 bg-blue-600 hover:bg-blue-700"
                                onClick={() => {
                                    // Store the summary in localStorage first
                                    const summary = `${duration} day trip to ${destination} with a budget of ${budget} dollars. ${accommodationType} accommodation${accommodationType === "hotel" ? ` with ${hotelStars} star rating` : ""}. Transportation: ${transportationTypes.join(", ")}${transportationTypes.includes("flight") ? ` (${flightClass} class)` : ""}. Activities: ${activities.filter(a => a.level >= 3).map(a => a.name).join(", ")}. Trip intensity: ${intensity}/10.`;
                                    localStorage.setItem('tripSummaryText', summary);

                                    // Navigate to the chatbot page without a query parameter
                                    window.location.href = '/chatbot';
                                }}
                            >
                                <MessageSquare className="h-4 w-4" /> Go to Chat
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );

    const renderStep = () => {
        switch (currentStep) {
            case 1: return <Step1Destination />;
            case 2: return <Step2TripBasics />;
            case 3: return <Step3Accommodation />;
            case 4: return <Step4Transportation />;
            case 5: return <Step5Activities />;
            case 6: return <Step6Summary />;
            default: return <Step1Destination />;
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-12">
            <div className="container mx-auto px-4 max-w-4xl">
                <header className="text-center mb-12">
                    <h1 className="text-3xl font-bold mb-2">Plan Your Perfect Trip</h1>
                    <p className="text-lg text-gray-600">Follow the steps to customize your travel experience</p>
                </header>

                <div className="mb-12">
                    <div className="flex items-center justify-between relative">
                        <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-200 -translate-y-1/2 z-0"></div>
                        <div
                            className="absolute top-1/2 left-0 h-1 bg-primary -translate-y-1/2 z-0 transition-all duration-300"
                            style={{ width: `${((currentStep - 1) / (totalSteps - 1)) * 100}%` }}
                        ></div>

                        {steps.map((step) => (
                            <div key={step.id} className="relative z-10">
                                <button
                                    onClick={() => setCurrentStep(step.id)}
                                    className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${currentStep >= step.id
                                        ? 'bg-primary text-white shadow-lg'
                                        : 'bg-white text-gray-400 border border-gray-300'
                                        } ${currentStep === step.id ? 'ring-2 ring-offset-2 ring-primary' : ''
                                        }`}
                                >
                                    {step.icon}
                                </button>
                                <span className={`absolute top-full left-1/2 -translate-x-1/2 mt-2 text-sm font-medium ${currentStep >= step.id ? 'text-primary font-semibold' : 'text-gray-500'
                                    }`}>
                                    {step.name}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
                    <AnimatePresence mode="wait">
                        {renderStep()}
                    </AnimatePresence>
                </div>

                <div className="flex justify-between">
                    <Button
                        variant="outline"
                        onClick={prevStep}
                        disabled={currentStep === 1}
                        className="flex items-center gap-2 px-6 py-3"
                    >
                        <ChevronLeft className="h-4 w-4" />
                        Previous
                    </Button>

                    {currentStep < totalSteps ? (
                        <Button
                            onClick={nextStep}
                            className="flex items-center gap-2 px-6 py-3 bg-primary hover:bg-primary/90"
                        >
                            Next
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                    ) : (
                        <div className="flex gap-2">
                            <Button
                                onClick={generateAITripPlan}
                                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700"
                            >
                                Generate Summary
                                <Send className="h-4 w-4" />
                            </Button>
                            <Button
                                onClick={() => {
                                    // First generate the summary
                                    generateAITripPlan();
                                    // Then navigate to the chatbot page
                                    window.location.href = '/chatbot';
                                }}
                                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700"
                            >
                                Go to Chat
                                <MessageSquare className="h-4 w-4" />
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}