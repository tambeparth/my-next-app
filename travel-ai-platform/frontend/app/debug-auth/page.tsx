"use client"

import { useState } from "react"
import { Button } from "@/components/ui/Button"

export default function AuthDebugPage() {
  const [results, setResults] = useState<any>({})
  const [loading, setLoading] = useState(false)

  const testBackendConnection = async () => {
    setLoading(true)
    const testResults: any = {}

    // Test 1: Check backend health endpoint
    try {
      const healthResponse = await fetch('http://localhost:5000/health')
      const healthData = await healthResponse.json()
      testResults.backendHealth = {
        status: healthResponse.ok ? 'HEALTHY' : 'UNHEALTHY',
        data: healthData
      }
    } catch (error: any) {
      testResults.backendHealth = {
        status: 'ERROR',
        message: 'Backend health check failed: ' + error.message
      }
    }

    // Test 2: Check if backend auth endpoint responds
    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'test@test.com', password: 'test' })
      })
      testResults.backendAuth = {
        status: response.status,
        message: response.status === 404 ? '✅ Backend running - user not found (expected)' :
          response.status === 400 ? '✅ Backend running - invalid credentials (expected)' :
            'Backend auth response: ' + response.status
      }
    } catch (error: any) {
      testResults.backendAuth = {
        status: 'ERROR',
        message: '❌ Backend not running or not accessible: ' + error.message
      }
    }

    // Test 2: Check environment variables
    testResults.environment = {
      NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'Not set',
      NODE_ENV: process.env.NODE_ENV || 'Not set'
    }

    // Test 3: Test registration with dummy data
    try {
      const testEmail = `test${Date.now()}@example.com`
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: 'testuser',
          email: testEmail,
          password: 'testpassword123'
        })
      })
      const data = await response.json()
      testResults.registration = {
        status: response.status,
        message: response.ok ? 'Registration successful' : data.message,
        data: response.ok ? 'Token received' : data
      }
    } catch (error: any) {
      testResults.registration = {
        status: 'ERROR',
        message: 'Registration test failed: ' + error.message
      }
    }

    setResults(testResults)
    setLoading(false)
  }

  const testJWTAndChatbot = async () => {
    setLoading(true)
    const testResults: any = {}

    // Test 1: Check JWT token
    const token = localStorage.getItem('token')
    const user = localStorage.getItem('user')
    testResults.jwtStatus = {
      hasToken: !!token,
      hasUser: !!user,
      tokenPreview: token ? `${token.substring(0, 20)}...` : 'No token',
      user: user ? JSON.parse(user) : 'No user data'
    }

    // Test 2: Test chatbot API with JWT
    if (token) {
      try {
        const response = await fetch('/API/chatbot', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            message: 'Hello, this is a test message',
            use_groq: false
          })
        })

        const data = await response.json()
        testResults.chatbotWithAuth = {
          status: response.status,
          success: data.success !== false,
          response: data.response ? data.response.substring(0, 100) + '...' : 'No response',
          model: data.model_used || 'unknown'
        }
      } catch (error: any) {
        testResults.chatbotWithAuth = {
          status: 'ERROR',
          message: 'Chatbot test failed: ' + error.message
        }
      }
    }

    // Test 3: Test chatbot API without JWT
    try {
      const response = await fetch('/API/chatbot', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message: 'Hello, this is an anonymous test',
          use_groq: false
        })
      })

      const data = await response.json()
      testResults.chatbotAnonymous = {
        status: response.status,
        success: data.success !== false,
        response: data.response ? data.response.substring(0, 100) + '...' : 'No response',
        model: data.model_used || 'unknown'
      }
    } catch (error: any) {
      testResults.chatbotAnonymous = {
        status: 'ERROR',
        message: 'Anonymous chatbot test failed: ' + error.message
      }
    }

    // Test 4: Check API keys
    testResults.apiKeys = {
      groq: process.env.GROQ_API_KEY ? '✅ Configured' : '❌ Missing',
      huggingface: process.env.HUGGINGFACEHUB_API_TOKEN ? '✅ Configured' : '❌ Missing',
      chatbotUrl: process.env.NEXT_PUBLIC_CHATBOT_API_URL || 'Using default'
    }

    setResults(testResults)
    setLoading(false)
  }

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Authentication Debug Tool</h1>

      <div className="space-y-4 mb-8">
        <Button onClick={testBackendConnection} disabled={loading}>
          {loading ? 'Testing...' : 'Test Backend Connection'}
        </Button>

        <Button onClick={testJWTAndChatbot} disabled={loading}>
          Test JWT & Chatbot
        </Button>
      </div>

      {Object.keys(results).length > 0 && (
        <div className="bg-gray-100 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Test Results:</h2>
          <pre className="whitespace-pre-wrap text-sm">
            {JSON.stringify(results, null, 2)}
          </pre>
        </div>
      )}

      <div className="mt-8 p-4 bg-blue-50 rounded-lg">
        <h3 className="font-semibold mb-2">Quick Fixes:</h3>
        <ul className="list-disc list-inside space-y-1 text-sm">
          <li>Make sure backend server is running: <code>cd backend-v2 && npm run dev</code></li>
          <li>Check if MongoDB is running (if using local MongoDB)</li>
          <li>Verify .env files are properly configured</li>
          <li>Check browser console for detailed error messages</li>
          <li>Ensure ports 3000 (frontend) and 5000 (backend) are not blocked</li>
        </ul>
      </div>
    </div>
  )
}
