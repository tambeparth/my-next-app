"use client"

import { motion } from "framer-motion"
import { Lock, LogIn, UserPlus, Shield } from "lucide-react"
import { Button } from "@/components/ui/Button"
import Link from "next/link"

export default function LoginRequired() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center"
      >
        {/* Lock Icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="mx-auto w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mb-6"
        >
          <Shield className="h-10 w-10 text-white" />
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-2xl font-bold text-gray-900 mb-4"
        >
          Authentication Required
        </motion.h1>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-gray-600 mb-8 leading-relaxed"
        >
          You need to be logged in to access this feature. Please sign in to your account or create a new one to continue.
        </motion.p>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="space-y-4"
        >
          <Link href="/LogIn" className="block">
            <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-3 rounded-xl font-medium transition-all duration-200 transform hover:scale-105">
              <LogIn className="h-5 w-5 mr-2" />
              Sign In to Your Account
            </Button>
          </Link>

          <Link href="/signup" className="block">
            <Button variant="outline" className="w-full border-2 border-gray-200 hover:border-blue-300 py-3 rounded-xl font-medium transition-all duration-200">
              <UserPlus className="h-5 w-5 mr-2" />
              Create New Account
            </Button>
          </Link>
        </motion.div>

        {/* Features List */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-8 pt-6 border-t border-gray-100"
        >
          <p className="text-sm text-gray-500 mb-4">With an account, you can:</p>
          <ul className="text-sm text-gray-600 space-y-2">
            <li className="flex items-center">
              <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
              Access AI-powered travel chatbot
            </li>
            <li className="flex items-center">
              <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
              Create personalized trip plans
            </li>
            <li className="flex items-center">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
              Save and manage your travel history
            </li>
            <li className="flex items-center">
              <div className="w-2 h-2 bg-orange-500 rounded-full mr-3"></div>
              Get customized recommendations
            </li>
          </ul>
        </motion.div>

        {/* Back to Home */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="mt-6"
        >
          <Link href="/" className="text-sm text-gray-500 hover:text-blue-600 transition-colors">
            ← Back to Home
          </Link>
        </motion.div>
      </motion.div>
    </div>
  )
}
