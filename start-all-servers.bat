@echo off
echo ========================================
echo    Starting Travel AI Platform
echo ========================================
echo.
echo Starting all development servers...
echo.
echo Frontend: http://localhost:3000
echo Backend:   http://localhost:5000  
echo Chatbot:   http://localhost:8000
echo.
echo Press Ctrl+C to stop all servers
echo ========================================
echo.

start "Frontend Server" cmd /k "cd my-next-app && npm run dev"
timeout /t 3 /nobreak >nul

start "Backend Server" cmd /k "cd backend-v2 && npm run dev"
timeout /t 3 /nobreak >nul

start "Chatbot Server" cmd /k "cd backend-chatbot && python main.py"

echo All servers started in separate windows!
echo Close this window or press any key to exit...
pause >nul
