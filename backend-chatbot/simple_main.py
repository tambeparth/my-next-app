from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict, Optional
import random

app = FastAPI(title="Smart.AI Travel API", description="Travel chatbot API using simpler implementation")

# CORS configuration to allow requests from your Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Travel destinations data
destinations = [
  {
    "name": "Bali",
    "attractions": ["Sacred Monkey Forest", "Ubud Art Market", "Tegallalang Rice Terraces", "Uluwatu Temple"],
    "hotels": ["Four Seasons Resort Bali", "The Laguna Resort & Spa", "Padma Resort Ubud"],
    "weather": "Tropical climate, 26-33°C year-round"
  },
  {
    "name": "Tokyo",
    "attractions": ["Tokyo Skytree", "Senso-ji Temple", "Meiji Shrine", "Shibuya Crossing"],
    "hotels": ["Park Hyatt Tokyo", "The Ritz-Carlton Tokyo", "Mandarin Oriental Tokyo"],
    "weather": "Four distinct seasons, 5-31°C depending on season"
  },
  {
    "name": "Paris",
    "attractions": ["Eiffel Tower", "Louvre Museum", "Notre-Dame Cathedral", "Montmartre"],
    "hotels": ["Four Seasons Hotel George V", "The Peninsula Paris", "Le Meurice"],
    "weather": "Mild climate, 3-25°C depending on season"
  },
  {
    "name": "New York",
    "attractions": ["Central Park", "Empire State Building", "Statue of Liberty", "Times Square"],
    "hotels": ["The Plaza", "The St. Regis New York", "Four Seasons Hotel New York"],
    "weather": "Four distinct seasons, -3 to 30°C depending on season"
  },
  {
    "name": "Dubai",
    "attractions": ["Burj Khalifa", "Dubai Mall", "Palm Jumeirah", "Dubai Fountain"],
    "hotels": ["Burj Al Arab Jumeirah", "Atlantis, The Palm", "One&Only Royal Mirage"],
    "weather": "Hot desert climate, 20-45°C depending on season"
  }
]

# Define request and response models
class MessageItem(BaseModel):
    text: str
    sender: str

class ChatRequest(BaseModel):
    message: str
    chat_history: Optional[List[MessageItem]] = []

class ChatResponse(BaseModel):
    response: str

# Generate a response based on the user's message
def generate_response(message: str, chat_history: List[MessageItem] = []) -> str:
    lowerMessage = message.lower()
    
    # Introduction/greeting
    if "hello" in lowerMessage or "hi" in lowerMessage or "introduce" in lowerMessage:
        return "✈️ Namaste! I am Smart.AI Travel, your dedicated travel assistant. I can help you plan your perfect trip by providing information about flights, hotels, destinations, and travel tips. Whether you're looking for luxury getaways or budget-friendly adventures, I'm here to make your travel planning seamless and enjoyable. How may I assist you with your travel plans today?"
    
    # Flight related queries
    if "flight" in lowerMessage or "fly" in lowerMessage or "airline" in lowerMessage:
        destination = random.choice(destinations)
        return f"✈️ I'd be happy to help you find flights to {destination['name']}! Here are some options:\n\n1. Economy: $950 (22hr with 1 stop)\n2. Premium Economy: $1,800 (20hr nonstop)\n3. Business Class: $4,200 (18hr nonstop)\n4. First Class: $8,500 (18hr nonstop)\n\nWould you like me to provide more details about any of these options? I can also help with specific dates, airlines, or other destinations."
    
    # Hotel related queries
    if "hotel" in lowerMessage or "stay" in lowerMessage or "accommodation" in lowerMessage or "room" in lowerMessage:
        destination = random.choice(destinations)
        return f"🏨 Here are some excellent hotel options in {destination['name']}:\n\n• {destination['hotels'][0]} - $450/night (5-star luxury)\n• {destination['hotels'][1]} - $320/night (4-star with ocean view)\n• {destination['hotels'][2]} - $250/night (4-star boutique hotel)\n\nAll these hotels offer free Wi-Fi, swimming pools, and are highly rated for their service. Would you like more information about amenities, availability, or other accommodation options?"
    
    # Destination information
    if "destination" in lowerMessage or "place" in lowerMessage or "country" in lowerMessage or "city" in lowerMessage:
        destination = random.choice(destinations)
        return f"🌍 {destination['name']} is a fantastic choice! Here's what you should know:\n\nTop attractions: {', '.join(destination['attractions'])}\n\nBest time to visit: Depends on your preferences, but generally the shoulder seasons offer good weather with fewer crowds.\n\nWeather: {destination['weather']}\n\nWould you like recommendations for hotels, restaurants, or specific activities in {destination['name']}?"
    
    # Itinerary or planning
    if "itinerary" in lowerMessage or "plan" in lowerMessage or "schedule" in lowerMessage:
        destination = random.choice(destinations)
        return f"📅 Here's a suggested 3-day itinerary for {destination['name']}:\n\nDay 1: Morning - Visit {destination['attractions'][0]}\nAfternoon - Explore {destination['attractions'][1]}\nEvening - Dinner at a local restaurant\n\nDay 2: Full day tour of {destination['attractions'][2]} and surrounding areas\nEvening - Cultural show and dinner\n\nDay 3: Morning - Relax at {destination['attractions'][3]}\nAfternoon - Shopping and souvenirs\nEvening - Farewell dinner with local cuisine\n\nWould you like me to customize this itinerary based on your interests?"
    
    # Weather information
    if "weather" in lowerMessage or "temperature" in lowerMessage or "climate" in lowerMessage:
        destination = random.choice(destinations)
        return f"🌤️ The weather in {destination['name']}:\n\n{destination['weather']}\n\nIf you're planning to visit soon, I recommend packing layers and checking the forecast closer to your travel date. Would you like specific packing suggestions for this destination?"
    
    # Travel tips
    if "tip" in lowerMessage or "advice" in lowerMessage or "suggestion" in lowerMessage:
        return "✨ Here are some general travel tips:\n\n• Always keep digital copies of important documents\n• Notify your bank about international travel\n• Get travel insurance for peace of mind\n• Pack a basic first-aid kit\n• Learn a few phrases in the local language\n• Use a VPN when connecting to public Wi-Fi\n\nWould you like more specific tips for a particular destination?"
    
    # Default response for other queries
    return "✨ As Smart.AI Travel, I'm here to assist with all your travel needs! I can help with:\n\n• Flight bookings and information\n• Hotel recommendations and reservations\n• Destination guides and attractions\n• Travel itineraries and planning\n• Weather information and packing tips\n• Local customs and cultural advice\n\nPlease let me know what aspect of travel planning you need assistance with, and I'll be happy to help!"

# Define the chat endpoint
@app.post("/chat", response_model=ChatResponse)
async def chat_endpoint(request: ChatRequest):
    try:
        # Generate response using our function
        response = generate_response(request.message, request.chat_history)
        return {"response": response}
    
    except Exception as e:
        print(f"Error in chat endpoint: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

# Add a health check endpoint
@app.get("/health")
async def health_check():
    return {"status": "healthy"}

# Add a root endpoint
@app.get("/")
async def root():
    return {
        "message": "Welcome to Smart.AI Travel API",
        "docs": "/docs",
        "health": "/health"
    }

# Run the app with uvicorn if this file is executed directly
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
