"use client";

import { Send, X, Luggage, Plane, MapPin, Hotel, Sparkles, Wand2, Plus, Clock, Mic, MicOff } from "lucide-react";
import { useState, useEffect, useRef } from "react";

type Message = {
    text: string;
    sender: "user" | "ai";
    modelUsed?: string;
};

type ChatHistory = {
    id: string;
    title: string;
    lastMessage: string;
    timestamp: Date;
};

export default function SmartAITravelChatbot() {
    const [isOpen, setIsOpen] = useState(true);
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [showHistory, setShowHistory] = useState(false);
    const [chatHistories, setChatHistories] = useState<ChatHistory[]>([]);
    const [currentChatId, setCurrentChatId] = useState<string | null>(null);
    const [isListening, setIsListening] = useState(false);
    const [speechSupported, setSpeechSupported] = useState(true);
    const [micPermissionDenied, setMicPermissionDenied] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const recognitionRef = useRef<any>(null);

    // Dynamic gradient colors
    const gradients = [
        "from-purple-600 via-pink-600 to-blue-600",
        "from-emerald-600 via-teal-600 to-sky-600",
        "from-amber-600 via-orange-600 to-red-600",
        "from-fuchsia-600 via-purple-600 to-indigo-600"
    ];
    const [currentGradient, setCurrentGradient] = useState(gradients[0]);

    // Check for URL parameters and localStorage data
    useEffect(() => {
        const checkForTripSummary = async () => {
            // Check if we're coming from the customize-plan page
            if (typeof window !== 'undefined') {
                const urlParams = new URLSearchParams(window.location.search);
                const queryParam = urlParams.get('query');
                const fromCustomize = urlParams.get('fromCustomize');

                // Check for trip summary in localStorage
                const tripSummaryText = localStorage.getItem('tripSummaryText');
                const tripQuery = localStorage.getItem('tripQuery');
                const oneLine = localStorage.getItem('tripOneLine');

                // Case 1: Coming from customize-plan with query parameter
                if (queryParam && fromCustomize === 'true') {
                    // Get the trip summary from localStorage
                    const tripSummaryJson = localStorage.getItem('tripSummaryObject');

                    if (tripSummaryJson && tripQuery) {
                        try {
                            const tripSummary = JSON.parse(tripSummaryJson);

                            // Add the one-line summary and user's query to messages
                            const initialMessages: Message[] = [];

                            // If we have a one-line summary, add it as a system message
                            if (oneLine) {
                                initialMessages.push({
                                    text: `📋 Trip Summary: ${oneLine}`,
                                    sender: "ai", // Must be "user" or "ai" to match the Message type
                                    modelUsed: "system"
                                });
                            }

                            // Add the user's query
                            initialMessages.push({
                                text: tripQuery,
                                sender: "user"
                            });

                            setMessages(initialMessages);

                            // Set loading state
                            setIsLoading(true);

                            // Process the trip summary with the AI
                            try {
                                // For customize-plan queries, use Groq API directly
                                const response = await fetch('http://localhost:8000/chat', {
                                    method: 'POST',
                                    headers: {
                                        'Content-Type': 'application/json',
                                    },
                                    body: JSON.stringify({
                                        message: tripSummaryText || tripQuery,
                                        chat_history: [],
                                        use_groq: true  // Signal the backend to use Groq specifically
                                    }),
                                });

                                if (response.ok) {
                                    const data = await response.json();
                                    // Prepare the updated messages array
                                    const updatedMessages: Message[] = [...initialMessages]; // Start with the initial messages (including summary)

                                    // Add the AI response
                                    updatedMessages.push({
                                        text: data.response,
                                        sender: "ai",
                                        modelUsed: data.model_used || "api"
                                    });

                                    setMessages(updatedMessages);

                                    // Create a new chat history entry with the one-line summary as the title
                                    const newChatId = Date.now().toString();
                                    setCurrentChatId(newChatId);
                                    setChatHistories(prev => [{
                                        id: newChatId,
                                        title: oneLine || `Trip to ${tripSummary.destination}`,
                                        lastMessage: data.response.substring(0, 50) + (data.response.length > 50 ? "..." : ""),
                                        timestamp: new Date()
                                    }, ...prev]);
                                } else {
                                    throw new Error('Failed to get AI response');
                                }
                            } catch (error) {
                                console.error('Error processing trip summary:', error);
                                setMessages([
                                    {
                                        text: tripQuery,
                                        sender: "user"
                                    },
                                    {
                                        text: "I'm having trouble processing your trip plan. Let me help you manually. What would you like to know about your trip to " + tripSummary.destination + "?",
                                        sender: "ai",
                                        modelUsed: "error"
                                    }
                                ]);
                            }

                            setIsLoading(false);
                            return; // Skip the initial greeting
                        } catch (error) {
                            console.error('Error parsing trip summary:', error);
                        }
                    }
                }
                // Case 2: Manual navigation with trip summary in localStorage
                // Only show this if we're coming from the customize-plan page (check flag)
                else if (tripSummaryText && !queryParam && messages.length === 0 &&
                    typeof window !== 'undefined' &&
                    localStorage.getItem('fromCustomizePlan') === 'true') {
                    // Show a message to the user that they can paste their summary
                    setInput(tripSummaryText);

                    // Add a helpful system message
                    setMessages([{
                        text: "I see you have a trip summary ready! You can edit it if needed, then press Enter or click Send to get personalized recommendations.",
                        sender: "ai",
                        modelUsed: "system"
                    }]);

                    return; // Skip the initial greeting
                }
            }

            // If we're not coming from customize-plan or there was an error, show the initial greeting
            if (messages.length === 0 && !currentChatId) {
                try {
                    let welcomeMessage = "✈️ Welcome to SmartAI Travel!\n\nI can help with:\n• Flight bookings & deals\n• Hotel recommendations\n• Travel itineraries\n• Local attractions\n• Weather forecasts\n\nWhere would you like to go today?";
                    let modelUsed = "default";

                    try {
                        const response = await fetch('http://localhost:8000/chat', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({
                                message: 'Hello, introduce yourself as SmartAI Travel Assistant',
                                chat_history: []
                            }),
                        });

                        if (response.ok) {
                            const data = await response.json();
                            if (data.response) {
                                welcomeMessage = data.response;
                                modelUsed = data.model_used || "api";
                            }
                        }
                    } catch (error) {
                        console.error('Error fetching initial greeting:', error);
                        // Try fallback to port 8001 if 8000 fails
                        try {
                            const fallbackResponse = await fetch('http://localhost:8001/chat', {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json',
                                },
                                body: JSON.stringify({
                                    message: 'Hello, introduce yourself as SmartAI Travel Assistant',
                                    chat_history: []
                                }),
                            });

                            if (fallbackResponse.ok) {
                                const data = await fallbackResponse.json();
                                if (data.response) {
                                    welcomeMessage = data.response;
                                    modelUsed = data.model_used || "fallback_api";
                                }
                            }
                        } catch (fallbackError) {
                            console.error('Error fetching from fallback API:', fallbackError);
                        }
                    }

                    // Apply typing effect
                    let i = 0;
                    const typingEffect = setInterval(() => {
                        if (i <= welcomeMessage.length) {
                            setMessages([{
                                text: welcomeMessage.substring(0, i),
                                sender: "ai",
                                modelUsed: modelUsed
                            }]);
                            i++;
                        } else {
                            clearInterval(typingEffect);
                        }
                    }, 20);

                    return () => clearInterval(typingEffect);
                } catch (error) {
                    console.error('Error in initial greeting setup:', error);
                    setMessages([{
                        text: "✈️ Welcome to SmartAI Travel!\n\nI can help with:\n• Flight bookings & deals\n• Hotel recommendations\n• Travel itineraries\n• Local attractions\n• Weather forecasts\n\nWhere would you like to go today?",
                        sender: "ai",
                        modelUsed: "error"
                    }]);
                }
            }
        };

        checkForTripSummary();
    }, [currentChatId, messages.length]);

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

    // Check if browser supports speech recognition
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

            if (!SpeechRecognition) {
                setSpeechSupported(false);
                console.warn('Speech recognition not supported in this browser');
            }
        }

        // Cleanup function to ensure speech recognition is stopped when component unmounts
        return () => {
            if (recognitionRef.current) {
                try {
                    recognitionRef.current.stop();
                    recognitionRef.current = null;
                } catch (error) {
                    console.error('Error stopping speech recognition during cleanup:', error);
                }
            }
        };
    }, []);

    // Clear the customize plan flag when component unmounts
    useEffect(() => {
        return () => {
            if (typeof window !== 'undefined') {
                localStorage.removeItem('fromCustomizePlan');
            }
        };
    }, []);

    // Auto-scroll with smooth behavior
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({
            behavior: messages.length > 3 ? "smooth" : "auto",
            block: "end"
        });
    }, [messages]);

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (input.trim() === "") return;

        const userMessage: Message = { text: input, sender: "user" };
        const updatedMessages = [...messages, userMessage];
        setMessages(updatedMessages);
        setInput("");
        setIsLoading(true);

        try {
            const response = await fetch('http://localhost:8000/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    message: input,
                    chat_history: messages.map(msg => ({
                        text: msg.text,
                        sender: msg.sender
                    }))
                }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            const aiMessage: Message = {
                text: data.response,
                sender: "ai",
                modelUsed: data.model_used
            };

            setMessages([...updatedMessages, aiMessage]);

            // Update chat history if this is a new chat
            if (!currentChatId) {
                const newChatId = Date.now().toString();
                setCurrentChatId(newChatId);
                setChatHistories(prev => [{
                    id: newChatId,
                    title: input.substring(0, 30) + (input.length > 30 ? "..." : ""),
                    lastMessage: aiMessage.text.substring(0, 50) + (aiMessage.text.length > 50 ? "..." : ""),
                    timestamp: new Date()
                }, ...prev]);
            } else {
                // Update existing chat history
                setChatHistories(prev => prev.map(chat =>
                    chat.id === currentChatId
                        ? {
                            ...chat,
                            lastMessage: aiMessage.text.substring(0, 50) + (aiMessage.text.length > 50 ? "..." : ""),
                            timestamp: new Date()
                        }
                        : chat
                ));
            }

            setCurrentGradient(gradients[Math.floor(Math.random() * gradients.length)]);

            // Clear the customize plan flag after successfully sending a message
            if (typeof window !== 'undefined') {
                localStorage.removeItem('fromCustomizePlan');
            }

        } catch (error) {
            console.error('Error:', error);
            setMessages(prev => [...prev, {
                text: "Sorry, I'm having trouble connecting to the AI service. Please try again later.",
                sender: "ai",
                modelUsed: "error"
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    const startNewChat = () => {
        setMessages([]);
        setCurrentChatId(null);
        setShowHistory(false);

        // Clear the customize plan flag
        if (typeof window !== 'undefined') {
            localStorage.removeItem('fromCustomizePlan');
        }
    };

    const toggleSpeechRecognition = async () => {
        if (isListening) {
            // Stop listening
            if (recognitionRef.current) {
                try {
                    recognitionRef.current.stop();
                } catch (error) {
                    console.error('Error stopping speech recognition:', error);
                }
                // Clear the reference to allow for a fresh instance next time
                recognitionRef.current = null;
            }
            setIsListening(false);
        } else {
            // Reset permission denied state when trying again
            if (micPermissionDenied) {
                setMicPermissionDenied(false);
            }

            // Check if we need to request microphone permission first
            if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
                try {
                    // Request microphone permission explicitly before starting speech recognition
                    await navigator.mediaDevices.getUserMedia({ audio: true });

                    // Create a new instance of SpeechRecognition each time
                    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
                    if (SpeechRecognition) {
                        // Clean up any existing instance
                        if (recognitionRef.current) {
                            try {
                                recognitionRef.current.stop();
                            } catch (e) {
                                // Ignore errors when stopping
                            }
                        }

                        // Create a new instance
                        recognitionRef.current = new SpeechRecognition();
                        recognitionRef.current.continuous = true;
                        recognitionRef.current.interimResults = true;
                        recognitionRef.current.lang = 'en-US';

                        // Set up event handlers
                        recognitionRef.current.onresult = (event: any) => {
                            const transcript = Array.from(event.results)
                                .map((result: any) => result[0])
                                .map((result: any) => result.transcript)
                                .join('');

                            setInput(transcript);

                            // If this is a final result, auto-submit after a short delay
                            const isFinal = event.results[0].isFinal;
                            if (isFinal && transcript.trim().length > 0) {
                                // Stop listening
                                setTimeout(() => {
                                    if (recognitionRef.current) {
                                        try {
                                            recognitionRef.current.stop();
                                            // Clear the reference
                                            recognitionRef.current = null;
                                        } catch (e) {
                                            // Ignore errors when stopping
                                        }
                                        setIsListening(false);

                                        // Auto-submit the form after stopping recognition
                                        setTimeout(() => {
                                            document.querySelector('form')?.dispatchEvent(new Event('submit'));
                                        }, 500);
                                    }
                                }, 1000);
                            }
                        };

                        recognitionRef.current.onerror = (event: any) => {
                            console.error('Speech recognition error', event.error);

                            // Handle specific error types
                            if (event.error === 'not-allowed') {
                                setMicPermissionDenied(true);
                                // Add a message to inform the user about the permission issue
                                setMessages(prev => [...prev, {
                                    text: "Microphone access was denied. Please allow microphone access in your browser settings to use voice input.",
                                    sender: "ai",
                                    modelUsed: "error"
                                }]);
                            }

                            setIsListening(false);
                            // Clear the reference on error
                            recognitionRef.current = null;
                        };

                        recognitionRef.current.onend = () => {
                            console.log('Speech recognition ended');
                            // Don't automatically restart - this was causing issues
                            setIsListening(false);
                        };

                        // Start the recognition
                        try {
                            recognitionRef.current.start();
                            setIsListening(true);
                        } catch (error) {
                            console.error('Error starting speech recognition:', error);
                            setIsListening(false);
                            recognitionRef.current = null;
                        }
                    } else {
                        setSpeechSupported(false);
                    }
                } catch (permissionError) {
                    console.error('Microphone permission denied:', permissionError);
                    setMicPermissionDenied(true);
                    setMessages(prev => [...prev, {
                        text: "Microphone access was denied. Please allow microphone access in your browser settings to use voice input.",
                        sender: "ai",
                        modelUsed: "error"
                    }]);
                }
            } else {
                // Fallback for browsers that don't support getUserMedia
                setSpeechSupported(false);
                setMessages(prev => [...prev, {
                    text: "Your browser doesn't support microphone access. Please try using a modern browser like Chrome or Edge.",
                    sender: "ai",
                    modelUsed: "error"
                }]);
            }
        }
    };

    const loadChatHistory = (chatId: string) => {
        // In a real app, you would fetch the full chat history from your database
        // For this example, we'll just set a placeholder message
        setMessages([{
            text: `Loading your previous conversation about "${chatHistories.find(c => c.id === chatId)?.title}"...`,
            sender: "ai"
        }]);
        setCurrentChatId(chatId);
        setShowHistory(false);
    };

    // Quick action buttons with hover effects
    const quickActions = [
        { icon: <Plane className="group-hover:rotate-12 transition-transform" />, text: "Flights", query: "Find flights to New York next week" },
        { icon: <Hotel className="group-hover:scale-110 transition-transform" />, text: "Hotels", query: "Show me hotels in Tokyo under $200/night" },
        { icon: <MapPin className="group-hover:rotate-6 transition-transform" />, text: "Attractions", query: "What are the top attractions in Paris?" },
        { icon: <Luggage className="group-hover:translate-y-1 transition-transform" />, text: "Packing", query: "What should I pack for a week in Bali?" }
    ];

    if (!isOpen) {
        return (
            <div
                onClick={() => setIsOpen(true)}
                className="fixed inset-0 m-auto z-50 w-fit h-fit bg-gradient-to-r from-purple-600 to-blue-500 text-white p-6 rounded-2xl cursor-pointer hover:shadow-2xl transition-all duration-300 shadow-lg backdrop-blur-sm bg-opacity-90 border border-white/10 flex items-center justify-center"
            >
                <div className="flex items-center space-x-4 animate-pulse">
                    <Wand2 className="h-8 w-8" />
                    <span className="text-xl font-medium">SmartAI Travel</span>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
            {/* Main chat container */}
            <div className="w-full max-w-4xl h-[90vh] flex rounded-2xl overflow-hidden bg-white shadow-2xl relative">
                {/* Sidebar for chat history */}
                {showHistory && (
                    <div className="w-64 bg-gray-50 border-r border-gray-200 flex flex-col">
                        <div className="p-4 border-b border-gray-200">
                            <h2 className="text-lg font-semibold text-gray-800">Chat History</h2>
                        </div>
                        <div className="flex-1 overflow-y-auto">
                            <button
                                onClick={startNewChat}
                                className="w-full flex items-center space-x-2 p-3 text-sm font-medium text-blue-600 hover:bg-blue-50 transition-colors"
                            >
                                <Plus className="h-4 w-4" />
                                <span>New Chat</span>
                            </button>
                            {chatHistories.map(chat => (
                                <button
                                    key={chat.id}
                                    onClick={() => loadChatHistory(chat.id)}
                                    className={`w-full text-left p-3 text-sm border-b border-gray-100 hover:bg-gray-100 transition-colors ${currentChatId === chat.id ? 'bg-blue-50' : ''}`}
                                >
                                    <div className="font-medium text-gray-800 truncate">{chat.title}</div>
                                    <div className="text-xs text-gray-500 truncate">{chat.lastMessage}</div>
                                    <div className="text-xs text-gray-400 mt-1 flex items-center">
                                        <Clock className="h-3 w-3 mr-1" />
                                        {chat.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </div>
                                </button>
                            ))}
                            {chatHistories.length === 0 && (
                                <div className="p-4 text-sm text-gray-500 text-center">
                                    No previous chats found
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Chat area */}
                <div className="flex-1 flex flex-col">
                    {/* Header with dynamic gradient */}
                    <div
                        className={`bg-gradient-to-r ${currentGradient} p-4 text-white flex justify-between items-center transition-all duration-1000`}
                    >
                        <div className="flex items-center space-x-3">
                            <button
                                onClick={() => setShowHistory(!showHistory)}
                                className="p-2 rounded-xl hover:bg-white/20 transition"
                            >
                                <Clock className="h-5 w-5" />
                            </button>
                            <div>
                                <h3 className="font-bold text-lg">SmartAI Travel</h3>
                                <p className="text-sm opacity-90 font-light">Your intelligent travel assistant</p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-2">
                            <button
                                onClick={startNewChat}
                                className="p-1.5 rounded-lg hover:bg-white/20 transition"
                                title="New Chat"
                            >
                                <Plus className="h-5 w-5" />
                            </button>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="p-1.5 rounded-lg hover:bg-white/20 transition"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>
                    </div>

                    {/* Messages container */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
                        {messages.map((msg, index) => (
                            <div
                                key={index}
                                className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"} animate-fade-in`}
                            >
                                <div
                                    className={`max-w-[85%] rounded-2xl px-4 py-3 ${msg.sender === "user"
                                        ? `bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg rounded-br-none`
                                        : "bg-white text-gray-800 border border-gray-200 shadow-sm rounded-bl-none"}`}
                                >
                                    {msg.text.split('\n').map((line, i) => (
                                        <p key={i} className="py-1">{line}</p>
                                    ))}
                                    {msg.sender === "ai" && msg.modelUsed && (
                                        <div className="mt-2 text-xs text-gray-500 italic flex items-center">
                                            <Sparkles className="h-3 w-3 mr-1" />
                                            {msg.modelUsed === "huggingface_api_error" || msg.modelUsed === "error" ?
                                                "Error: API issue" :
                                                msg.modelUsed.includes("groq") ?
                                                    `Model: Groq ${msg.modelUsed.split('/').pop()}` :
                                                    msg.modelUsed.includes("huggingface") || msg.modelUsed.includes("mistralai") ?
                                                        `Model: Hugging Face ${msg.modelUsed.split('/').pop()}` :
                                                        `Model: ${msg.modelUsed.split('/').pop()}`
                                            }
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}

                        {isLoading && (
                            <div className="flex justify-start">
                                <div className="bg-white text-gray-800 border border-gray-200 rounded-2xl rounded-bl-none px-4 py-3 shadow-sm max-w-[85%]">
                                    <div className="flex items-center space-x-2">
                                        <div className="flex space-x-1.5">
                                            <div className="w-2.5 h-2.5 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 animate-bounce"></div>
                                            <div className="w-2.5 h-2.5 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                                            <div className="w-2.5 h-2.5 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 animate-bounce" style={{ animationDelay: "0.4s" }}></div>
                                        </div>
                                        <span className="text-sm font-medium text-gray-600">Planning your trip...</span>
                                    </div>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Quick actions */}
                    <div className="px-4 pt-3 pb-2 bg-white border-t border-gray-200">
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

                    {/* Input area */}
                    <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-200 bg-white">
                        <div className="relative">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                className={`w-full bg-gray-50 border ${isListening ? "border-red-400 ring-2 ring-red-300" : "border-gray-200"} rounded-xl pl-4 pr-24 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent shadow-sm transition-all duration-200 hover:border-gray-300`}
                                placeholder={isListening ? "Listening..." : "Ask about destinations, flights, or experiences..."}
                            />
                            {isListening && (
                                <div className="absolute left-3 top-3 flex space-x-1">
                                    <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                                    <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" style={{ animationDelay: "0.2s" }}></div>
                                    <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" style={{ animationDelay: "0.4s" }}></div>
                                </div>
                            )}

                            {/* Voice input button */}
                            {speechSupported && (
                                <button
                                    type="button"
                                    onClick={toggleSpeechRecognition}
                                    disabled={isLoading}
                                    className={`absolute right-14 top-2 p-2 rounded-lg hover:shadow-md transition-all duration-300 ${isListening
                                        ? "bg-red-500 text-white animate-pulse"
                                        : micPermissionDenied
                                            ? "bg-orange-400 text-white"
                                            : "bg-gray-200 text-gray-600 hover:bg-gray-300"
                                        }`}
                                    title={
                                        isListening
                                            ? "Stop listening"
                                            : micPermissionDenied
                                                ? "Microphone access denied. Click to try again."
                                                : "Start voice input"
                                    }
                                >
                                    {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                                </button>
                            )}

                            {/* Send button */}
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="absolute right-2 top-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white p-2 rounded-lg hover:shadow-md transition-all duration-300 disabled:opacity-70"
                            >
                                <Send className="h-4 w-4" />
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
