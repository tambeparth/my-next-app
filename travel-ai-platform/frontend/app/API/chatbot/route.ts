import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

// Define interfaces for request and response
interface ChatRequest {
  message: string;
  chat_history?: Array<{
    text: string;
    sender: "user" | "ai";
  }>;
  use_groq?: boolean;
}

interface JWTPayload {
  userId: string;
  email: string;
  username: string;
}

interface HuggingFaceResponse {
  generated_text?: string;
  error?: string;
}

export async function POST(request: NextRequest) {
  try {
    // Check for Authorization header (optional - allow both authenticated and anonymous users)
    let user: JWTPayload | null = null;
    const authHeader = request.headers.get('authorization');

    if (authHeader) {
      const token = authHeader.split(' ')[1];
      if (token) {
        try {
          user = jwt.verify(token, process.env.JWT_SECRET!) as JWTPayload;
        } catch (jwtError) {
          // Continue without authentication for anonymous users
          console.log('Invalid token, continuing as anonymous user');
        }
      }
    }

    // Parse the request body
    const body: ChatRequest = await request.json();
    const { message, chat_history = [], use_groq = false } = body;

    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    // Get API tokens from environment
    const huggingFaceToken = process.env.HUGGINGFACEHUB_API_TOKEN;
    const groqApiKey = process.env.GROQ_API_KEY;

    // Check if API keys are properly configured (not placeholder values)
    const isValidGroqKey = groqApiKey && groqApiKey !== 'your_groq_api_key_here' && groqApiKey.startsWith('gsk_');
    const isValidHFToken = huggingFaceToken && huggingFaceToken !== 'your_huggingface_token_here' && huggingFaceToken.startsWith('hf_');

    console.log('API Keys Status:', {
      groqConfigured: !!isValidGroqKey,
      hfConfigured: !!isValidHFToken,
      groqPreview: groqApiKey ? groqApiKey.substring(0, 10) + '...' : 'Not set',
      hfPreview: huggingFaceToken ? huggingFaceToken.substring(0, 10) + '...' : 'Not set'
    });

    // Create travel assistant prompt
    const travelPrompt = `You are a travel assistant chatbot named Yatra Sevak.AI designed to help users plan their trips and provide travel-related information.

IMPORTANT: For any destination mentioned, ALWAYS include a "CRISIS ALERT" section in your response with information about any recent disasters, floods, attacks, political unrest, health emergencies, or other crisis situations that might affect travel safety. If there are no current crisis situations, explicitly state "No current crisis situations reported in this area."

Format the crisis information as follows:
⚠️ CRISIS ALERT ⚠️
[List any current crisis situations with brief details about severity, affected areas, and safety recommendations]

You can help with:
1. Booking Flights and Hotels
2. Destination Information and Travel Tips
3. Weather Updates and Local Attractions
4. Customer Service and Travel Support

Chat History: ${chat_history.map(msg => `${msg.sender}: ${msg.text}`).join('\n')}

User Question: ${message}

Please provide a helpful, informative response:`;

    let response = '';
    let modelUsed = 'fallback';

    // Try Groq API first (faster and more reliable)
    if (isValidGroqKey) {
      try {
        const groqResponse = await fetch('https://api.groq.com/openai/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${groqApiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'mixtral-8x7b-32768',
            messages: [
              {
                role: 'system',
                content: 'You are Yatra Sevak.AI, a helpful travel assistant chatbot.'
              },
              {
                role: 'user',
                content: travelPrompt
              }
            ],
            max_tokens: 1000,
            temperature: 0.7,
          }),
        });

        if (groqResponse.ok) {
          const groqData = await groqResponse.json();
          response = groqData.choices[0]?.message?.content || '';
          modelUsed = 'groq-mixtral';
        }
      } catch (error) {
        console.error('Groq API error:', error);
      }
    }

    // Fallback to Hugging Face if Groq fails
    if (!response && isValidHFToken) {
      try {
        const hfResponse = await fetch(
          'https://api-inference.huggingface.co/models/microsoft/DialoGPT-medium',
          {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${huggingFaceToken}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              inputs: travelPrompt,
              parameters: {
                max_new_tokens: 250,
                temperature: 0.7,
                return_full_text: false,
              },
            }),
          }
        );

        if (hfResponse.ok) {
          const hfData: HuggingFaceResponse[] = await hfResponse.json();
          response = hfData[0]?.generated_text || '';
          modelUsed = 'huggingface-dialogpt';
        }
      } catch (error) {
        console.error('Hugging Face API error:', error);
      }
    }

    // Enhanced fallback response with user's question context
    if (!response) {
      // Create a contextual response based on the user's message
      const lowerMessage = message.toLowerCase();
      let contextualResponse = '';

      if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
        contextualResponse = `Hello! Welcome to Yatra Sevak.AI! 👋`;
      } else if (lowerMessage.includes('plan') || lowerMessage.includes('trip') || lowerMessage.includes('travel')) {
        contextualResponse = `I'd love to help you plan your trip! 🗺️`;
      } else if (lowerMessage.includes('hotel') || lowerMessage.includes('accommodation')) {
        contextualResponse = `I can help you find great accommodation options! 🏨`;
      } else if (lowerMessage.includes('flight') || lowerMessage.includes('airline')) {
        contextualResponse = `Let me assist you with flight information! ✈️`;
      } else {
        contextualResponse = `Thanks for your question about "${message.substring(0, 50)}${message.length > 50 ? '...' : ''}"! 💬`;
      }

      response = `${contextualResponse}

⚠️ CRISIS ALERT ⚠️
No current crisis situations reported for general travel inquiries.

🤖 **Note:** I'm currently running in offline mode as API keys need to be configured.

I can still help you with:
• ✈️ Flight booking guidance
• 🏨 Hotel recommendations
• 🗺️ Travel itinerary planning
• 📍 Local attractions info
• 🌤️ Weather forecasts
• 💡 Travel tips & safety advice

To enable AI-powered responses, please configure your API keys in the environment settings.

How can I assist you with your travel plans today?`;
      modelUsed = 'fallback-contextual';
    }

    // Return the response (always successful)
    return NextResponse.json({
      success: true,
      response: response.trim(),
      timestamp: Date.now(),
      model_used: modelUsed,
      user: user ? { id: user.userId, username: user.username } : null
    });
  } catch (error: any) {
    console.error('Chatbot API error:', error);

    // Determine error type
    let errorMessage = "The AI service is currently experiencing technical difficulties. Please try again later.";

    if (error.message && error.message.includes('API')) {
      errorMessage = "API authentication error. The system is currently experiencing issues with the AI service.";
    } else if (error.message && error.message.includes('timeout')) {
      errorMessage = "The AI service took too long to respond. Please try a simpler query or try again later.";
    } else if (error.message && (error.message.includes('ECONNREFUSED') || error.message.includes('ENOTFOUND'))) {
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
