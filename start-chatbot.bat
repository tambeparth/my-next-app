@echo off
echo Starting Yatra Sevak.AI Chatbot...
echo.

echo Starting FastAPI backend...
start cmd /k "cd backend-chatbot && uvicorn main:app --reload"

echo Starting Next.js frontend...
start cmd /k "cd my-next-app && npm run dev"

echo.
echo Services started! Access the application at:
echo Frontend: http://localhost:3000/chatbot
echo Backend API: http://localhost:8000
echo Backend API Docs: http://localhost:8000/docs
echo.
echo Press any key to stop all services...
pause > nul

echo Stopping services...
taskkill /f /im cmd.exe /t
echo Done!
