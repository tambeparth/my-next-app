# Yatra Sevak.AI Chatbot Integration

This document provides instructions for setting up and using the integrated Yatra Sevak.AI travel chatbot with FastAPI backend and Next.js frontend.

## Architecture Overview

The chatbot system consists of two main components:

1. **FastAPI Backend**: Handles the AI processing using the Hugging Face Mixtral-8x7B-Instruct model
2. **Next.js Frontend**: Provides the user interface for interacting with the chatbot

## Prerequisites

1. Node.js and npm (for the Next.js application)
2. Python 3.8+ (for the FastAPI backend)
3. A Hugging Face account and API token

## Setup Instructions

### 1. Set Up the FastAPI Backend

1. Navigate to the backend directory:
   ```bash
   cd backend-chatbot
   ```

2. Install the required Python packages:
   ```bash
   pip install -r requirements.txt
   ```

3. Update the `.env` file with your Hugging Face API token:
   ```
   HUGGINGFACEHUB_API_TOKEN=your_huggingface_token_here
   ```
   You can get an API token from [Hugging Face](https://huggingface.co/settings/tokens).

4. Start the FastAPI server:
   ```bash
   uvicorn main:app --reload
   ```
   The backend will be available at http://localhost:8000.

### 2. Set Up the Next.js Frontend

1. Navigate to the Next.js app directory:
   ```bash
   cd my-next-app
   ```

2. Install dependencies (if not already done):
   ```bash
   npm install
   ```

3. Start the Next.js development server:
   ```bash
   npm run dev
   ```
   The frontend will be available at http://localhost:3000.

### 3. Using the Quick Start Batch File

For convenience, you can use the provided batch file to start both services at once:

```bash
start-chatbot.bat
```

This will open two command windows, one for the backend and one for the frontend.

## How It Works

1. The frontend chatbot component (`app/chatbot/page.tsx`) sends user messages to the FastAPI backend.
2. The FastAPI backend (`backend-chatbot/main.py`) processes the request using the Hugging Face model.
3. The response is sent back to the frontend and displayed to the user.
4. If the FastAPI backend is unavailable, the frontend falls back to using the Next.js API route or predefined responses.

## API Endpoints

### FastAPI Backend

- `POST /chat`: Main endpoint for chatbot interactions
- `GET /health`: Health check endpoint
- `GET /docs`: Interactive API documentation (Swagger UI)

### Next.js API Route (Fallback)

- `POST /API/chatbot`: Fallback endpoint that uses predefined responses

## Troubleshooting

If you encounter issues with the chatbot:

1. **FastAPI Backend Issues**:
   - Check that your Hugging Face API token is valid and has been set correctly in the `.env` file.
   - Ensure Python and all required packages are installed correctly.
   - Check the terminal running the FastAPI server for error messages.

2. **Next.js Frontend Issues**:
   - Check the browser console for any error messages.
   - Ensure the FastAPI backend is running and accessible.
   - If the FastAPI backend is unavailable, the frontend will fall back to using predefined responses.

## Customization

You can customize the chatbot's behavior by modifying:

1. The prompt template in `backend-chatbot/main.py` to change the chatbot's personality or capabilities.
2. The UI components in `app/chatbot/page.tsx` to change the appearance of the chatbot.
3. The fallback responses in `app/chatbot/page.tsx` to provide different predefined answers when the API is unavailable.

## Deployment

For production deployment:

1. **FastAPI Backend**:
   - Deploy to a service like Heroku, AWS Lambda, Google Cloud Run, or DigitalOcean App Platform.
   - Set the `HUGGINGFACEHUB_API_TOKEN` environment variable in your deployment environment.

2. **Next.js Frontend**:
   - Update the API URL in the frontend code to point to your deployed backend.
   - Deploy the Next.js app to Vercel, Netlify, or another hosting service.

## Security Considerations

For production use:

1. Add proper authentication to the FastAPI backend.
2. Use HTTPS for all communications.
3. Restrict CORS settings to only allow requests from your frontend domain.
4. Consider rate limiting to prevent abuse.
