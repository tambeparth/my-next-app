
"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from "framer-motion";
import {
  MapPin,
  Calendar,
  Compass,
  Globe,
  PlaneTakeoff,
  Hotel,
  Utensils,
  Camera,
  MessageSquare,
  ChevronRight,
  Menu,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import TripDiagram from "@/app/trip-diagram/page";
import Link from "next/link";
import Chatbot from "@/app/chatbot/page";
import SignIn from "@/app/SignIn/page";
import Login from "@/app/LogIn/page";
import CityPhotos from '@/components/CityPhotos';

// Interface for Destination Data
interface DestinationData {
  image: string;
  activities: {
    name: string;
    type: string;
    duration: string;
    icon: React.ReactNode;
  }[];
  hotel: string;
  budget: string;
}

// Interface for Testimonial
interface Testimonial {
  name: string;
  location: string;
  text: string;
  avatar: string;
}

export default function LandingPage() {
  const router = useRouter();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [destination, setDestination] = useState("");
  const [selectedDestination, setSelectedDestination] = useState<DestinationData | null>(null);
  const [showPlanDiagram, setShowPlanDiagram] = useState(false);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  const { isAuthenticated } = useAuth();

  // Add this function to handle protected actions
  const handleProtectedAction = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      router.push('/SignIn');
      return;
    }
    router.push('/customize-plan');
  };

  // Add these handler functions at the top of your component
  const handleProtectedNavigation = (e: React.MouseEvent, path: string) => {
    e.preventDefault();
    if (!isAuthenticated) {
      router.push('/SignIn');
      return;
    }
    router.push(path);
  };

  const handleDestinationSelect = (dest: string) => {
    if (!isAuthenticated) {
      router.push('/SignIn');
      return;
    }
    setDestination(dest);
    setSelectedDestination(destinationsData[dest]);
    setShowPlanDiagram(true);

    setTimeout(() => {
      const diagramSection = document.getElementById("plan-diagram");
      if (diagramSection) {
        diagramSection.scrollIntoView({ behavior: "smooth" });
      }
    }, 500);
  };

  // Destinations Data
  const destinationsData: Record<string, DestinationData> = {
    Paris: {
      image: "/Paris.jpg?height=400&width=600&text=Paris",
      activities: [
        { name: "Eiffel Tower", type: "Sightseeing", duration: "2 hours", icon: <Camera className="h-4 w-4 text-purple-600" /> },
        { name: "Louvre Museum", type: "Cultural", duration: "3 hours", icon: <Camera className="h-4 w-4 text-purple-600" /> },
        { name: "Seine River Cruise", type: "Leisure", duration: "1 hour", icon: <Compass className="h-4 w-4 text-blue-600" /> },
        { name: "Le Marais District", type: "Exploration", duration: "2 hours", icon: <MapPin className="h-4 w-4 text-red-600" /> },
        { name: "Café de Flore", type: "Dining", duration: "1 hour", icon: <Utensils className="h-4 w-4 text-orange-600" /> },
      ],
      hotel: "Grand Hôtel de Paris",
      budget: "$2,800",
    },
    Tokyo: {
      image: "/Tokyo.jpg?height=400&width=600&text=Tokyo",
      activities: [
        { name: "Meiji Shrine", type: "Cultural", duration: "2 hours", icon: <Camera className="h-4 w-4 text-purple-600" /> },
        { name: "Shibuya Crossing", type: "Sightseeing", duration: "1 hour", icon: <MapPin className="h-4 w-4 text-red-600" /> },
        { name: "Tokyo Skytree", type: "Sightseeing", duration: "2 hours", icon: <Camera className="h-4 w-4 text-purple-600" /> },
        { name: "Tsukiji Fish Market", type: "Food", duration: "2 hours", icon: <Utensils className="h-4 w-4 text-orange-600" /> },
        { name: "Akihabara District", type: "Shopping", duration: "3 hours", icon: <MapPin className="h-4 w-4 text-red-600" /> },
      ],
      hotel: "Sakura Hotel Tokyo",
      budget: "$3,200",
    },
    "New York": {
      image: "/New York.jpg?height=400&width=600&text=New+York",
      activities: [
        { name: "Central Park", type: "Leisure", duration: "3 hours", icon: <MapPin className="h-4 w-4 text-red-600" /> },
        { name: "Empire State Building", type: "Sightseeing", duration: "2 hours", icon: <Camera className="h-4 w-4 text-purple-600" /> },
        { name: "Metropolitan Museum", type: "Cultural", duration: "3 hours", icon: <Camera className="h-4 w-4 text-purple-600" /> },
        { name: "Broadway Show", type: "Entertainment", duration: "3 hours", icon: <Camera className="h-4 w-4 text-purple-600" /> },
        { name: "Brooklyn Bridge", type: "Sightseeing", duration: "1 hour", icon: <MapPin className="h-4 w-4 text-red-600" /> },
      ],
      hotel: "Manhattan Grand Hotel",
      budget: "$3,500",
    },
    Bali: {
      image: "/Bali.jpg?height=400&width=600&text=Bali",
      activities: [
        { name: "Ubud Monkey Forest", type: "Nature", duration: "2 hours", icon: <Camera className="h-4 w-4 text-purple-600" /> },
        { name: "Tegallalang Rice Terraces", type: "Sightseeing", duration: "2 hours", icon: <MapPin className="h-4 w-4 text-red-600" /> },
        { name: "Uluwatu Temple", type: "Cultural", duration: "2 hours", icon: <Camera className="h-4 w-4 text-purple-600" /> },
        { name: "Kuta Beach", type: "Beach", duration: "4 hours", icon: <Compass className="h-4 w-4 text-blue-600" /> },
        { name: "Balinese Cooking Class", type: "Activity", duration: "3 hours", icon: <Utensils className="h-4 w-4 text-orange-600" /> },
      ],
      hotel: "Bali Paradise Resort",
      budget: "$2,100",
    },
    Rome: {
      image: "/Rom.jpg?height=400&width=600&text=Rome",
      activities: [
        { name: "Colosseum", type: "Historical", duration: "3 hours", icon: <Camera className="h-4 w-4 text-purple-600" /> },
        { name: "Vatican Museums", type: "Cultural", duration: "4 hours", icon: <Camera className="h-4 w-4 text-purple-600" /> },
        { name: "Trevi Fountain", type: "Sightseeing", duration: "1 hour", icon: <MapPin className="h-4 w-4 text-red-600" /> },
        { name: "Roman Forum", type: "Historical", duration: "2 hours", icon: <Camera className="h-4 w-4 text-purple-600" /> },
        { name: "Trastevere District", type: "Dining", duration: "3 hours", icon: <Utensils className="h-4 w-4 text-orange-600" /> },
      ],
      hotel: "Roma Antica Hotel",
      budget: "$2,600",
    },
  };

  // Testimonials Data
  const testimonials: Testimonial[] = [
    {
      name: "Sarah Johnson",
      location: "New York",
      text: "The AI trip planner saved me hours of research. It created the perfect itinerary for my family vacation to Italy!",
      avatar: "/avatar-svgrepo-com (1).svg?height=50&width=50",
    },
    {
      name: "Michael Chen",
      location: "San Francisco",
      text: "I was amazed by how well it understood my preferences. My solo trip to Japan was perfectly tailored to my interests.",
      avatar: "/avatar-svgrepo-com.svg?height=50&width=50",
    },
    {
      name: "Emma Rodriguez",
      location: "London",
      text: "As a frequent traveler, I've tried many planning tools. This AI planner is by far the most intuitive and comprehensive.",
      avatar: "/avatar-svgrepo-com (2).svg?height=50&width=50",
    },
  ];

  // Scroll Effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []); // Removed the duplicate handleDestinationSelect function

  // Testimonial Carousel Effect
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [testimonials.length]);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header
        className={`fixed w-full z-50 transition-all duration-300 ${isScrolled ? "bg-white/90 backdrop-blur-md shadow-md" : "bg-transparent"
          }`}
      >
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Compass className="h-8 w-8 text-primary" />
            <span className="font-bold text-2xl">TripAI</span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            <a href="#features" className="font-medium hover:text-primary transition-colors">
              Features
            </a>
            <a href="#how-it-works" className="font-medium hover:text-primary transition-colors">
              How It Works
            </a>
            <a href="#testimonials" className="font-medium hover:text-primary transition-colors">
              Testimonials
            </a>
            <a href="#pricing" className="font-medium hover:text-primary transition-colors">
              Pricing
            </a>
            <Link
              href="/gamification"
              onClick={(e) => handleProtectedNavigation(e, '/gamification')}
              className="font-medium hover:text-primary transition-colors"
            >
              Rewards
            </Link>
            <Link
              href="/game"
              onClick={(e) => handleProtectedNavigation(e, '/game')}
              className="font-medium hover:text-primary transition-colors"
            >
              Play Game
            </Link>
            <Link
              href="/reviews"
              onClick={(e) => handleProtectedNavigation(e, '/reviews')}
              className="font-medium hover:text-primary transition-colors"
            >
              Reviews
            </Link>
          </nav>

          <div className="hidden md:flex space-x-4">
            {isAuthenticated ? (
              <>
                <Link href="/main">
                  <Button variant="outline" className="px-4 py-2 rounded-lg border bg-black border-black text-white hover:bg-gray-700">
                    Dashboard
                  </Button>
                </Link>
                <Link href="/LogOut">
                  <Button className="px-4 py-2 rounded-lg bg-white text-black hover:bg-gray-300">
                    Log Out
                  </Button>
                </Link>
              </>
            ) : (
              <>
                <Link href="/LogIn">
                  <Button variant="outline" className="px-4 py-2 rounded-lg border bg-black border-black text-white hover:bg-gray-700">
                    Log In
                  </Button>
                </Link>
                <Link href="/Register">
                  <Button className="px-4 py-2 rounded-lg bg-white text-black hover:bg-gray-300">
                    Sign Up
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-gray-700"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-white border-t"
            >
              <div className="container mx-auto px-4 py-4 flex flex-col space-y-4">
                <a
                  href="#features"
                  className="font-medium py-2 hover:text-primary transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Features
                </a>
                <a
                  href="#how-it-works"
                  className="font-medium py-2 hover:text-primary transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  How It Works
                </a>
                <a
                  href="#testimonials"
                  className="font-medium py-2 hover:text-primary transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Testimonials
                </a>
                <a
                  href="#pricing"
                  className="font-medium py-2 hover:text-primary transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Pricing
                </a>
                <Link
                  href="/gamification"
                  className="font-medium py-2 hover:text-primary transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Rewards
                </Link>
                <div className="flex flex-col space-y-2 pt-2">
                  {isAuthenticated ? (
                    <>
                      <Link href="/main">
                        <Button variant="outline" className="w-full">Dashboard</Button>
                      </Link>
                      <Link href="/LogOut">
                        <Button className="w-full">Log Out</Button>
                      </Link>
                    </>
                  ) : (
                    <>
                      <Link href="/LogIn">
                        <Button variant="outline" className="w-full">Log In</Button>
                      </Link>
                      <Link href="/Register">
                        <Button className="w-full">Sign Up</Button>
                      </Link>
                    </>
                  )}
                </div>
                <Link
                  href="/game"
                  className="font-medium py-2 hover:text-primary transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Play Game
                </Link>
                <Link
                  href="/reviews"
                  className="font-medium py-2 hover:text-primary transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Reviews
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
      {/* Hero Section */}
      <section className="pt-32 pb-20 md:pt-40 md:pb-32 bg-gradient-to-br from-gray-300 to-white-50">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center">
            {/* Left Section: Text and Input */}
            <motion.div
              className="md:w-1/2 mb-10 md:mb-0"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Badge className="mb-4">AI-Powered Travel Planning</Badge>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                Your Perfect Trip
                <br />
                <span className="text-primary">
                  Planned By AI
                </span>
              </h1>
              <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-lg">
                Let our advanced AI create personalized travel itineraries tailored to your preferences, budget, and travel style.
              </p>

              {/* Destination Input Section */}
              <div className="bg-white p-6 rounded-xl shadow-lg max-w-md">
                <div className="flex items-center space-x-2 mb-4">
                  <MapPin className="text-primary" />
                  <p className="font-medium">Where do you want to go?</p>
                </div>

                <div className="flex space-x-2">
                  <Input
                    placeholder="Enter destination"
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    className="flex-grow"
                  />
                  <Button
                    onClick={() => {
                      if (destination && destinationsData[destination]) {
                        handleDestinationSelect(destination);
                      }
                    }}
                  >
                    Plan <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>

                {/* Destination Badges */}
                <div className="mt-4 flex flex-wrap gap-2">
                  {Object.keys(destinationsData).map((dest) => (
                    <Badge
                      key={dest}
                      variant="outline"
                      className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
                      onClick={() => handleDestinationSelect(dest)}
                    >
                      {dest}
                    </Badge>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Right Section: Destination Details */}
            <motion.div
              className="md:w-1/2"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="relative">
                {/* Background Blur Effects */}
                <div className="absolute -top-6 -left-6 w-64 h-64 bg-primary/10 rounded-full blur-3xl"></div>
                <div className="absolute -bottom-10 -right-10 w-72 h-72 bg-blue-400/10 rounded-full blur-3xl"></div>

                {/* Destination Card */}
                <div className="relative bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
                  <img
                    src={selectedDestination?.image ?? "/mantas-hesthaven-_g1WdcKcV3w-unsplash.jpg"}
                    alt={destination ?? "AI Trip Planning"}
                    className="w-full h-64 object-cover transition-all duration-500"
                  />

                  <div className="p-6">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="font-bold text-lg">{destination || "Your Adventure"}</h3>
                      <Badge>7 Days</Badge>
                    </div>

                    {/* Activity Links */}
                    <div className="space-y-3">
                      <Link
                        href={`/flight?destination=${destination}`}
                        onClick={(e) => handleProtectedNavigation(e, `/flight?destination=${destination}`)}
                      >
                        <motion.div
                          className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 cursor-pointer"
                          whileHover={{ x: 5 }}
                        >
                          <div className="bg-blue-100 p-2 rounded-full">
                            <PlaneTakeoff className="h-4 w-4 text-blue-600" />
                          </div>
                          <div>
                            <p className="text-sm font-medium">Flight to {destination || "Destination"}</p>
                            <p className="text-xs text-gray-500">May 15, 10:30 AM</p>
                          </div>
                        </motion.div>
                      </Link>

                      <Link
                        href={`/hotels?destination=${destination}`}
                        onClick={(e) => handleProtectedNavigation(e, `/hotels?destination=${destination}`)}
                      >
                        <motion.div
                          className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 cursor-pointer"
                          whileHover={{ x: 5 }}
                        >
                          <div className="bg-green-100 p-2 rounded-full">
                            <Hotel className="h-4 w-4 text-green-600" />
                          </div>
                          <div>
                            <p className="text-sm font-medium">
                              Check-in: {selectedDestination?.hotel || "Luxury Hotel"}
                            </p>
                            <p className="text-xs text-gray-500">4.8 ★ - Central Location</p>
                          </div>
                        </motion.div>
                      </Link>

                      <Link
                        href={`/restaurants?destination=${destination}`}
                        onClick={(e) => handleProtectedNavigation(e, `/restaurants?destination=${destination}`)}
                      >
                        <motion.div
                          className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 cursor-pointer"
                          whileHover={{ x: 5 }}
                        >
                          <div className="bg-purple-100 p-2 rounded-full">
                            {selectedDestination?.activities[0].icon || <Camera className="h-4 w-4 text-purple-600" />}
                          </div>
                          <div>
                            <p className="text-sm font-medium">Visit {selectedDestination?.activities[0].name || 'Popular Attraction'}</p>
                            <p className="text-xs text-gray-500">
                              {selectedDestination?.activities[0].type || 'Activity'} - {selectedDestination?.activities[0].duration || '2-3 hours'}
                            </p>
                          </div>
                        </motion.div>
                      </Link>

                      <Link
                        href={`/attraction?destination=${destination}`}
                        onClick={(e) => handleProtectedNavigation(e, `/attraction?destination=${destination}`)}
                      >
                        <motion.div
                          className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 cursor-pointer"
                          whileHover={{ x: 5 }}
                        >
                          <div className="bg-purple-100 p-2 rounded-full">
                            <Camera className="h-4 w-4 text-purple-600" />
                          </div>
                          <div className="flex-grow">
                            <p className="text-sm font-medium">Popular Attractions</p>
                            <p className="text-xs text-gray-500">Top-rated experiences</p>
                          </div>
                          <div className="w-24 h-24 relative rounded-lg overflow-hidden">
                            <CityPhotos destination={destination} />
                          </div>
                        </motion.div>
                      </Link>
                    </div>

                    {/* Budget and Customize Plan Section */}
                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-sm text-gray-500">Estimated Budget</p>
                          <p className="font-bold">{selectedDestination?.budget || "$2,000 - $3,500"}</p>
                        </div>
                        <Link href="/customize-plan" passHref>
                          <Button size="sm" onClick={(e) => handleProtectedAction(e)}>View & Customize Plan</Button>
                        </Link>
                      </div>
                    </div>
                    <Link href="/customize-plan" passHref>
                      <Button className="mt-4 w-full" onClick={(e) => handleProtectedAction(e)}>
                        Customize This Plan <ChevronRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
      {/* Diagrammatic Trip Planning Section */}
      {showPlanDiagram && selectedDestination && (
        <section id="plan-diagram" className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <Badge className="mb-4">Your Trip Plan</Badge>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Your 7-Day {destination} Adventure</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Our AI has created a personalized itinerary for your trip to {destination}.
              </p>
            </div>

            <TripDiagram destination={destination} destinationData={selectedDestination} />
          </div>
        </section>
      )}

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="mb-4">Features</Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Intelligent Travel Planning & Safety</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Our platform combines AI-powered planning with real-time safety information, hotel search, and customizable itineraries to create your perfect trip with peace of mind.
            </p>
          </div>

          <motion.div
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-8"
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: {
                  staggerChildren: 0.1,
                },
              },
            }}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            {[
              {
                icon: <MessageSquare className="h-10 w-10 text-primary" />,
                title: "AI Travel Assistant",
                description: "Chat with our intelligent assistant to get personalized travel advice and crisis alerts for your destination.",
              },
              {
                icon: <Hotel className="h-10 w-10 text-primary" />,
                title: "Hotel Search",
                description: "Browse authentic hotel listings with real photos and reviews from Booking.com to find your perfect accommodation.",
              },
              {
                icon: <Compass className="h-10 w-10 text-primary" />,
                title: "Customizable Plans",
                description: "Create your ideal trip by selecting destinations, activities, accommodation types, and transportation preferences.",
              },
              {
                icon: <Globe className="h-10 w-10 text-primary" />,
                title: "Multi-Model AI",
                description: "Our platform leverages multiple AI models to ensure you always get the best responses even during service disruptions.",
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
                variants={{
                  hidden: { y: 20, opacity: 0 },
                  visible: {
                    y: 0,
                    opacity: 1,
                    transition: {
                      type: "spring",
                      stiffness: 100,
                    },
                  },
                }}
              >
                <div className="mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="mb-4">How It Works</Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Plan Your Trip in 3 Simple Steps</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Our platform makes travel planning effortless with AI assistance, customizable options, and real-time safety information.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              {
                step: 1,
                title: "Customize Your Trip",
                description: "Use our step-by-step customization tool to select your destination, duration, budget, accommodation, transportation, and activities.",
              },
              {
                step: 2,
                title: "Get AI-Generated Plans",
                description: "Our AI assistant processes your preferences and generates a detailed travel plan with crisis alerts and safety information.",
              },
              {
                step: 3,
                title: "Explore & Book",
                description: "Browse hotels with authentic photos, check reviews, and get real-time information about your destination through our chatbot.",
              },
            ].map((step, index) => (
              <motion.div
                key={index}
                className="relative"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                viewport={{ once: true, margin: "-100px" }}
              >
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 h-full">
                  <div className="absolute -top-4 -left-4 w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white font-bold text-xl">
                    {step.step}
                  </div>
                  <div className="pt-6">
                    <h3 className="text-xl font-bold mb-4">{step.title}</h3>
                    <p className="text-gray-600">{step.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="mt-16 text-center">
            <Link href="/">
              <Button size="lg">
                Start Planning Now <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>

        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="mb-4">Testimonials</Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">What Our Travelers Say</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Discover how our AI trip planner has transformed travel experiences for people around the world.
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentTestimonial}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="bg-white rounded-xl p-8 shadow-sm border border-gray-100"
              >
                <div className="flex items-center space-x-4 mb-6">
                  <img
                    src={testimonials[currentTestimonial].avatar || "/avatar-svgrepo-com (1).svg"}
                    alt={testimonials[currentTestimonial].name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <p className="font-bold">{testimonials[currentTestimonial].name}</p>
                    <p className="text-sm text-gray-500">{testimonials[currentTestimonial].location}</p>
                  </div>
                </div>

                <p className="text-lg italic">"{testimonials[currentTestimonial].text}"</p>

                <div className="flex justify-center mt-8 space-x-2">
                  {testimonials.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentTestimonial(index)}
                      className={`w-2.5 h-2.5 rounded-full ${index === currentTestimonial ? "bg-primary" : "bg-gray-300"
                        }`}
                      aria-label={`View testimonial ${index + 1}`}
                    />
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="mb-4">Pricing</Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Simple, Transparent Pricing</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Choose the plan that fits your travel needs. All plans include our core AI planning features.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                title: "Basic",
                price: "₹9.99",
                features: [
                  "3 AI trip plans per month",
                  "Basic recommendations",
                  "Email support",
                ],
                buttonText: "Get Started",
                variant: "outline",
              },
              {
                price: "₹19.99",
                title: "Premium",
                features: [
                  "Unlimited trip plans",
                  "Advanced personalization",
                  "Priority support",
                  "Booking assistance",
                ],
                buttonText: "Get Started",
                variant: "default",
                popular: true,
              },
              {
                price: "₹49.99",
                title: "Business",
                features: [
                  "Unlimited trip plans",
                  "Team collaboration",
                  "Dedicated account manager",
                  "API access",
                ],
                buttonText: "Contact Sales",
                variant: "outline",
              },
            ].map((plan, index) => (
              <motion.div
                key={index}
                className={`bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow ${plan.popular ? "border-2 border-primary" : ""
                  }`}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                viewport={{ once: true, margin: "-100px" }}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-white px-4 py-1 rounded-full text-sm font-medium">
                    Most Popular
                  </div>
                )}
                <div className="text-center mb-6">
                  <h3 className="text-xl font-bold mb-2">{plan.title}</h3>
                  <div className="text-3xl font-bold mb-1">{plan.price}</div>
                  <p className="text-sm text-gray-500">per month</p>
                </div>

                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-center space-x-3">
                      <svg className="h-5 w-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  onClick={(e) => handleProtectedNavigation(e, plan.buttonText === "Get Started" ? `/pricing/${plan.title.toLowerCase()}` : '/contact')}
                  className="w-full"
                  variant={plan.variant as "default" | "outline"}
                >
                  {plan.buttonText}
                </Button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-primary/90 to-gray-300/90 text-gray-900">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true, margin: "-100px" }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Transform Your Travel Experience?</h2>
            <p className="text-lg text-gray-900/80 max-w-2xl mx-auto mb-8">
              Join thousands of travelers who have discovered the power of AI-driven trip planning. Your perfect
              adventure awaits.
            </p>

            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button size="lg" variant="default">
                Start Planning for Free
              </Button>
              <Button size="lg" variant="outline" className="bg-transparent text-black border-black hover:bg-white/10">
                Schedule a Demo
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Compass className="h-6 w-6 text-primary" />
                <span className="font-bold text-xl text-white">TripAI</span>
              </div>
              <p className="text-sm text-gray-400 mb-4">AI-powered travel planning for the modern explorer.</p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                  </svg>
                </a>
              </div>
            </div>

            <div>
              <h3 className="font-bold text-white mb-4">Company</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    About Us
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Careers
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Press
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold text-white mb-4">Support</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Help Center
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Contact Us
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Terms of Service
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold text-white mb-4">Stay Updated</h3>
              <p className="text-sm text-gray-400 mb-4">
                Subscribe to our newsletter for travel tips and exclusive offers.
              </p>
              <form className="space-y-2">
                <Input
                  type="email"
                  placeholder="Your email address"
                  className="bg-gray-800 border-gray-700 text-white"
                />
                <Button type="submit" className="w-full">
                  Subscribe
                </Button>
              </form>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-12 pt-8 text-sm text-gray-400 text-center">
            <p>&copy; {new Date().getFullYear()} TripAI. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
