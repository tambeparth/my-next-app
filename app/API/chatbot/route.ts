import { NextRequest, NextResponse } from 'next/server';
import { exec } from 'child_process';
import { promisify } from 'util';
import path from 'path';
import fs from 'fs';

// Convert exec to Promise-based
const execPromise = promisify(exec);

// Define interfaces for request and response
interface ChatRequest {
  message: string;
  chat_history?: Array<{
    text: string;
    sender: "user" | "ai";
  }>;
}

export async function POST(request: NextRequest) {
  try {
    // Parse the request body
    const body: ChatRequest = await request.json();
    const { message, chat_history = [] } = body;

    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    // Format chat history for the Python script
    const formattedHistory = chat_history.map(msg => {
      return msg.sender === 'user'
        ? `HumanMessage(content="${msg.text}")`
        : `AIMessage(content="${msg.text}")`;
    }).join(',\n');

    // Create a temporary Python script that will use the Hugging Face model
    const scriptPath = path.join(process.cwd(), 'temp_chatbot_script.py');
    const pythonScript = `
import os
from dotenv import load_dotenv
from langchain_core.messages import AIMessage, HumanMessage
from langchain_community.llms import HuggingFaceEndpoint
from langchain_core.output_parsers import StrOutputParser
from langchain_core.prompts import ChatPromptTemplate

# Load environment variables
load_dotenv()

# Get API token from environment variable
api_token = os.getenv("HUGGINGFACEHUB_API_TOKEN")

# Define the repository ID and task
repo_id = "mistralai/Mixtral-8x7B-Instruct-v0.1"
task = "text-generation"

# Define the template
template = """
You are a travel assistant chatbot named Yatra Sevak.AI designed to help users plan their trips and provide travel-related information. Here are some scenarios you should be able to handle:

1. Booking Flights: Assist users with booking flights to their desired destinations. Ask for departure city, destination city, travel dates, and any specific preferences (e.g., direct flights, airline preferences). Check available airlines and book the tickets accordingly.

2. Booking Hotels: Help users find and book accommodations. Inquire about city or region, check-in/check-out dates, number of guests, and accommodation preferences (e.g., budget, amenities).

IMPORTANT: For any destination mentioned, ALWAYS include a "CRISIS ALERT" section in your response with information about any recent (within the past 5-7 days) disasters, floods, attacks, political unrest, health emergencies, or other crisis situations that might affect travel safety. If there are no current crisis situations, explicitly state "No current crisis situations reported in this area."

Format the crisis information as follows:
⚠️ CRISIS ALERT ⚠️
[List any current crisis situations with brief details about severity, affected areas, and safety recommendations]

This crisis information should appear at the beginning of your response, before other travel information.

3. Booking Rental Cars: Facilitate the booking of rental cars for travel convenience. Gather details such as pickup/drop-off locations, dates, car preferences (e.g., size, type), and any additional requirements.

4. Destination Information: Provide information about popular travel destinations. Offer insights on attractions, local cuisine, cultural highlights, weather conditions, and best times to visit.

5. Travel Tips: Offer practical travel tips and advice. Topics may include packing essentials, visa requirements, currency exchange, local customs, and safety tips.

6. Weather Updates: Give current weather updates for specific destinations or regions. Include temperature forecasts, precipitation chances, and any weather advisories.

7. Local Attractions: Suggest local attractions and points of interest based on the user's destination. Highlight must-see landmarks, museums, parks, and recreational activities.

8. Customer Service: Address customer service inquiries and provide assistance with travel-related issues. Handle queries about bookings, cancellations, refunds, and general support.

Please ensure responses are informative, accurate, and tailored to the user's queries and preferences. Use natural language to engage users and provide a seamless experience throughout their travel planning journey.

Chat history:
{chat_history}

User question:
{user_question}
"""

prompt = ChatPromptTemplate.from_template(template)

# Initialize the Hugging Face Endpoint
llm = HuggingFaceEndpoint(
    huggingfacehub_api_token=api_token,
    repo_id=repo_id,
    task=task
)

chain = prompt | llm | StrOutputParser()

# Define chat history
chat_history = [
    ${formattedHistory}
]

# Get response
response = chain.invoke({
    "chat_history": chat_history,
    "user_question": "${message.replace(/"/g, '\\"')}"
})

# Remove any unwanted prefixes
response = response.replace("AI response:", "").replace("chat response:", "").replace("bot response:", "").strip()

# Print the response (will be captured by Node.js)
print(response)
`;

    // Write the script to a temporary file
    fs.writeFileSync(scriptPath, pythonScript);

    // Execute the Python script
    const { stdout, stderr } = await execPromise(`python ${scriptPath}`);

    if (stderr) {
      console.error('Python script error:', stderr);
    }

    // Clean up the temporary script
    fs.unlinkSync(scriptPath);

    // Return the response
    return NextResponse.json({
      response: stdout.trim(),
      timestamp: Date.now()
    });
  } catch (error: any) {
    console.error('Chatbot API error:', error);

    // Determine error type
    let errorMessage = "The AI service is currently experiencing technical difficulties. Please try again later.";

    if (error.message && error.message.includes('HUGGINGFACEHUB_API_TOKEN')) {
      errorMessage = "API authentication error. The system is currently experiencing issues with the AI service.";
    } else if (error.message && error.message.includes('timeout')) {
      errorMessage = "The AI service took too long to respond. Please try a simpler query or try again later.";
    } else if (error.message && error.message.includes('ECONNREFUSED') || error.message.includes('ENOTFOUND')) {
      errorMessage = "Unable to connect to the AI service. Please try again later.";
    }

    return NextResponse.json(
      {
        response: errorMessage,
        error: true,
        error_details: error.message || 'An error occurred while processing your message',
        model_used: "error"
      },
      { status: 200 } // Return 200 so the frontend can display the error message
    );
  }
}
