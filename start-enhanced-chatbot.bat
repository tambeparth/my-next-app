@echo off
echo Starting Enhanced Smart.AI Travel Chatbot Server...
echo.
echo This version provides comprehensive, detailed travel information with:
echo - Thorough crisis management
echo - Detailed destination overviews
echo - Comprehensive accommodation options
echo - Detailed transportation information
echo - Extensive activities and attractions
echo - Dining and cuisine recommendations
echo - Practical travel tips
echo.
cd backend-chatbot
python -m uvicorn main:app --host 0.0.0.0 --port 8000
pause
