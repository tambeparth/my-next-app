@echo off
echo Cleaning up and starting Yatra Sevak.AI Backend on port 8000...

REM Find and kill any process using port 8000
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :8000 ^| findstr LISTENING') do (
    echo Killing process with PID: %%a
    taskkill /F /PID %%a
)

REM Wait a moment for the port to be released
timeout /t 2 /nobreak > nul

REM Start the FastAPI server
echo Starting FastAPI server on port 8000...
uvicorn main:app --host 0.0.0.0 --port 8000 --reload


