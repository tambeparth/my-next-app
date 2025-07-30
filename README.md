# 🌟 Travel AI Platform - Complete Setup Guide

A comprehensive travel planning platform with AI-powered chatbot, hotel booking, and personalized recommendations.

## 📋 **Project Overview**

This is a full-stack Travel AI Platform with three main components:
- **Frontend** (`my-next-app/`) - Next.js React application
- **Backend** (`backend-v2/`) - Express.js API server
- **AI Chatbot** (`backend-chatbot/`) - Python FastAPI service

## ✨ **Features**

- 🤖 **AI-powered travel chatbot** with crisis management alerts
- 🏨 **Hotel search and booking** using Booking.com API
- 🗺️ **Interactive maps** with Google Maps integration
- 👤 **User authentication** and profile management
- ⭐ **Reviews and ratings** system for destinations
- 🎮 **Travel-themed games** with coin rewards
- 📱 **Responsive design** for all devices
- 🔒 **Secure authentication** with JWT and NextAuth.js

## 🛠️ **Tech Stack**

### **Frontend**
- Next.js 13+ with App Router
- React 18, TypeScript
- Tailwind CSS, Shadcn/ui
- NextAuth.js for authentication
- Framer Motion for animations

### **Backend**
- Express.js, Node.js
- MongoDB with Mongoose
- JWT authentication
- CORS enabled
- RESTful API design

### **AI Chatbot**
- Python 3.8+, FastAPI
- Hugging Face Transformers
- Groq API integration
- Multi-model fallback system

### **External APIs**
- Google Maps API
- Unsplash API
- Booking.com RapidAPI
- Hugging Face API
- Groq API

## 🚀 **Quick Start Guide**

### **Prerequisites**

Before you begin, ensure you have:
- ✅ **Node.js 18+** installed
- ✅ **Python 3.8+** installed
- ✅ **Git** installed
- ✅ **MongoDB Atlas** account (free)
- ✅ **Code editor** (VS Code recommended)

### **Step 1: Clone the Repository**

```bash
# Clone the repository
git clone https://github.com/tambeparth/my-next-app.git

# Navigate to project directory
cd my-next-app

# Check project structure
ls -la
```

You should see these main folders:
- `my-next-app/` - Frontend application
- `backend-v2/` - Backend API server
- `backend-chatbot/` - AI chatbot service

### **Step 2: Set Up Frontend**

```bash
# Navigate to frontend directory
cd my-next-app

# Install dependencies
npm install

# Create environment file
cp .env.example .env.local
```

**Edit `.env.local` with your configuration:**
```env
# Next.js Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:5000

# Authentication (Generate random strings)
NEXTAUTH_SECRET=your-super-secret-nextauth-key-here
NEXTAUTH_URL=http://localhost:3000
JWT_SECRET=your-jwt-secret-here

# Database
MONGODB_URI=your-mongodb-connection-string

# API Keys (Optional - get from respective services)
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your-google-maps-key
NEXT_PUBLIC_UNSPLASH_ACCESS_KEY=your-unsplash-key
BOOKING_API_KEY=your-booking-api-key
BOOKING_API_HOST=booking-com.p.rapidapi.com

# AI Chatbot
NEXT_PUBLIC_CHATBOT_API_URL=http://localhost:8000
```

### **Step 3: Set Up Backend**

```bash
# Navigate to backend directory (from project root)
cd backend-v2

# Install dependencies
npm install

# Create environment file
touch .env
```

**Edit `.env` with your configuration:**
```env
# Server Configuration
PORT=5000
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000

# Database
MONGO_URI=your-mongodb-connection-string

# JWT Configuration
JWT_SECRET=your-jwt-secret-here

# API Keys (Optional)
BOOKING_API_KEY=your-booking-api-key
UNSPLASH_ACCESS_KEY=your-unsplash-key
```

### **Step 4: Set Up AI Chatbot**

```bash
# Navigate to chatbot directory (from project root)
cd backend-chatbot

# Install Python dependencies
pip install -r requirements.txt

# Create environment file
touch .env
```

**Edit `.env` with your configuration:**
```env
# Server Configuration
PORT=8000
HOST=0.0.0.0
ENVIRONMENT=development

# AI Model Configuration
HUGGINGFACEHUB_API_TOKEN=your-huggingface-token
GROQ_API_KEY=your-groq-api-key

# CORS Configuration
CORS_ORIGINS=http://localhost:3000
```

### **Step 5: Set Up MongoDB Database**

1. **Create MongoDB Atlas Account:**
   - Go to https://cloud.mongodb.com
   - Sign up for free account
   - Create a new cluster (free tier)

2. **Get Connection String:**
   - Click "Connect" → "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your database password
   - Use this string in your environment files

3. **Configure Network Access:**
   - Go to "Network Access"
   - Add IP Address: `0.0.0.0/0` (allow from anywhere)

### **Step 6: Run the Development Servers**

Open **3 separate terminals** and run:

**Terminal 1 - Frontend:**
```bash
cd my-next-app
npm run dev
```
Frontend will run on: http://localhost:3000

**Terminal 2 - Backend:**
```bash
cd backend-v2
npm run dev
```
Backend will run on: http://localhost:5000

**Terminal 3 - AI Chatbot:**
```bash
cd backend-chatbot
python main.py
```
Chatbot will run on: http://localhost:8000

### **Step 7: Verify Setup**

1. **Frontend:** Open http://localhost:3000 - should see homepage
2. **Backend:** Open http://localhost:5000/api/auth - should see API response
3. **Chatbot:** Open http://localhost:8000/docs - should see FastAPI docs

## 🔑 **Getting API Keys (Optional)**

### **Required for Full Functionality:**

1. **MongoDB Atlas (Required):**
   - Free at https://cloud.mongodb.com
   - Used for user data and reviews

2. **JWT Secrets (Required):**
   - Generate random strings for security
   - Use: `node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"`

### **Optional APIs:**

3. **Google Maps API:**
   - Go to https://console.cloud.google.com
   - Enable Maps JavaScript API
   - Create API key

4. **Unsplash API:**
   - Go to https://unsplash.com/developers
   - Create application
   - Get access key

5. **Booking.com RapidAPI:**
   - Go to https://rapidapi.com/apidojo/api/booking
   - Subscribe to plan
   - Get API key

6. **Hugging Face API:**
   - Go to https://huggingface.co/settings/tokens
   - Create token

7. **Groq API:**
   - Go to https://console.groq.com
   - Create API key

## 📁 **Project Structure**

```
my-next-app/                    # Main repository
├── my-next-app/               # Frontend (Next.js)
│   ├── app/                   # Next.js 13+ app directory
│   │   ├── page.tsx          # Homepage
│   │   ├── LogIn/            # Authentication pages
│   │   ├── hotels/           # Hotel booking
│   │   ├── chatbot/          # AI chatbot interface
│   │   └── ...               # Other pages
│   ├── components/           # Reusable UI components
│   ├── lib/                  # Utilities and services
│   ├── public/               # Static assets
│   ├── package.json          # Frontend dependencies
│   └── .env.local            # Frontend environment variables
├── backend-v2/               # Backend API (Express.js)
│   ├── controllers/          # Route handlers
│   ├── models/               # Database models
│   ├── routes/               # API routes
│   ├── middleware/           # Custom middleware
│   ├── server.js             # Main server file
│   ├── package.json          # Backend dependencies
│   └── .env                  # Backend environment variables
├── backend-chatbot/          # AI Chatbot (Python)
│   ├── main.py               # FastAPI application
│   ├── requirements.txt      # Python dependencies
│   └── .env                  # Chatbot environment variables
├── README.md                 # This file
└── VERCEL_DEPLOYMENT_GUIDE.md # Deployment instructions
```

## 🎯 **Available Scripts**

### **Frontend (my-next-app/)**
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
```

### **Backend (backend-v2/)**
```bash
npm run dev          # Start development server with nodemon
npm start            # Start production server
```

### **AI Chatbot (backend-chatbot/)**
```bash
python main.py       # Start FastAPI server
uvicorn main:app --reload  # Start with auto-reload
```

## 🚀 **Deployment**

### **Quick Deploy to Vercel:**

1. **Fork this repository**
2. **Connect to Vercel:**
   - Go to https://vercel.com
   - Import your forked repository
   - Deploy frontend from `my-next-app/` folder
   - Deploy backend from `backend-v2/` folder

3. **Deploy Chatbot to Railway:**
   - Go to https://railway.app
   - Deploy from `backend-chatbot/` folder

**For detailed deployment instructions, see:** `VERCEL_DEPLOYMENT_GUIDE.md`

## 🧪 **Testing**

### **Test Frontend:**
```bash
cd my-next-app
npm run test
```

### **Test Backend API:**
```bash
# Test authentication endpoint
curl http://localhost:5000/api/auth

# Test profile endpoint
curl http://localhost:5000/api/profile
```

### **Test Chatbot:**
```bash
# Test chatbot endpoint
curl -X POST http://localhost:8000/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "Hello, plan a trip to Paris"}'
```

## 🐛 **Troubleshooting**

### **Common Issues:**

1. **Port already in use:**
   ```bash
   # Kill process on port 3000
   npx kill-port 3000

   # Kill process on port 5000
   npx kill-port 5000
   ```

2. **MongoDB connection error:**
   - Check your connection string
   - Ensure IP whitelist includes 0.0.0.0/0
   - Verify database user permissions

3. **Python dependencies error:**
   ```bash
   # Create virtual environment
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   pip install -r requirements.txt
   ```

4. **Environment variables not loading:**
   - Check file names (.env.local for frontend, .env for backend)
   - Restart development servers after adding variables
   - Ensure no spaces around = in environment files

## 📚 **Documentation**

- **API Documentation:** Available at http://localhost:8000/docs (FastAPI auto-docs)
- **Frontend Components:** Check `/components` directory
- **Database Models:** Check `/backend-v2/models` directory
- **Deployment Guide:** See `VERCEL_DEPLOYMENT_GUIDE.md`

## 🤝 **Contributing**

1. **Fork the repository**
2. **Create a feature branch:**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Make your changes**
4. **Commit your changes:**
   ```bash
   git commit -m "Add amazing feature"
   ```
5. **Push to the branch:**
   ```bash
   git push origin feature/amazing-feature
   ```
6. **Open a Pull Request**

## 📄 **License**

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 **Support**

If you encounter any issues:

1. **Check the troubleshooting section above**
2. **Review environment variable setup**
3. **Check server logs for error messages**
4. **Ensure all dependencies are installed**
5. **Verify API keys are valid**

## 🌟 **Features Roadmap**

- [ ] Real-time chat with WebSocket
- [ ] Push notifications
- [ ] Offline mode support
- [ ] Mobile app (React Native)
- [ ] Advanced AI recommendations
- [ ] Social features and sharing
- [ ] Multi-language support

---

**🎉 Happy coding! Your Travel AI Platform is ready to help users plan amazing trips! 🌍✈️**
