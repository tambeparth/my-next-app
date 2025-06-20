# Yatra Sevak.AI Chatbot Setup

This document provides instructions for setting up and using the Yatra Sevak.AI travel chatbot in the Next.js application.

## Prerequisites

1. Node.js and npm (for the Next.js application)
2. Python 3.8+ (for the chatbot backend)
3. A Hugging Face account and API token

## Setup Instructions

### 1. Install Python Dependencies

Install the required Python packages:

```bash
pip install -r requirements.txt
```

### 2. Set Up Environment Variables

1. Make sure your `.env.local` file contains the Hugging Face API token:

```
HUGGINGFACEHUB_API_TOKEN=your_huggingface_token_here
```

You can get an API token from [Hugging Face](https://huggingface.co/settings/tokens).

### 3. Run the Next.js Application

```bash
npm run dev
```

## How It Works

The chatbot integration works as follows:

1. The frontend chatbot component (`app/chatbot/page.tsx`) sends user messages to the API endpoint.
2. The API route (`app/API/chatbot/route.ts`) processes the request and creates a temporary Python script.
3. The Python script uses the Hugging Face API to generate a response using the Mixtral-8x7B-Instruct model.
4. The response is sent back to the frontend and displayed to the user.

## Troubleshooting

If you encounter issues with the chatbot:

1. Check that your Hugging Face API token is valid and has been set correctly in the `.env.local` file.
2. Ensure Python and all required packages are installed correctly.
3. Check the browser console and server logs for any error messages.
4. If the API fails, the chatbot will fall back to using predefined responses.

## Customization

You can customize the chatbot's behavior by modifying:

1. The prompt template in `app/API/chatbot/route.ts` to change the chatbot's personality or capabilities.
2. The UI components in `app/chatbot/page.tsx` to change the appearance of the chatbot.
3. The fallback responses in `app/chatbot/page.tsx` to provide different predefined answers when the API is unavailable.
