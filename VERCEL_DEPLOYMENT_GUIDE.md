# 🚀 Complete Vercel Deployment Guide for Travel AI Platform

## 📋 **Prerequisites**

Before deploying, ensure you have:
- ✅ GitHub account with your repository
- ✅ Vercel account (free tier available)
- ✅ API keys for external services
- ✅ Clean travel-ai-platform structure

---

## 🎯 **Deployment Strategy**

We'll deploy **3 separate services**:
1. **Frontend** - Next.js app on Vercel
2. **Backend** - Express.js API on Vercel
3. **AI Chatbot** - Python FastAPI on Railway/Render

---

## 🚀 **Step 1: Deploy Frontend to Vercel**

### **1.1 Connect GitHub Repository**

1. **Go to Vercel Dashboard:**
   - Visit: https://vercel.com/dashboard
   - Click "New Project"

2. **Import Repository:**
   - Select "Import Git Repository"
   - Choose your GitHub account
   - Select `tambeparth/my-next-app` repository
   - Click "Import"

### **1.2 Configure Frontend Deployment**

1. **Project Settings:**
   ```
   Framework Preset: Next.js
   Root Directory: travel-ai-platform/frontend
   Build Command: npm run build
   Output Directory: .next
   Install Command: npm install
   ```

2. **Environment Variables:**
   ```
   NEXT_PUBLIC_APP_URL=https://your-app-name.vercel.app
   NEXT_PUBLIC_API_URL=https://your-backend-name.vercel.app
   NEXTAUTH_SECRET=your-nextauth-secret-here
   NEXTAUTH_URL=https://your-app-name.vercel.app
   JWT_SECRET=your-jwt-secret-here
   NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your-google-maps-api-key
   NEXT_PUBLIC_UNSPLASH_ACCESS_KEY=your-unsplash-access-key
   BOOKING_API_KEY=your-booking-com-api-key
   BOOKING_API_HOST=booking-com.p.rapidapi.com
   NEXT_PUBLIC_CHATBOT_API_URL=https://your-chatbot-service.railway.app
   ```

3. **Deploy:**
   - Click "Deploy"
   - Wait for build to complete
   - Your frontend will be live at: `https://your-app-name.vercel.app`

---

## 🔧 **Step 2: Deploy Backend API to Vercel**

### **2.1 Create New Vercel Project**

1. **New Project:**
   - Go to Vercel Dashboard
   - Click "New Project"
   - Import same repository again

2. **Configure Backend:**
   ```
   Framework Preset: Other
   Root Directory: travel-ai-platform/backend
   Build Command: npm install
   Output Directory: (leave empty)
   Install Command: npm install
   ```

### **2.2 Backend Environment Variables**

```
NODE_ENV=production
PORT=3000
CORS_ORIGIN=https://your-frontend-name.vercel.app
JWT_SECRET=your-jwt-secret-here
JWT_EXPIRES_IN=7d
DATABASE_URL=your-database-url-here
MONGODB_URI=your-mongodb-connection-string
BOOKING_API_KEY=your-booking-com-api-key
BOOKING_API_HOST=booking-com.p.rapidapi.com
UNSPLASH_ACCESS_KEY=your-unsplash-access-key
```

### **2.3 Create Vercel Serverless Functions**

Create `travel-ai-platform/backend/api/index.js`:
```javascript
const app = require('../server');
module.exports = app;
```

Update `travel-ai-platform/backend/vercel.json`:
```json
{
  "version": 2,
  "builds": [
    {
      "src": "api/index.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/api/index.js"
    }
  ]
}
```

---

## 🤖 **Step 3: Deploy AI Chatbot to Railway**

### **3.1 Railway Setup**

1. **Create Railway Account:**
   - Visit: https://railway.app
   - Sign up with GitHub

2. **Deploy from GitHub:**
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your repository
   - Select `travel-ai-platform/ai-chatbot` folder

### **3.2 Railway Configuration**

1. **Environment Variables:**
   ```
   PORT=8000
   HOST=0.0.0.0
   ENVIRONMENT=production
   HUGGINGFACE_API_TOKEN=your-huggingface-token
   GROQ_API_KEY=your-groq-api-key
   PRIMARY_MODEL=mistralai/Mixtral-8x7B-Instruct-v0.1
   FALLBACK_MODEL=groq-llama
   MAX_TOKENS=250
   TEMPERATURE=0.7
   CORS_ORIGINS=https://your-frontend-name.vercel.app
   ```

2. **Build Settings:**
   ```
   Build Command: pip install -r requirements.txt
   Start Command: python main.py
   ```

---

## 🔑 **Step 4: Get Required API Keys**

### **4.1 Essential API Keys**

1. **Google Maps API:**
   - Go to: https://console.cloud.google.com
   - Enable Maps JavaScript API
   - Create credentials → API Key

2. **Unsplash API:**
   - Go to: https://unsplash.com/developers
   - Create new application
   - Get Access Key

3. **Booking.com RapidAPI:**
   - Go to: https://rapidapi.com/apidojo/api/booking
   - Subscribe to plan
   - Get API Key and Host

4. **Hugging Face API:**
   - Go to: https://huggingface.co/settings/tokens
   - Create new token
   - Copy token

5. **Groq API:**
   - Go to: https://console.groq.com
   - Create API key
   - Copy key

### **4.2 Database Setup**

**MongoDB Atlas (Recommended):**
1. Go to: https://cloud.mongodb.com
2. Create free cluster
3. Get connection string
4. Add to environment variables

---

## ⚙️ **Step 5: Configure Domain & SSL**

### **5.1 Custom Domain (Optional)**

1. **Add Domain in Vercel:**
   - Go to Project Settings
   - Click "Domains"
   - Add your custom domain

2. **DNS Configuration:**
   - Add CNAME record pointing to Vercel
   - SSL automatically configured

---

## 🧪 **Step 6: Testing Deployment**

### **6.1 Frontend Testing**

1. **Visit your frontend URL**
2. **Test key features:**
   - ✅ Homepage loads
   - ✅ Authentication works
   - ✅ Navigation functions
   - ✅ API calls work

### **6.2 Backend Testing**

1. **Test API endpoints:**
   ```bash
   curl https://your-backend-name.vercel.app/api/health
   ```

2. **Check CORS:**
   - Ensure frontend can call backend
   - No CORS errors in browser console

### **6.3 Chatbot Testing**

1. **Test chatbot endpoint:**
   ```bash
   curl -X POST https://your-chatbot-service.railway.app/chat \
   -H "Content-Type: application/json" \
   -d '{"message": "Hello"}'
   ```

---

## 🔧 **Step 7: Environment Variables Summary**

### **Frontend (.env.local):**
```env
NEXT_PUBLIC_APP_URL=https://your-app-name.vercel.app
NEXT_PUBLIC_API_URL=https://your-backend-name.vercel.app
NEXTAUTH_SECRET=your-nextauth-secret
NEXTAUTH_URL=https://your-app-name.vercel.app
JWT_SECRET=your-jwt-secret
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your-google-maps-key
NEXT_PUBLIC_UNSPLASH_ACCESS_KEY=your-unsplash-key
BOOKING_API_KEY=your-booking-key
BOOKING_API_HOST=booking-com.p.rapidapi.com
NEXT_PUBLIC_CHATBOT_API_URL=https://your-chatbot.railway.app
```

### **Backend (.env):**
```env
NODE_ENV=production
PORT=3000
CORS_ORIGIN=https://your-frontend-name.vercel.app
JWT_SECRET=your-jwt-secret
DATABASE_URL=your-database-url
MONGODB_URI=your-mongodb-uri
BOOKING_API_KEY=your-booking-key
UNSPLASH_ACCESS_KEY=your-unsplash-key
```

### **AI Chatbot (.env):**
```env
PORT=8000
ENVIRONMENT=production
HUGGINGFACE_API_TOKEN=your-huggingface-token
GROQ_API_KEY=your-groq-key
CORS_ORIGINS=https://your-frontend-name.vercel.app
```

---

## 🚨 **Troubleshooting**

### **Common Issues:**

1. **Build Failures:**
   - Check Node.js version compatibility
   - Verify all dependencies are installed
   - Check build logs for specific errors

2. **Environment Variables:**
   - Ensure all required variables are set
   - Check for typos in variable names
   - Verify API keys are valid

3. **CORS Errors:**
   - Update CORS_ORIGIN in backend
   - Add frontend domain to allowed origins

4. **API Connection Issues:**
   - Verify API URLs are correct
   - Check network connectivity
   - Test endpoints individually

---

## ✅ **Deployment Checklist**

- [ ] Frontend deployed to Vercel
- [ ] Backend deployed to Vercel
- [ ] AI Chatbot deployed to Railway
- [ ] All environment variables configured
- [ ] API keys obtained and set
- [ ] Database connected
- [ ] CORS configured correctly
- [ ] SSL certificates active
- [ ] All features tested
- [ ] Custom domain configured (optional)

---

## 🎉 **Success!**

Your Travel AI Platform is now live and ready for users!

**URLs:**
- **Frontend:** https://your-app-name.vercel.app
- **Backend API:** https://your-backend-name.vercel.app
- **AI Chatbot:** https://your-chatbot-service.railway.app

**Next Steps:**
- Monitor performance and logs
- Set up analytics and monitoring
- Plan for scaling and optimization
- Gather user feedback and iterate

**🌟 Congratulations on deploying your professional Travel AI Platform! 🌟**
