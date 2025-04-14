"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Compass, Calendar, Star, Clock, DollarSign, Sliders, Plus, Minus } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Slider } from "@/components/ui/Slider";
import { Badge } from "@/components/ui/Badge";
import { useRouter } from "next/navigation"; // Import useRouter

interface Activity {
    name: string;
    level: number;
}

export default function CustomizePlanPage() {
    const [destination, setDestination] = useState("Paris");
    const [duration, setDuration] = useState(7);
    const [budget, setBudget] = useState(3000);
    const [intensity, setIntensity] = useState(5);
    const [activities, setActivities] = useState<Activity[]>([
        { name: "Sightseeing", level: 3 },
        { name: "Cultural", level: 4 },
        { name: "Food & Dining", level: 5 },
        { name: "Adventure", level: 2 },
        { name: "Relaxation", level: 3 },
    ]);

    const handleActivityLevelChange = (index: number, level: number) => {
        const newActivities = [...activities];
        newActivities[index].level = level;
        setActivities(newActivities);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-12">
            <div className="container mx-auto px-4">
                {/* Header */}
                <header className="text-center mb-12">
                    <h1 className="text-4xl font-bold mb-4">Customize Your {destination} Adventure</h1>
                    <p className="text-xl text-gray-600">Fine-tune your perfect trip with our AI-powered planner</p>
                </header>

                {/* Trip Parameters and Activity Preferences */}
                <div className="grid md:grid-cols-2 gap-8">
                    {/* Trip Parameters Section */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="bg-white rounded-xl shadow-lg p-6"
                    >
                        <h2 className="text-2xl font-semibold mb-6 flex items-center">
                            <Sliders className="mr-2" /> Trip Parameters
                        </h2>

                        <div className="space-y-6">
                            {/* Duration */}
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

                            {/* Budget */}
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

                            {/* Intensity */}
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

                    {/* Activity Preferences Section */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="bg-white rounded-xl shadow-xl p-6 hover:shadow-2xl transition-shadow duration-300"
                    >
                        {/* Heading with Icon Animation */}
                        <motion.h2
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.4 }}
                            className="text-2xl font-semibold mb-6 flex items-center"
                        >
                            <motion.span
                                animate={{ rotate: [0, 15, -15, 0] }}
                                transition={{ duration: 0.6, repeat: Infinity, repeatDelay: 3 }}
                            >
                                <Star className="mr-2 text-yellow-500" />
                            </motion.span>
                            Activity Preferences
                        </motion.h2>

                        <div className="space-y-6">
                            {activities.map((activity, index) => (
                                <motion.div
                                    key={activity.name}
                                    className="flex flex-col gap-3 p-4 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors duration-300"
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.4, delay: index * 0.1 }}
                                >
                                    {/* Activity Name */}
                                    <span className="text-lg font-medium">{activity.name}</span>

                                    {/* Star Rating System */}
                                    <div className="flex items-center gap-2">
                                        {[1, 2, 3, 4, 5].map((level) => (
                                            <motion.div
                                                key={level}
                                                className={`w-8 h-8 rounded-full cursor-pointer transition-all duration-300 ${level <= activity.level ? "bg-primary scale-110" : "bg-gray-300"
                                                    }`}
                                                whileHover={{ scale: 1.3 }}
                                                whileTap={{ scale: 0.9 }}
                                                onClick={() => handleActivityLevelChange(index, level)}
                                            >
                                                {/* Star Icon */}
                                                <motion.span
                                                    className="flex items-center justify-center w-full h-full"
                                                    animate={{ rotate: level <= activity.level ? [0, 15, -15, 0] : 0 }}
                                                    transition={{ duration: 0.6 }}
                                                >
                                                    <Star
                                                        className={`w-5 h-5 ${level <= activity.level ? "text-yellow-400" : "text-gray-400"
                                                            }`}
                                                    />
                                                </motion.span>
                                            </motion.div>
                                        ))}
                                    </div>

                                    {/* Level Description */}
                                    <motion.div
                                        className="text-sm text-gray-600"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: 0.2 }}
                                    >
                                        {activity.level === 1 && "Not Interested"}
                                        {activity.level === 2 && "Slightly Interested"}
                                        {activity.level === 3 && "Moderately Interested"}
                                        {activity.level === 4 && "Very Interested"}
                                        {activity.level === 5 && "Extremely Interested"}
                                    </motion.div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                </div>

                {/* Trip Overview Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    className="mt-12 bg-white rounded-xl shadow-lg p-6"
                >
                    <h2 className="text-2xl font-semibold mb-6 flex items-center">
                        <Compass className="mr-2" /> Your Customized Trip Overview
                    </h2>

                    <div className="grid md:grid-cols-3 gap-6">
                        {/* Duration */}
                        <div className="flex items-center">
                            <Calendar className="h-8 w-8 text-primary mr-3" />
                            <div>
                                <p className="text-sm text-gray-600">Duration</p>
                                <p className="text-xl font-semibold">{duration} days</p>
                            </div>
                        </div>

                        {/* Budget */}
                        <div className="flex items-center">
                            <DollarSign className="h-8 w-8 text-green-500 mr-3" />
                            <div>
                                <p className="text-sm text-gray-600">Budget</p>
                                <p className="text-xl font-semibold">${budget}</p>
                            </div>
                        </div>

                        {/* Intensity */}
                        <div className="flex items-center">
                            <Clock className="h-8 w-8 text-orange-500 mr-3" />
                            <div>
                                <p className="text-sm text-gray-600">Intensity</p>
                                <p className="text-xl font-semibold">{intensity}/10</p>
                            </div>
                        </div>
                    </div>

                    {/* Activity Focus */}
                    <div className="mt-8">
                        <h3 className="text-xl font-semibold mb-4">Activity Focus</h3>
                        <div className="flex flex-wrap gap-2">
                            {activities.map((activity) => (
                                <Badge key={activity.name} variant="default" className="text-sm">
                                    {activity.name}: {activity.level}/5
                                </Badge>
                            ))}
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}