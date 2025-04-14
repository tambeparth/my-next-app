"use client";

import { Send, X, Luggage, Plane, MapPin, Hotel, Sparkles, ChevronDown, Wand2 } from "lucide-react";
import { useState, useEffect, useRef } from "react";

type Message = {
    text: string;
    sender: "user" | "ai";
};

type ChatbotSize = {
    width: string;
    height: string;
};

export default function ModernTravelChatbot() {
    const [isOpen, setIsOpen] = useState(true);
    const [isMinimized, setIsMinimized] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [size, setSize] = useState<ChatbotSize>({ width: "28rem", height: "40rem" });
    const [isResizing, setIsResizing] = useState(false);
    const resizeRef = useRef<HTMLDivElement>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Dynamic gradient colors
    const gradients = [
        "from-purple-600 via-pink-600 to-blue-600",
        "from-emerald-600 via-teal-600 to-sky-600",
        "from-amber-600 via-orange-600 to-red-600",
        "from-fuchsia-600 via-purple-600 to-indigo-600"
    ];
    const [currentGradient, setCurrentGradient] = useState(gradients[0]);

    // Initial greeting with typing effect
    useEffect(() => {
        if (messages.length === 0) {
            const welcomeMessage = "✈️ Welcome to your AI Travel Concierge!\n\nI can help with:\n• Flight bookings & deals\n• Luxury hotel finds\n• Personalized itineraries\n• Local experiences\n• Weather & packing tips\n\nWhere shall we adventure today?";

            let i = 0;
            const typingEffect = setInterval(() => {
                if (i <= welcomeMessage.length) {
                    setMessages([{ text: welcomeMessage.substring(0, i), sender: "ai" }]);
                    i++;
                } else {
                    clearInterval(typingEffect);
                }
            }, 20);

            return () => clearInterval(typingEffect);
        }
    }, []);

    // Rotate gradients periodically
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentGradient(prev => {
                const currentIndex = gradients.indexOf(prev);
                return gradients[(currentIndex + 1) % gradients.length];
            });
        }, 8000);
        return () => clearInterval(interval);
    }, []);

    // Auto-scroll with smooth behavior
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({
            behavior: messages.length > 3 ? "smooth" : "auto",
            block: "end"
        });
    }, [messages, isMinimized]);

    // Resize functionality
    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (!isResizing || !resizeRef.current) return;

            const container = resizeRef.current.parentElement;
            if (!container) return;

            const rect = container.getBoundingClientRect();
            const newWidth = Math.max(300, Math.min(800, e.clientX - rect.left));
            const newHeight = Math.max(300, Math.min(800, e.clientY - rect.top));

            setSize({
                width: `${newWidth}px`,
                height: `${newHeight}px`
            });
        };

        const handleMouseUp = () => {
            setIsResizing(false);
        };

        if (isResizing) {
            window.addEventListener('mousemove', handleMouseMove);
            window.addEventListener('mouseup', handleMouseUp);
        }

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isResizing]);

    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (input.trim() === "") return;

        const userMessage: Message = { text: input, sender: "user" };
        setMessages(prev => [...prev, userMessage]);
        setInput("");
        setIsLoading(true);

        // Simulate AI thinking with dynamic delay
        const delay = 800 + Math.random() * 1200;

        setTimeout(() => {
            const response = generateTravelResponse(input);
            setMessages(prev => [...prev, { text: response, sender: "ai" }]);
            setIsLoading(false);

            // Change gradient on response
            setCurrentGradient(gradients[Math.floor(Math.random() * gradients.length)]);
        }, delay);
    };

    const generateTravelResponse = (input: string): string => {
        const lowerInput = input.toLowerCase();
        const destinations = ["Bali", "Tokyo", "Paris", "New York", "Santorini", "Dubai"];
        const destination = destinations[Math.floor(Math.random() * destinations.length)];

        if (lowerInput.includes("flight")) {
            return `✈️ Found 3 great flight options to ${destination}:\n\n1. Premium Economy: $1,299 (20hr)\n2. Business Class: $3,499 (18hr)\n3. First Class: $5,999 (16hr)\n\nI can hold seats for 24 hours - interested?`;
        }
        else if (lowerInput.includes("hotel") || lowerInput.includes("stay")) {
            return `🏨 Luxury stays in ${destination}:\n\n• ${destination} Palace Resort - $650/night\n• Azure Sands Hotel - $420/night\n• ${destination} Boutique Villas - $880/night\n\nShall I check availability?`;
        }
        else if (lowerInput.includes("itinerary") || lowerInput.includes("plan")) {
            return `📅 3-Day ${destination} Experience:\n\nDay 1: Private city tour & Michelin dinner\nDay 2: Helicopter ride + beach club\nDay 3: Spa day & local market\n\nWant to customize this?`;
        }
        else if (lowerInput.includes("weather")) {
            return `🌤️ ${destination} Weather:\n\nNext month: 28-32°C (82-90°F)\nSunny with occasional showers\nPerfect for beach days!`;
        }
        else if (lowerInput.includes("recommend") || lowerInput.includes("do")) {
            return `🌟 Top ${destination} Experiences:\n\n• Private sunset yacht cruise\n• Underground speakeasy tour\n• Jungle waterfall trek\n• Rooftop mixology class\n\nWhich excites you most?`;
        }
        else {
            return `✨ As your luxury travel AI, I specialize in:\n\n• Curating unique experiences\n• Securing VIP access\n• Finding hidden gems\n• Personalizing every detail\n\nWhat's your dream travel scenario?`;
        }
    };

    // Quick action buttons with hover effects
    const quickActions = [
        { icon: <Plane className="group-hover:rotate-12 transition-transform" />, text: "Flights", query: "Find business class flights to Asia next month" },
        { icon: <Hotel className="group-hover:scale-110 transition-transform" />, text: "Hotels", query: "Show me 5-star beachfront resorts under $800/night" },
        { icon: <MapPin className="group-hover:rotate-6 transition-transform" />, text: "Experiences", query: "Recommend unique activities in Paris" },
        { icon: <Luggage className="group-hover:translate-y-1 transition-transform" />, text: "Packing", query: "Create a luxury packing list for a week in Dubai" }
    ];

    if (!isOpen) {
        return (
            <div
                onClick={() => setIsOpen(true)}
                className="fixed inset-0 m-auto z-50 w-fit h-fit bg-gradient-to-r from-purple-600 to-blue-500 text-white p-6 rounded-2xl cursor-pointer hover:shadow-2xl transition-all duration-300 shadow-lg backdrop-blur-sm bg-opacity-90 border border-white/10 flex items-center justify-center"
            >
                <div className="flex items-center space-x-4 animate-pulse">
                    <Wand2 className="h-8 w-8" />
                    <span className="text-xl font-medium">Travel AI Concierge</span>
                </div>
            </div>
        );
    }

    return (
        <div
            className="fixed inset-0 m-auto z-50 flex items-center justify-center"
            style={{ width: size.width, height: isMinimized ? 'auto' : size.height }}
            ref={resizeRef}
        >
            {/* Main chat container with glass morphism effect */}
            <div className={`w-full h-full flex flex-col rounded-2xl overflow-hidden backdrop-blur-lg bg-white/90 border border-white/20 shadow-2xl relative ${isMinimized ? 'bg-gradient-to-br from-gray-100 to-gray-200' : ''}`}>

                {/* Resize handle */}
                {!isMinimized && (
                    <div
                        className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize bg-gray-200 rounded-tl-lg z-10"
                        onMouseDown={() => setIsResizing(true)}
                    />
                )}

                {/* Header with dynamic gradient */}
                <div
                    className={`bg-gradient-to-r ${currentGradient} p-4 text-white flex justify-between items-center cursor-pointer transition-all duration-1000`}
                    onClick={() => setIsMinimized(!isMinimized)}
                >
                    <div className="flex items-center space-x-3">
                        <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
                            <Sparkles className="h-5 w-5" />
                        </div>
                        <div>
                            <h3 className="font-bold text-lg">AI Travel Concierge</h3>
                            <p className="text-sm opacity-90 font-light">Premium travel planning</p>
                        </div>
                    </div>
                    <div className="flex items-center space-x-2">
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                setIsOpen(false);
                            }}
                            className="p-1.5 rounded-lg hover:bg-white/20 transition"
                        >
                            <X className="h-5 w-5" />
                        </button>
                        <ChevronDown
                            className={`h-5 w-5 transition-transform duration-300 ${isMinimized ? 'rotate-180' : ''}`}
                        />
                    </div>
                </div>

                {!isMinimized && (
                    <>
                        {/* Messages container with subtle pattern */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MDAiIGhlaWdodD0iNjAwIiBvcGFjaXR5PSIwLjAzIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ3aGl0ZSIvPjxjaXJjbGUgY3g9IjMwMCIgY3k9IjMwMCIgcj0iMTAwIiBmaWxsPSJub25lIiBzdHJva2U9IiNlZWVlZWUiIHN0cm9rZS13aWR0aD0iMSIvPjwvc3ZnPg==')]">
                            {messages.map((msg, index) => (
                                <div
                                    key={index}
                                    className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"} animate-fade-in`}
                                >
                                    <div
                                        className={`max-w-[85%] rounded-2xl px-4 py-3 backdrop-blur-sm ${msg.sender === "user"
                                            ? `bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg rounded-br-none`
                                            : "bg-white/80 text-gray-800 border border-gray-100 shadow-sm rounded-bl-none"}`}
                                    >
                                        {msg.text.split('\n').map((line, i) => (
                                            <p key={i} className="py-1">{line}</p>
                                        ))}
                                    </div>
                                </div>
                            ))}

                            {isLoading && (
                                <div className="flex justify-start">
                                    <div className="bg-white/80 backdrop-blur-sm text-gray-800 border border-gray-100 rounded-2xl rounded-bl-none px-4 py-3 shadow-sm max-w-[85%]">
                                        <div className="flex items-center space-x-2">
                                            <div className="flex space-x-1.5">
                                                <div className="w-2.5 h-2.5 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 animate-bounce"></div>
                                                <div className="w-2.5 h-2.5 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                                                <div className="w-2.5 h-2.5 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 animate-bounce" style={{ animationDelay: "0.4s" }}></div>
                                            </div>
                                            <span className="text-sm font-medium text-gray-600">Crafting your perfect travel plan...</span>
                                        </div>
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Quick actions with hover animations */}
                        <div className="px-4 pt-3 pb-2 bg-white/50 border-t border-gray-100">
                            <div className="flex flex-wrap gap-2">
                                {quickActions.map((action, index) => (
                                    <button
                                        key={index}
                                        onClick={() => {
                                            setInput(action.query);
                                            setTimeout(() => document.querySelector('form')?.dispatchEvent(new Event('submit')), 100);
                                        }}
                                        className="group flex items-center space-x-2 bg-white text-gray-800 text-sm font-medium px-3.5 py-2 rounded-xl border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all duration-300"
                                    >
                                        {action.icon}
                                        <span>{action.text}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Input area with floating label effect */}
                        <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-100 bg-white/70 backdrop-blur-sm">
                            <div className="relative">
                                <input
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    className="w-full bg-white/90 border border-gray-200 rounded-xl pl-4 pr-12 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent shadow-sm transition-all duration-200 hover:border-gray-300"
                                    placeholder=" "
                                />
                                <label
                                    className={`absolute left-4 transition-all duration-200 pointer-events-none ${input ? 'top-1 text-xs text-blue-500' : 'top-3.5 text-sm text-gray-400'}`}
                                >
                                    Ask about destinations, flights, or experiences...
                                </label>
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="absolute right-2 top-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white p-2 rounded-lg hover:shadow-md transition-all duration-300 disabled:opacity-70"
                                >
                                    <Send className="h-4 w-4" />
                                </button>
                            </div>
                        </form>
                    </>
                )}
            </div>
        </div>
    );
}