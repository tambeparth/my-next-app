@echo off
echo Starting Yatra Sevak.AI Backend with Multi-Model Support...

REM Find and kill any process using port 8000
for /f "tokens=5" %%a in ('netstat -aon ^| find ":8000" ^| find "LISTENING"') do (
    echo Killing process with PID %%a
    taskkill /F /PID %%a
)

REM Start the FastAPI server
echo Starting FastAPI server on port 8000...
start cmd /k "python -m uvicorn main:app --reload --port 8000"

echo.
echo Server started! Access the API at http://localhost:8000
echo API documentation is available at http://localhost:8000/docs
echo.
echo Press any key to stop the server...
pause > nul

REM Kill the server when the user presses a key
for /f "tokens=5" %%a in ('netstat -aon ^| find ":8000" ^| find "LISTENING"') do (
    echo Stopping server...
    taskkill /F /PID %%a
)

echo Server stopped.
