"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import ReviewForm from '@/components/ReviewForm';
import ProtectedRoute from '@/components/ProtectedRoute';
import { motion } from 'framer-motion';
import { Rocket, ArrowLeft } from 'lucide-react';

export default function NewReviewPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/LogIn');
    }
  }, [isAuthenticated, router]);

  const handleSuccess = () => {
    router.push('/reviews');
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Header with back button */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center mb-8"
          >
            <button
              onClick={() => router.back()}
              className="flex items-center text-indigo-400 hover:text-indigo-300 transition-colors mr-4"
            >
              <ArrowLeft className="h-5 w-5 mr-1" />
              Back
            </button>
            <div className="flex items-center">
              <Rocket className="h-8 w-8 text-indigo-400 mr-3" />
              <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-500">
                Share Your Journey
              </h1>
            </div>
          </motion.div>

          {/* Glass panel for the form */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="bg-gray-800/50 backdrop-blur-lg rounded-xl shadow-2xl overflow-hidden border border-gray-700"
          >
            <div className="p-6 sm:p-8">
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-white">New Travel Review</h2>
                <p className="text-gray-400">Share your experience with the community</p>
              </div>

              <ReviewForm onSuccess={handleSuccess} />
            </div>
          </motion.div>

          {/* Decorative elements */}
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none -z-10">
            <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-purple-500/10 blur-3xl"></div>
            <div className="absolute bottom-1/3 right-1/3 w-96 h-96 rounded-full bg-indigo-500/10 blur-3xl"></div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}