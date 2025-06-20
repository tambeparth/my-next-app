from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import os
from dotenv import load_dotenv
from langchain_community.llms import HuggingFaceEndpoint
from langchain_core.output_parsers import StrOutputParser
from langchain_core.prompts import ChatPromptTemplate

# Load environment variables
load_dotenv()

# Get API token from environment variable
api_token = os.getenv("HUGGINGFACEHUB_API_TOKEN")
if not api_token:
    print("WARNING: HUGGINGFACEHUB_API_TOKEN not found in environment variables")

# Define the repository ID and task
repo_id = "mistralai/Mixtral-8x7B-Instruct-v0.1"
task = "text-generation"

# Add these parameters to control response length
RESPONSE_PARAMS = {
    "max_new_tokens": 8000,  # Significantly increased for longer responses
    "temperature": 0.9,      # Slightly increased for more creative responses
    "top_p": 0.99,          # Increased for more diverse outputs
    "repetition_penalty": 1.3,  # Increased to reduce repetition in longer texts
    "do_sample": True,
    "length_penalty": 2.0,   # Added to favor longer responses
    "min_length": 200,       # Added minimum length requirement
    "num_beams": 4          # Added for better response quality
}

# Define the template for the chatbot
template = """
You are a travel assistant chatbot named Smart.AI Travel designed to help users plan their trips and provide travel-related information. Here are some scenarios you should be able to handle:

1. Booking Flights: Assist users with booking flights to their desired destinations. Ask for departure city, destination city, travel dates, and any specific preferences (e.g., direct flights, airline preferences). Check available airlines and book the tickets accordingly.

2. Booking Hotels: Help users find and book accommodations. Inquire about city or region, check-in/check-out dates, number of guests, and accommodation preferences (e.g., budget, amenities).

3. Booking Rental Cars: Facilitate the booking of rental cars for travel convenience. Gather details such as pickup/drop-off locations, dates, car preferences (e.g., size, type), and any additional requirements.

4. Destination Information: Provide information about popular travel destinations. Offer insights on attractions, local cuisine, cultural highlights, weather conditions, and best times to visit.

5. Travel Tips: Offer practical travel tips and advice. Topics may include packing essentials, visa requirements, currency exchange, local customs, and safety tips.

6. Weather Updates: Give current weather updates for specific destinations or regions. Include temperature forecasts, precipitation chances, and any weather advisories.

7. Local Attractions: Suggest local attractions and points of interest based on the user's destination. Highlight must-see landmarks, museums, parks, and recreational activities.

8. Customer Service: Address customer service inquiries and provide assistance with travel-related issues. Handle queries about bookings, cancellations, refunds, and general support.

9. Crisis Management: For any destination mentioned, ALWAYS include a "CRISIS ALERT" section in your response with information about any recent (within the past 5-7 days) disasters, floods, attacks, political unrest, health emergencies, or other crisis situations that might affect travel safety. If there are no current crisis situations, explicitly state "No current crisis situations reported in this area."

Format the crisis information as follows:
⚠️ CRISIS ALERT ⚠️
[List any current crisis situations with brief details about severity, affected areas, and safety recommendations]

This crisis information should appear at the beginning of your response, before other travel information.

Please ensure responses are informative, accurate, and tailored to the user's queries and preferences. Use natural language to engage users and provide a seamless experience throughout their travel planning journey.

Chat history:
{chat_history}

User question:
{user_question}
"""

prompt = ChatPromptTemplate.from_template(template)

app = FastAPI(title="Smart.AI Travel API", description="Travel chatbot API using Hugging Face models")

# CORS configuration to allow requests from your Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

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
    try:
        # Format chat history for the prompt
        formatted_history = ""
        for msg in chat_history:
            role = "User" if msg.sender == "user" else "AI"
            formatted_history += f"{role}: {msg.text}\n"

        # Initialize the Hugging Face Endpoint with parameters
        llm = HuggingFaceEndpoint(
            huggingfacehub_api_token=api_token,
            repo_id=repo_id,
            task=task,
            model_kwargs=RESPONSE_PARAMS  # Add the parameters here
        )

        chain = prompt | llm | StrOutputParser()

        # Get response from the model
        response = chain.invoke({
            "chat_history": formatted_history,
            "user_question": message,
        })

        # Clean up response and ensure minimum length
        response = response.replace("AI response:", "").replace("chat response:", "").replace("bot response:", "").strip()

        # If response is too short, try to generate again with even higher max_tokens
        if len(response.split()) < 200:  # Increased minimum words
            RESPONSE_PARAMS["max_new_tokens"] = 8000  # Even more tokens for retry
            llm = HuggingFaceEndpoint(
                huggingfacehub_api_token=api_token,
                repo_id=repo_id,
                task=task,
                model_kwargs=RESPONSE_PARAMS
            )
            chain = prompt | llm | StrOutputParser()
            response = chain.invoke({
                "chat_history": formatted_history,
                "user_question": message,
            })
            response = response.replace("AI response:", "").replace("chat response:", "").replace("bot response:", "").strip()

        return response
    except Exception as e:
        print(f"Error generating response: {str(e)}")
        # Fallback response in case of error
        return "I'm sorry, I'm having trouble processing your request at the moment. Please try again later."

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
        "message": "Welcome to Smart.AI Travel",
        "docs": "/docs",
        "health": "/health"
    }

# Run the app with uvicorn if this file is executed directly
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)



