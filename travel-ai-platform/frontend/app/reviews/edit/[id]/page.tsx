"use client";

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import ReviewForm from '@/components/ReviewForm';
import ProtectedRoute from '@/components/ProtectedRoute';
import axios from 'axios';

interface ReviewData {
  _id: string;
  destination: string;
  rating: number;
  title: string;
  comment: string;
  visitDate: string;
  user: string;
}

export default function EditReviewPage() {
  const router = useRouter();
  const params = useParams();
  const { isAuthenticated, user } = useAuth();
  const [review, setReview] = useState<ReviewData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Get the review ID from the URL params
  const reviewId = params?.id as string;

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/LogIn');
      return;
    }

    const fetchReview = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          router.push('/LogIn');
          return;
        }

        const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
        const response = await axios.get<{ review: ReviewData }>(`${API_BASE_URL}/api/reviews/${reviewId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        const reviewData = response.data.review;

        // Check if the logged-in user is the owner of the review
        if (user?.id !== reviewData.user) {
          setError('You are not authorized to edit this review');
          return;
        }

        setReview(reviewData);
      } catch (err: any) {
        console.error('Error fetching review:', err);
        setError(err.response?.data?.message || 'Failed to load review. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchReview();
  }, [isAuthenticated, reviewId, router, user]);

  const handleSuccess = () => {
    router.push('/reviews');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
          <button
            onClick={() => router.push('/reviews')}
            className="text-primary hover:underline"
          >
            Back to Reviews
          </button>
        </div>
      </div>
    );
  }

  if (!review) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Review Not Found</h2>
            <p className="mb-4">The review you're looking for doesn't exist or has been removed.</p>
            <button
              onClick={() => router.push('/reviews')}
              className="text-primary hover:underline"
            >
              Back to Reviews
            </button>
          </div>
        </div>
      </div>
    );
  }

  const formattedDate = review.visitDate ? new Date(review.visitDate).toISOString().split('T')[0] : '';

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <ReviewForm
            onSuccess={handleSuccess}
            initialData={{
              id: review._id,
              destination: review.destination,
              rating: review.rating,
              title: review.title,
              comment: review.comment,
              visitDate: formattedDate,
            }}
            isEditing={true}
          />
        </div>
      </div>
    </ProtectedRoute>
  );
}
