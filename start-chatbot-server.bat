@echo off
echo Starting Smart.AI Travel Chatbot Server...
cd backend-chatbot
python -m uvicorn main:app --host 0.0.0.0 --port 8000
pause
