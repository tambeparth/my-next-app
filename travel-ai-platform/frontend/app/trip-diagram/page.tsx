"use client"

import { motion } from "framer-motion"
import { MapPin, Calendar, PlaneTakeoff, Hotel, Utensils, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/Button"

interface Activity {
    name: string;
    type: string;
    duration: string;
    icon: React.ReactNode;
}

interface DestinationData {
    activities: Activity[];
    [key: string]: any;
}

interface TripDiagramProps {
    destination: string;
    destinationData: DestinationData;
}

export default function TripDiagram({ destination, destinationData }: TripDiagramProps) {
    if (!destinationData) return null

    return (
        <div className="max-w-5xl mx-auto">
            {/* Visual Trip Diagram */}
            <div className="relative py-10">
                {/* Timeline Line */}
                <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-primary/20 z-0"></div>

                {/* Day 1 */}
                <motion.div
                    className="relative z-10 mb-12"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                >
                    <div className="flex items-center justify-center mb-4">
                        <div className="bg-primary text-white text-lg font-bold w-12 h-12 rounded-full flex items-center justify-center">
                            1
                        </div>
                    </div>
                    <div className="bg-white rounded-xl shadow-md p-6 max-w-2xl mx-auto">
                        <h3 className="text-xl font-bold mb-3">Arrival & Check-in</h3>
                        <div className="space-y-3">
                            <div className="flex items-start space-x-3">
                                <div className="bg-blue-100 p-2 rounded-full mt-1">
                                    <PlaneTakeoff className="h-4 w-4 text-blue-600" />
                                </div>
                                <div>
                                    <p className="font-medium">Arrive at {destination} International Airport</p>
                                    <p className="text-sm text-gray-600">Morning arrival, private transfer to hotel</p>
                                </div>
                            </div>
                            <div className="flex items-start space-x-3">
                                <div className="bg-green-100 p-2 rounded-full mt-1">
                                    <Hotel className="h-4 w-4 text-green-600" />
                                </div>
                                <div>
                                    <p className="font-medium">Check-in at {destinationData.hotel}</p>
                                    <p className="text-sm text-gray-600">Luxury accommodation in prime location</p>
                                </div>
                            </div>
                            <div className="flex items-start space-x-3">
                                <div className="bg-orange-100 p-2 rounded-full mt-1">
                                    <Utensils className="h-4 w-4 text-orange-600" />
                                </div>
                                <div>
                                    <p className="font-medium">Welcome Dinner</p>
                                    <p className="text-sm text-gray-600">Authentic local cuisine experience</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Day 2 */}
                <motion.div
                    className="relative z-10 mb-12"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    <div className="flex items-center justify-center mb-4">
                        <div className="bg-primary text-white text-lg font-bold w-12 h-12 rounded-full flex items-center justify-center">
                            2
                        </div>
                    </div>
                    <div className="bg-white rounded-xl shadow-md p-6 max-w-2xl mx-auto">
                        <h3 className="text-xl font-bold mb-3">Exploring Highlights</h3>
                        <div className="space-y-3">
                            {destinationData.activities.slice(0, 2).map((activity: Activity, index: number) => (
                                <div key={index} className="flex items-start space-x-3">
                                    <div className="bg-purple-100 p-2 rounded-full mt-1">{activity.icon}</div>
                                    <div>
                                        <p className="font-medium">{activity.name}</p>
                                        <p className="text-sm text-gray-600">
                                            {activity.type} - {activity.duration}
                                        </p>
                                    </div>
                                </div>
                            ))}
                            <div className="flex items-start space-x-3">
                                <div className="bg-orange-100 p-2 rounded-full mt-1">
                                    <Utensils className="h-4 w-4 text-orange-600" />
                                </div>
                                <div>
                                    <p className="font-medium">Lunch at Local Hotspot</p>
                                    <p className="text-sm text-gray-600">Authentic regional specialties</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Day 3 */}
                <motion.div
                    className="relative z-10 mb-12"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                >
                    <div className="flex items-center justify-center mb-4">
                        <div className="bg-primary text-white text-lg font-bold w-12 h-12 rounded-full flex items-center justify-center">
                            3
                        </div>
                    </div>
                    <div className="bg-white rounded-xl shadow-md p-6 max-w-2xl mx-auto">
                        <h3 className="text-xl font-bold mb-3">Cultural Immersion</h3>
                        <div className="space-y-3">
                            {destinationData.activities.slice(2, 4).map((activity: Activity, index: number) => (
                                <div key={index} className="flex items-start space-x-3">
                                    <div className="bg-purple-100 p-2 rounded-full mt-1">{activity.icon}</div>
                                    <div>
                                        <p className="font-medium">{activity.name}</p>
                                        <p className="text-sm text-gray-600">
                                            {activity.type} - {activity.duration}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </motion.div>

                {/* More Days Button */}
                <div className="flex justify-center">
                    <Button variant="outline">
                        View All 7 Days <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                </div>
            </div>

            {/* Trip Overview Diagram */}
            <div className="mt-16 bg-gray-50 rounded-xl p-8">
                <h3 className="text-2xl font-bold mb-6 text-center">Trip Overview</h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white rounded-lg p-5 shadow-sm">
                        <div className="flex items-center space-x-3 mb-4">
                            <div className="bg-blue-100 p-3 rounded-full">
                                <MapPin className="h-5 w-5 text-blue-600" />
                            </div>
                            <h4 className="font-bold text-lg">Destinations</h4>
                        </div>
                        <ul className="space-y-2 text-gray-700">
                            <li className="flex items-center space-x-2">
                                <div className="w-2 h-2 rounded-full bg-primary"></div>
                                <span>{destination} City Center</span>
                            </li>
                            {destinationData.activities.slice(0, 3).map((activity: Activity, index: number) => (
                                <li key={index} className="flex items-center space-x-2">
                                    <div className="w-2 h-2 rounded-full bg-primary"></div>
                                    <span>{activity.name}</span>
                                </li>
                            ))}
                            <li className="flex items-center space-x-2">
                                <div className="w-2 h-2 rounded-full bg-primary"></div>
                                <span>+ 3 more locations</span>
                            </li>
                        </ul>
                    </div>

                    <div className="bg-white rounded-lg p-5 shadow-sm">
                        <div className="flex items-center space-x-3 mb-4">
                            <div className="bg-green-100 p-3 rounded-full">
                                <Calendar className="h-5 w-5 text-green-600" />
                            </div>
                            <h4 className="font-bold text-lg">Activities</h4>
                        </div>
                        <div className="space-y-3">
                            <div className="flex justify-between items-center">
                                <span>Sightseeing</span>
                                <div className="w-1/2 bg-gray-200 rounded-full h-2.5">
                                    <div className="bg-primary h-2.5 rounded-full" style={{ width: "70%" }}></div>
                                </div>
                            </div>
                            <div className="flex justify-between items-center">
                                <span>Cultural</span>
                                <div className="w-1/2 bg-gray-200 rounded-full h-2.5">
                                    <div className="bg-primary h-2.5 rounded-full" style={{ width: "60%" }}></div>
                                </div>
                            </div>
                            <div className="flex justify-between items-center">
                                <span>Dining</span>
                                <div className="w-1/2 bg-gray-200 rounded-full h-2.5">
                                    <div className="bg-primary h-2.5 rounded-full" style={{ width: "40%" }}></div>
                                </div>
                            </div>
                            <div className="flex justify-between items-center">
                                <span>Leisure</span>
                                <div className="w-1/2 bg-gray-200 rounded-full h-2.5">
                                    <div className="bg-primary h-2.5 rounded-full" style={{ width: "30%" }}></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg p-5 shadow-sm">
                        <div className="flex items-center space-x-3 mb-4">
                            <div className="bg-purple-100 p-3 rounded-full">
                                <PlaneTakeoff className="h-5 w-5 text-purple-600" />
                            </div>
                            <h4 className="font-bold text-lg">Travel Details</h4>
                        </div>
                        <ul className="space-y-3 text-gray-700">
                            <li className="flex justify-between">
                                <span>Duration:</span>
                                <span className="font-medium">7 Days</span>
                            </li>
                            <li className="flex justify-between">
                                <span>Accommodation:</span>
                                <span className="font-medium">{destinationData.hotel}</span>
                            </li>
                            <li className="flex justify-between">
                                <span>Transportation:</span>
                                <span className="font-medium">Flight + Local Transit</span>
                            </li>
                            <li className="flex justify-between">
                                <span>Budget:</span>
                                <span className="font-medium">{destinationData.budget}</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="mt-8 text-center">
                    <Button>
                        Customize This Plan <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                </div>
            </div>
        </div>
    )
}

