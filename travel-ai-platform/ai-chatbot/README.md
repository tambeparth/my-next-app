# 🤖 AI Chatbot Service

FastAPI-based AI chatbot service for travel assistance and crisis management.

## 🚀 Quick Start

1. **Install Dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

2. **Set Environment Variables:**
   ```bash
   cp .env.example .env
   # Edit .env with your API keys
   ```

3. **Run the Service:**
   ```bash
   python main.py
   ```

4. **Access API:** http://localhost:8000

## 🔧 Features

- ✅ **Travel Assistance** - Trip planning and recommendations
- ✅ **Crisis Management** - Real-time safety alerts and warnings
- ✅ **Multi-Model Support** - Hugging Face + Groq API fallback
- ✅ **RESTful API** - Easy integration with frontend
- ✅ **CORS Enabled** - Cross-origin requests supported

## 📡 API Endpoints

### POST /chat
Send a message to the chatbot and get AI-powered response.

**Request:**
```json
{
  "message": "Tell me about travel safety in Paris"
}
```

**Response:**
```json
{
  "response": "🌍 TRAVEL ASSISTANT RESPONSE\n\n**CRISIS ALERT** 🚨\nNo current crisis situations detected for Paris in the last 7 days.\n\n**TRAVEL INFORMATION**\nParis is generally safe for tourists..."
}
```

## 🔑 Environment Variables

Create a `.env` file with:

```env
# Hugging Face API
HUGGINGFACE_API_TOKEN=your_huggingface_token

# Groq API (Fallback)
GROQ_API_KEY=your_groq_api_key

# Server Configuration
PORT=8000
HOST=0.0.0.0
```

## 🛠️ Tech Stack

- **FastAPI** - Modern Python web framework
- **Hugging Face** - Primary AI model (Mixtral-8x7B-Instruct)
- **Groq API** - Fallback AI service
- **Uvicorn** - ASGI server
- **Requests** - HTTP client

## 🚀 Deployment

### Railway
1. Connect your GitHub repository
2. Set environment variables
3. Deploy automatically

### Render
1. Create new web service
2. Connect repository
3. Set build command: `pip install -r requirements.txt`
4. Set start command: `python main.py`

### Docker
```dockerfile
FROM python:3.9-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
EXPOSE 8000
CMD ["python", "main.py"]
```

## 🔍 Troubleshooting

### Common Issues

1. **Port 8000 already in use:**
   ```bash
   # Change port in main.py or kill existing process
   lsof -ti:8000 | xargs kill -9
   ```

2. **API key errors:**
   - Verify your Hugging Face token has sufficient credits
   - Check Groq API key is valid
   - Ensure environment variables are loaded

3. **CORS errors:**
   - Frontend and backend must be on allowed origins
   - Check CORS middleware configuration

## 📚 Model Information

### Primary Model: Mixtral-8x7B-Instruct
- **Provider:** Hugging Face
- **Strengths:** High-quality responses, travel knowledge
- **Limitations:** Rate limits, credit requirements

### Fallback Model: Groq API
- **Provider:** Groq
- **Strengths:** Fast responses, reliable
- **Usage:** When Hugging Face fails or is unavailable

## 🤝 Contributing

1. Fork the repository
2. Create feature branch
3. Add tests for new features
4. Submit pull request

## 📄 License

MIT License - see main project LICENSE file.
