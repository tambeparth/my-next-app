@echo off
echo ========================================
echo    Travel AI Platform - Quick Setup
echo ========================================
echo.

echo [1/4] Setting up Frontend (my-next-app)...
cd my-next-app
if not exist .env.local (
    copy .env.example .env.local
    echo ✅ Created .env.local from example
) else (
    echo ⚠️  .env.local already exists
)
call npm install
if %errorlevel% neq 0 (
    echo ❌ Frontend setup failed
    pause
    exit /b 1
)
echo ✅ Frontend dependencies installed
cd ..

echo.
echo [2/4] Setting up Backend (backend-v2)...
cd backend-v2
if not exist .env (
    copy .env.example .env
    echo ✅ Created .env from example
) else (
    echo ⚠️  .env already exists
)
call npm install
if %errorlevel% neq 0 (
    echo ❌ Backend setup failed
    pause
    exit /b 1
)
echo ✅ Backend dependencies installed
cd ..

echo.
echo [3/4] Setting up AI Chatbot (backend-chatbot)...
cd backend-chatbot
if not exist .env (
    copy .env.example .env
    echo ✅ Created .env from example
) else (
    echo ⚠️  .env already exists
)
pip install -r requirements.txt
if %errorlevel% neq 0 (
    echo ❌ Chatbot setup failed
    pause
    exit /b 1
)
echo ✅ Chatbot dependencies installed
cd ..

echo.
echo [4/4] Setup Complete! 🎉
echo.
echo ========================================
echo           NEXT STEPS:
echo ========================================
echo.
echo 1. Configure your environment variables:
echo    - my-next-app/.env.local
echo    - backend-v2/.env  
echo    - backend-chatbot/.env
echo.
echo 2. Set up MongoDB Atlas:
echo    - Go to https://cloud.mongodb.com
echo    - Create free cluster
echo    - Get connection string
echo    - Add to MONGODB_URI/MONGO_URI
echo.
echo 3. Run the development servers:
echo    Terminal 1: cd my-next-app ^&^& npm run dev
echo    Terminal 2: cd backend-v2 ^&^& npm run dev  
echo    Terminal 3: cd backend-chatbot ^&^& python main.py
echo.
echo 4. Open http://localhost:3000 in your browser
echo.
echo For detailed setup instructions, see README.md
echo ========================================
echo.
pause
