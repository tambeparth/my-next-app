"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
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
  User,
  LogOut,
} from "lucide-react"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Badge } from "@/components/ui/Badge"
import Link from "next/link"
import { useAuth } from "@/context/AuthContext"

export default function LandingPage() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [destination, setDestination] = useState("")
  const [selectedDestination, setSelectedDestination] = useState<any>(null)
  const [showPlanDiagram, setShowPlanDiagram] = useState(false)
  const [currentTestimonial, setCurrentTestimonial] = useState(0)
  const { user, logout, isAuthenticated } = useAuth()

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true)
      } else {
        setIsScrolled(false)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  const destinations = ["Paris", "Tokyo", "New York", "Bali", "Rome", "Sydney", "London", "Barcelona"]

  const testimonials = [
    {
      name: "Sarah Johnson",
      location: "New York",
      text: "The AI trip planner saved me hours of research. It created the perfect itinerary for my family vacation to Italy!",
      avatar: "/placeholder.svg?height=50&width=50",
    },
    {
      name: "Michael Chen",
      location: "San Francisco",
      text: "I was amazed by how well it understood my preferences. My solo trip to Japan was perfectly tailored to my interests.",
      avatar: "/placeholder.svg?height=50&width=50",
    },
    {
      name: "Emma Rodriguez",
      location: "London",
      text: "As a frequent traveler, I've tried many planning tools. This AI planner is by far the most intuitive and comprehensive.",
      avatar: "/placeholder.svg?height=50&width=50",
    },
  ]

  const destinationsData = {
    Paris: {
      image: "/placeholder.svg?height=400&width=600&text=Paris",
      activities: [
        {
          name: "Eiffel Tower",
          type: "Sightseeing",
          duration: "2 hours",
          icon: <Camera className="h-4 w-4 text-purple-600" />,
        },
        {
          name: "Louvre Museum",
          type: "Cultural",
          duration: "3 hours",
          icon: <Camera className="h-4 w-4 text-purple-600" />,
        },
        {
          name: "Seine River Cruise",
          type: "Leisure",
          duration: "1 hour",
          icon: <Compass className="h-4 w-4 text-blue-600" />,
        },
        {
          name: "Le Marais District",
          type: "Exploration",
          duration: "2 hours",
          icon: <MapPin className="h-4 w-4 text-red-600" />,
        },
        {
          name: "Café de Flore",
          type: "Dining",
          duration: "1 hour",
          icon: <Utensils className="h-4 w-4 text-orange-600" />,
        },
      ],
      hotel: "Grand Hôtel de Paris",
      budget: "$2,800",
    },
    Tokyo: {
      image: "/placeholder.svg?height=400&width=600&text=Tokyo",
      activities: [
        {
          name: "Meiji Shrine",
          type: "Cultural",
          duration: "2 hours",
          icon: <Camera className="h-4 w-4 text-purple-600" />,
        },
        {
          name: "Shibuya Crossing",
          type: "Sightseeing",
          duration: "1 hour",
          icon: <MapPin className="h-4 w-4 text-red-600" />,
        },
        {
          name: "Tokyo Skytree",
          type: "Sightseeing",
          duration: "2 hours",
          icon: <Camera className="h-4 w-4 text-purple-600" />,
        },
        {
          name: "Tsukiji Fish Market",
          type: "Food",
          duration: "2 hours",
          icon: <Utensils className="h-4 w-4 text-orange-600" />,
        },
        {
          name: "Akihabara District",
          type: "Shopping",
          duration: "3 hours",
          icon: <MapPin className="h-4 w-4 text-red-600" />,
        },
      ],
      hotel: "Sakura Hotel Tokyo",
      budget: "$3,200",
    },
    "New York": {
      image: "/placeholder.svg?height=400&width=600&text=New+York",
      activities: [
        {
          name: "Central Park",
          type: "Leisure",
          duration: "3 hours",
          icon: <MapPin className="h-4 w-4 text-red-600" />,
        },
        {
          name: "Empire State Building",
          type: "Sightseeing",
          duration: "2 hours",
          icon: <Camera className="h-4 w-4 text-purple-600" />,
        },
        {
          name: "Metropolitan Museum",
          type: "Cultural",
          duration: "3 hours",
          icon: <Camera className="h-4 w-4 text-purple-600" />,
        },
        {
          name: "Broadway Show",
          type: "Entertainment",
          duration: "3 hours",
          icon: <Camera className="h-4 w-4 text-purple-600" />,
        },
        {
          name: "Brooklyn Bridge",
          type: "Sightseeing",
          duration: "1 hour",
          icon: <MapPin className="h-4 w-4 text-red-600" />,
        },
      ],
      hotel: "Manhattan Grand Hotel",
      budget: "$3,500",
    },
    Bali: {
      image: "/placeholder.svg?height=400&width=600&text=Bali",
      activities: [
        {
          name: "Ubud Monkey Forest",
          type: "Nature",
          duration: "2 hours",
          icon: <Camera className="h-4 w-4 text-purple-600" />,
        },
        {
          name: "Tegallalang Rice Terraces",
          type: "Sightseeing",
          duration: "2 hours",
          icon: <MapPin className="h-4 w-4 text-red-600" />,
        },
        {
          name: "Uluwatu Temple",
          type: "Cultural",
          duration: "2 hours",
          icon: <Camera className="h-4 w-4 text-purple-600" />,
        },
        { name: "Kuta Beach", type: "Beach", duration: "4 hours", icon: <Compass className="h-4 w-4 text-blue-600" /> },
        {
          name: "Balinese Cooking Class",
          type: "Activity",
          duration: "3 hours",
          icon: <Utensils className="h-4 w-4 text-orange-600" />,
        },
      ],
      hotel: "Bali Paradise Resort",
      budget: "$2,100",
    },
    Rome: {
      image: "/placeholder.svg?height=400&width=600&text=Rome",
      activities: [
        {
          name: "Colosseum",
          type: "Historical",
          duration: "3 hours",
          icon: <Camera className="h-4 w-4 text-purple-600" />,
        },
        {
          name: "Vatican Museums",
          type: "Cultural",
          duration: "4 hours",
          icon: <Camera className="h-4 w-4 text-purple-600" />,
        },
        {
          name: "Trevi Fountain",
          type: "Sightseeing",
          duration: "1 hour",
          icon: <MapPin className="h-4 w-4 text-red-600" />,
        },
        {
          name: "Roman Forum",
          type: "Historical",
          duration: "2 hours",
          icon: <Camera className="h-4 w-4 text-purple-600" />,
        },
        {
          name: "Trastevere District",
          type: "Dining",
          duration: "3 hours",
          icon: <Utensils className="h-4 w-4 text-orange-600" />,
        },
      ],
      hotel: "Roma Antica Hotel",
      budget: "$2,600",
    },
  }

  const features = [
    {
      icon: <Globe className="h-10 w-10 text-primary" />,
      title: "AI-Powered Recommendations",
      description: "Our advanced AI analyzes thousands of destinations to match your preferences perfectly.",
    },
    {
      icon: <Calendar className="h-10 w-10 text-primary" />,
      title: "Smart Itinerary Building",
      description: "Create detailed day-by-day plans that optimize your time and include hidden gems.",
    },
    {
      icon: <Hotel className="h-10 w-10 text-primary" />,
      title: "Accommodation Matching",
      description: "Find the perfect places to stay based on your budget, style, and location preferences.",
    },
    {
      icon: <Utensils className="h-10 w-10 text-primary" />,
      title: "Dining Recommendations",
      description: "Discover local cuisine and restaurants tailored to your dietary needs and taste.",
    },
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring" as const,
        stiffness: 100,
      },
    },
  }

  const handleDestinationSelect = (dest: string) => {
    setDestination(dest)
    setSelectedDestination(destinationsData[dest as keyof typeof destinationsData] || null)
    setShowPlanDiagram(true)

    setTimeout(() => {
      const diagramSection = document.getElementById("plan-diagram")
      if (diagramSection) {
        diagramSection.scrollIntoView({ behavior: "smooth" })
      }
    }, 500)
  }

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
            {isAuthenticated ? (
              <>
                <Link href="/chatbot" className="font-medium hover:text-primary transition-colors">
                  AI Chatbot
                </Link>
                <Link href="/customize-plan" className="font-medium hover:text-primary transition-colors">
                  Plan Trip
                </Link>
                <Link href="/reviews" className="font-medium hover:text-primary transition-colors">
                  Reviews
                </Link>
              </>
            ) : (
              <span className="font-medium text-gray-400 cursor-not-allowed" title="Login required">
                AI Features (Login Required)
              </span>
            )}
            <a href="#testimonials" className="font-medium hover:text-primary transition-colors">
              Testimonials
            </a>
          </nav>

          <div className="hidden md:flex space-x-4">
            {isAuthenticated ? (
              <>
                <div className="flex items-center space-x-2 px-3 py-2 bg-gray-100 rounded-lg">
                  <User className="h-4 w-4" />
                  <span className="text-sm font-medium">{user?.username || user?.email}</span>
                </div>
                <Button variant="outline" onClick={logout}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link href="/LogIn">
                  <Button variant="outline">Log In</Button>
                </Link>
                <Link href="/signup">
                  <Button>Sign Up</Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button className="md:hidden text-gray-700" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
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
                {isAuthenticated ? (
                  <>
                    <Link
                      href="/chatbot"
                      className="font-medium py-2 hover:text-primary transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      AI Chatbot
                    </Link>
                    <Link
                      href="/customize-plan"
                      className="font-medium py-2 hover:text-primary transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Plan Trip
                    </Link>
                    <Link
                      href="/reviews"
                      className="font-medium py-2 hover:text-primary transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Reviews
                    </Link>
                  </>
                ) : (
                  <span className="font-medium py-2 text-gray-400 cursor-not-allowed">
                    AI Features (Login Required)
                  </span>
                )}
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
                <div className="flex flex-col space-y-2 pt-2">
                  {isAuthenticated ? (
                    <>
                      <div className="flex items-center space-x-2 px-3 py-2 bg-gray-100 rounded-lg">
                        <User className="h-4 w-4" />
                        <span className="text-sm font-medium">{user?.username || user?.email}</span>
                      </div>
                      <Button variant="outline" onClick={logout} className="w-full">
                        <LogOut className="h-4 w-4 mr-2" />
                        Logout
                      </Button>
                    </>
                  ) : (
                    <>
                      <Link href="/LogIn">
                        <Button variant="outline" className="w-full">Log In</Button>
                      </Link>
                      <Link href="/signup">
                        <Button className="w-full">Sign Up</Button>
                      </Link>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Hero Section */}
      <section className="section-spacing bg-gradient-to-br from-blue-50 to-indigo-50 overflow-hidden-x">
        <div className="container">
          <div className="hero-content gap-12">
            <motion.div
              className="md:w-1/2 space-y-6"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Badge className="badge-enhanced">AI-Powered Travel Planning</Badge>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-balance">
                Your Perfect Trip, <span className="text-gradient-primary">Planned by AI</span>
              </h1>
              <p className="text-lg md:text-xl text-gray-600 max-w-lg text-pretty">
                Let our advanced AI create personalized travel itineraries tailored to your preferences, budget, and
                travel style.
              </p>

              <div className="bg-white responsive-padding rounded-xl shadow-medium border border-gray-100 max-w-md">
                <div className="flex items-center space-x-2 mb-4">
                  <MapPin className="text-primary" />
                  <p className="font-medium">Where do you want to go?</p>
                </div>

                <div className="flex space-x-2">
                  <Input
                    placeholder="Enter destination"
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    className="flex-grow input-enhanced focus-ring"
                  />
                  <Button
                    className="btn-primary hover-scale"
                    onClick={() => {
                      if (destination && destinationsData[destination as keyof typeof destinationsData]) {
                        handleDestinationSelect(destination)
                      }
                    }}
                  >
                    Plan Now <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  {Object.keys(destinationsData).map((dest) => (
                    <Badge
                      key={dest}
                      variant="outline"
                      className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors hover-lift"
                      onClick={() => handleDestinationSelect(dest)}
                    >
                      {dest}
                    </Badge>
                  ))}
                </div>
              </div>
            </motion.div>

            <motion.div
              className="md:w-1/2 floating-element"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="relative">
                <div className="absolute -top-6 -left-6 w-64 h-64 bg-primary/10 rounded-full blur-3xl"></div>
                <div className="absolute -bottom-10 -right-10 w-72 h-72 bg-blue-400/10 rounded-full blur-3xl"></div>

                <div className="relative bg-white rounded-2xl shadow-strong overflow-hidden border border-gray-100 demo-container">
                  <img
                    src={selectedDestination?.image || "/placeholder.svg?height=400&width=600&text=Select+Destination"}
                    alt={destination || "AI Trip Planning"}
                    className="w-full h-64 object-cover transition-all duration-500"
                  />

                  <div className="p-6">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="font-bold text-lg">{destination || "Your Adventure"}</h3>
                      <Badge>7 Days</Badge>
                    </div>

                    <div className="space-y-3">
                      <motion.div
                        className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50"
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

                      <motion.div
                        className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50"
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

                      {selectedDestination ? (
                        <motion.div
                          className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50"
                          whileHover={{ x: 5 }}
                        >
                          <div className="bg-purple-100 p-2 rounded-full">
                            {selectedDestination.activities[0].icon || <Camera className="h-4 w-4 text-purple-600" />}
                          </div>
                          <div>
                            <p className="text-sm font-medium">Visit {selectedDestination.activities[0].name}</p>
                            <p className="text-xs text-gray-500">
                              {selectedDestination.activities[0].type} - {selectedDestination.activities[0].duration}
                            </p>
                          </div>
                        </motion.div>
                      ) : (
                        <motion.div
                          className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50"
                          whileHover={{ x: 5 }}
                        >
                          <div className="bg-purple-100 p-2 rounded-full">
                            <Camera className="h-4 w-4 text-purple-600" />
                          </div>
                          <div>
                            <p className="text-sm font-medium">Popular Attractions</p>
                            <p className="text-xs text-gray-500">Top-rated experiences</p>
                          </div>
                        </motion.div>
                      )}
                    </div>

                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-sm text-gray-500">Estimated Budget</p>
                          <p className="font-bold">{selectedDestination?.budget || "$2,000 - $3,500"}</p>
                        </div>
                        <Link href="/customize-plan" passHref>
                          <Button size="sm">View & Customize Plan</Button>
                        </Link>
                      </div>
                    </div>
                    <Link href="/customize-plan" passHref>
                      <Button className="mt-4 w-full">
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

            <div className="bg-gray-100 p-8 rounded-lg text-center">
              <p className="text-gray-600">Trip diagram for {destination} will be displayed here</p>
            </div>
          </div>
        </section>
      )}

      {/* Features Section */}
      <section id="features" className="section-spacing bg-white">
        <div className="container">
          <div className="center-content-column mb-16">
            <Badge className="badge-enhanced mb-4">Features</Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-balance">Smart Travel Planning with AI</h2>
            <p className="text-lg text-gray-600 max-w-2xl text-center text-pretty">
              Our AI-powered platform takes the stress out of travel planning with intelligent features designed to
              create your perfect trip.
            </p>
          </div>

          <motion.div
            className="features-grid"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className="feature-card hover-lift animate-fade-in"
                variants={itemVariants}
              >
                <div className="mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-gray-600 flex-grow">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="section-spacing bg-gray-50">
        <div className="container">
          <div className="center-content-column mb-16">
            <Badge className="badge-enhanced mb-4">How It Works</Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-balance">Plan Your Trip in 3 Simple Steps</h2>
            <p className="text-lg text-gray-600 max-w-2xl text-center text-pretty">
              Our AI makes travel planning effortless. Just tell us what you like, and we'll handle the rest.
            </p>
          </div>

          <div className="steps-container max-w-6xl mx-auto">
            <motion.div
              className="step-item"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true, margin: "-100px" }}
            >
              <div className="step-number">1</div>
              <div className="bg-white rounded-xl responsive-padding shadow-medium border border-gray-100 h-full hover-lift">
                <h3 className="text-xl font-bold mb-4">Share Your Preferences</h3>
                <p className="text-gray-600 text-pretty">
                  Tell us about your travel style, interests, budget, and any specific requirements you have.
                </p>
              </div>
            </motion.div>

            <motion.div
              className="step-item"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true, margin: "-100px" }}
            >
              <div className="step-number">2</div>
              <div className="bg-white rounded-xl responsive-padding shadow-medium border border-gray-100 h-full hover-lift">
                <h3 className="text-xl font-bold mb-4">AI Creates Your Itinerary</h3>
                <p className="text-gray-600 text-pretty">
                  Our AI analyzes thousands of options to create a personalized travel plan just for you.
                </p>
              </div>
            </motion.div>

            <motion.div
              className="step-item"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              viewport={{ once: true, margin: "-100px" }}
            >
              <div className="step-number">3</div>
              <div className="bg-white rounded-xl responsive-padding shadow-medium border border-gray-100 h-full hover-lift">
                <h3 className="text-xl font-bold mb-4">Customize & Book</h3>
                <p className="text-gray-600 text-pretty">
                  Review your plan, make any adjustments, and book all your reservations in one place.
                </p>
              </div>
            </motion.div>
          </div>

          <div className="mt-16 center-content">
            <Button className="btn-primary hover-scale" size="lg">
              Start Planning Now <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>

      {/* Demo Section */}
      <section className="section-spacing bg-white overflow-hidden-x">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <motion.div
              className="lg:w-1/2"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true, margin: "-100px" }}
            >
              <Badge className="mb-4">AI in Action</Badge>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">See How Our AI Creates the Perfect Trip</h2>
              <p className="text-lg text-gray-600 mb-8">
                Watch as our AI transforms your preferences into a detailed travel plan in seconds, complete with
                accommodations, activities, and dining recommendations.
              </p>

              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="bg-green-100 p-2 rounded-full mt-1">
                    <svg className="h-4 w-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium">Personalized Recommendations</p>
                    <p className="text-sm text-gray-600">Tailored suggestions based on your unique preferences</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="bg-green-100 p-2 rounded-full mt-1">
                    <svg className="h-4 w-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium">Time-Optimized Itineraries</p>
                    <p className="text-sm text-gray-600">Efficiently planned schedules that maximize your experience</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="bg-green-100 p-2 rounded-full mt-1">
                    <svg className="h-4 w-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium">Budget Management</p>
                    <p className="text-sm text-gray-600">Stay within your budget with smart financial planning</p>
                  </div>
                </div>
              </div>

              <div className="mt-8">
                <Button size="lg" variant="outline">
                  Watch Demo{" "}
                  <svg className="ml-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </Button>
              </div>
            </motion.div>

            <motion.div
              className="lg:w-1/2"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true, margin: "-100px" }}
            >
              <div className="relative">
                <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-gradient-to-br from-primary/20 to-blue-400/20 rounded-full blur-3xl"></div>

                <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
                  <div className="bg-gray-800 p-3 flex items-center space-x-2">
                    <div className="flex space-x-1">
                      <div className="w-3 h-3 rounded-full bg-red-500"></div>
                      <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                      <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    </div>
                    <div className="text-gray-400 text-xs">TripAI Planner</div>
                  </div>

                  <div className="p-6">
                    <div className="flex items-start space-x-3 mb-6">
                      <div className="bg-primary/10 p-3 rounded-full">
                        <MessageSquare className="h-6 w-6 text-primary" />
                      </div>
                      <div className="bg-gray-100 rounded-2xl rounded-tl-none p-4 text-sm">
                        I'd like to plan a 5-day trip to Barcelona in June. I'm interested in architecture, local
                        cuisine, and some beach time. My budget is around $2000.
                      </div>
                    </div>

                    <motion.div
                      className="flex items-start space-x-3"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 1 }}
                    >
                      <div className="bg-blue-100 p-3 rounded-full">
                        <Compass className="h-6 w-6 text-blue-600" />
                      </div>
                      <div className="bg-blue-50 rounded-2xl rounded-tl-none p-4 text-sm">
                        <p className="mb-3">
                          I've created a 5-day Barcelona itinerary focused on architecture, cuisine, and beach time
                          within your $2000 budget:
                        </p>

                        <div className="space-y-2">
                          <p className="font-medium">Day 1: Arrival & Gothic Quarter</p>
                          <ul className="text-xs space-y-1 ml-4 list-disc">
                            <li>Morning: Check-in at Hotel Gaudi ($120/night)</li>
                            <li>Afternoon: Walking tour of Gothic Quarter</li>
                            <li>Evening: Tapas dinner at El Xampanyet</li>
                          </ul>
                        </div>

                        <div className="mt-3">
                          <Button size="sm" variant="outline" className="text-xs">
                            View Full 5-Day Itinerary
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  </div>
                </div>
              </div>
            </motion.div>
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
                    src={testimonials[currentTestimonial].avatar || "/placeholder.svg"}
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
            <motion.div
              className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true, margin: "-100px" }}
            >
              <div className="text-center mb-6">
                <h3 className="text-xl font-bold mb-2">Basic</h3>
                <div className="text-3xl font-bold mb-1">$9.99</div>
                <p className="text-sm text-gray-500">per month</p>
              </div>

              <ul className="space-y-3 mb-6">
                <li className="flex items-center space-x-3">
                  <svg className="h-5 w-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>3 AI trip plans per month</span>
                </li>
                <li className="flex items-center space-x-3">
                  <svg className="h-5 w-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Basic recommendations</span>
                </li>
                <li className="flex items-center space-x-3">
                  <svg className="h-5 w-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Email support</span>
                </li>
              </ul>

              <Button className="w-full" variant="outline">
                Get Started
              </Button>
            </motion.div>

            <motion.div
              className="bg-white rounded-xl p-6 shadow-lg border-2 border-primary relative"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true, margin: "-100px" }}
            >
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-white px-4 py-1 rounded-full text-sm font-medium">
                Most Popular
              </div>

              <div className="text-center mb-6 pt-2">
                <h3 className="text-xl font-bold mb-2">Premium</h3>
                <div className="text-3xl font-bold mb-1">$19.99</div>
                <p className="text-sm text-gray-500">per month</p>
              </div>

              <ul className="space-y-3 mb-6">
                <li className="flex items-center space-x-3">
                  <svg className="h-5 w-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Unlimited trip plans</span>
                </li>
                <li className="flex items-center space-x-3">
                  <svg className="h-5 w-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Advanced personalization</span>
                </li>
                <li className="flex items-center space-x-3">
                  <svg className="h-5 w-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Priority support</span>
                </li>
                <li className="flex items-center space-x-3">
                  <svg className="h-5 w-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Booking assistance</span>
                </li>
              </ul>

              <Button className="w-full">Get Started</Button>
            </motion.div>

            <motion.div
              className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              viewport={{ once: true, margin: "-100px" }}
            >
              <div className="text-center mb-6">
                <h3 className="text-xl font-bold mb-2">Business</h3>
                <div className="text-3xl font-bold mb-1">$49.99</div>
                <p className="text-sm text-gray-500">per month</p>
              </div>

              <ul className="space-y-3 mb-6">
                <li className="flex items-center space-x-3">
                  <svg className="h-5 w-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Unlimited trip plans</span>
                </li>
                <li className="flex items-center space-x-3">
                  <svg className="h-5 w-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Team collaboration</span>
                </li>
                <li className="flex items-center space-x-3">
                  <svg className="h-5 w-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Dedicated account manager</span>
                </li>
                <li className="flex items-center space-x-3">
                  <svg className="h-5 w-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>API access</span>
                </li>
              </ul>

              <Button className="w-full" variant="outline">
                Contact Sales
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-primary/90 to-blue-600/90 text-white">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true, margin: "-100px" }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Transform Your Travel Experience?</h2>
            <p className="text-lg text-white/80 max-w-2xl mx-auto mb-8">
              Join thousands of travelers who have discovered the power of AI-driven trip planning. Your perfect adventure
              awaits.
            </p>

            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button size="lg" variant="secondary">
                Start Planning for Free
              </Button>
              <Button size="lg" variant="outline" className="bg-transparent text-white border-white hover:bg-white/10">
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
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.203 0-4.007 1.797-4.007 4.007 0 2.21 1.797 4.007 4.007 4.007 2.21 0 4.007-1.797 4.007-4.007 0-2.21-1.797-4.007-4.007-4.007z" />
                  </svg>
                </a>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-medium mb-4">Company</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#">About Us</a>
                </li>
                <li>
                  <a href="#">Careers</a>
                </li>
                <li>
                  <a href="#">Contact Us</a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-medium mb-4">Legal</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#">Terms of Service</a>
                </li>
                <li>
                  <a href="#">Privacy Policy</a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-medium mb-4">Social</h3>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
          <p className="text-center text-sm text-gray-400 mt-8">
            &copy; {new Date().getFullYear()} TripAI. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}