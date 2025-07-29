// app/7-day-planner/page.tsx
"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, MapPin, Clock, Star, Plus, Minus, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";

// Define the type for a daily plan
interface DailyPlan {
    day: number;
    activities: string[];
    notes: string;
}

export default function SevenDayTripPlanner() {
    const [currentDay, setCurrentDay] = useState(1); // Track the current day
    const [plans, setPlans] = useState<DailyPlan[]>(
        Array.from({ length: 7 }, (_, i) => ({
            day: i + 1,
            activities: [],
            notes: "",
        }))
    );

    // Handle adding an activity
    const addActivity = (day: number, activity: string) => {
        const updatedPlans = [...plans];
        updatedPlans[day - 1].activities.push(activity);
        setPlans(updatedPlans);
    };

    // Handle removing an activity
    const removeActivity = (day: number, index: number) => {
        const updatedPlans = [...plans];
        updatedPlans[day - 1].activities.splice(index, 1);
        setPlans(updatedPlans);
    };

    // Handle updating notes
    const updateNotes = (day: number, notes: string) => {
        const updatedPlans = [...plans];
        updatedPlans[day - 1].notes = notes;
        setPlans(updatedPlans);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-12">
            <div className="container mx-auto px-4">
                {/* Header */}
                <header className="text-center mb-12">
                    <motion.h1
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="text-4xl font-bold mb-4"
                    >
                        Your 7-Day Trip Planner
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="text-xl text-gray-600"
                    >
                        Plan your perfect trip day by day
                    </motion.p>
                </header>

                {/* Day Navigation */}
                <motion.div
                    className="flex justify-center gap-4 mb-8"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                >
                    <Button
                        variant="outline"
                        onClick={() => setCurrentDay((prev) => Math.max(1, prev - 1))}
                        disabled={currentDay === 1}
                    >
                        <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <div className="flex items-center gap-2">
                        {Array.from({ length: 7 }, (_, i) => (
                            <Button
                                key={i + 1}
                                variant={currentDay === i + 1 ? "default" : "outline"}
                                onClick={() => setCurrentDay(i + 1)}
                            >
                                Day {i + 1}
                            </Button>
                        ))}
                    </div>
                    <Button
                        variant="outline"
                        onClick={() => setCurrentDay((prev) => Math.min(7, prev + 1))}
                        disabled={currentDay === 7}
                    >
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                </motion.div>

                {/* Day Plan */}
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentDay}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ duration: 0.3 }}
                        className="bg-white rounded-xl shadow-lg p-6"
                    >
                        <h2 className="text-2xl font-semibold mb-6 flex items-center">
                            <Calendar className="mr-2" /> Day {currentDay}
                        </h2>

                        {/* Activities */}
                        <div className="mb-6">
                            <h3 className="text-xl font-semibold mb-4 flex items-center">
                                <MapPin className="mr-2" /> Activities
                            </h3>
                            <div className="space-y-3">
                                {plans[currentDay - 1].activities.map((activity, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        transition={{ duration: 0.2 }}
                                        className="flex items-center justify-between p-3 bg-gray-100 rounded-lg"
                                    >
                                        <span>{activity}</span>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => removeActivity(currentDay, index)}
                                        >
                                            <Minus className="h-4 w-4" />
                                        </Button>
                                    </motion.div>
                                ))}
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        placeholder="Add an activity..."
                                        className="flex-1 p-2 border rounded-lg"
                                        onKeyDown={(e) => {
                                            if (e.key === "Enter" && e.currentTarget.value.trim()) {
                                                addActivity(currentDay, e.currentTarget.value.trim());
                                                e.currentTarget.value = "";
                                            }
                                        }}
                                    />
                                    <Button
                                        variant="outline"
                                        onClick={() => {
                                            const input = document.querySelector(
                                                "input[type='text']"
                                            ) as HTMLInputElement;
                                            if (input?.value.trim()) {
                                                addActivity(currentDay, input.value.trim());
                                                input.value = "";
                                            }
                                        }}
                                    >
                                        <Plus className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        </div>

                        {/* Notes */}
                        <div>
                            <h3 className="text-xl font-semibold mb-4 flex items-center">
                                <Star className="mr-2" /> Notes
                            </h3>
                            <textarea
                                value={plans[currentDay - 1].notes}
                                onChange={(e) => updateNotes(currentDay, e.target.value)}
                                placeholder="Add notes for the day..."
                                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                rows={4}
                            />
                        </div>
                    </motion.div>
                </AnimatePresence>

                {/* Save Plan Button */}
                <motion.div
                    className="mt-8 text-center"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.6 }}
                >
                    <Button className="hover:bg-primary/90">Save Plan</Button>
                </motion.div>
            </div>
        </div>
    );
}