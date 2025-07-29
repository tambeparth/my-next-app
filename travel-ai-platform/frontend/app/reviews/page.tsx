"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Star, Edit, Trash2, Plus, Search, MapPin, Calendar, Rocket, Globe, User, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import Link from 'next/link';
import axios from 'axios';

interface Review {
  _id: string;
  user: {
    _id: string;
    username: string;
    avatar: string;
  };
  destination: string;
  rating: number;
  title: string;
  comment: string;
  visitDate: string;
  createdAt: string;
}

const shimmer = `relative overflow-hidden before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_1.5s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/10 before:to-transparent`;

export default function ReviewsPage() {
  const router = useRouter();
  const { isAuthenticated, user } = useAuth();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  useEffect(() => {
    fetchReviews();
  }, [filter]);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      let url = `${API_BASE_URL}/api/reviews`;

      if (filter === 'mine') {
        const token = localStorage.getItem('token');
        if (!token) {
          router.push('/LogIn');
          return;
        }

        url = `${API_BASE_URL}/api/reviews/user`;
        const response = await axios.get<{ reviews: Review[] }>(url, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setReviews(response.data.reviews);
      } else {
        const response = await axios.get<{ reviews: Review[] }>(url);
        setReviews(response.data.reviews);
      }
    } catch (err: any) {
      console.error('Error fetching reviews:', err);
      setError('Failed to load reviews. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (reviewId: string) => {
    if (!confirm('Are you sure you want to delete this review?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/LogIn');
        return;
      }

      const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      await axios.delete(`${API_BASE_URL}/api/reviews/${reviewId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setReviews(reviews.filter(review => review._id !== reviewId));
    } catch (err: any) {
      console.error('Error deleting review:', err);
      alert('Failed to delete review. Please try again.');
    }
  };

  const filteredReviews = reviews.filter(review =>
    (review.destination?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    (review.title?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    (review.comment?.toLowerCase() || '').includes(searchTerm.toLowerCase())
  );

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const RatingStars = ({ rating }: { rating: number }) => {
    return (
      <div className="flex">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`h-4 w-4 ${i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Futuristic Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col md:flex-row justify-between items-center mb-12"
        >
          <div className="mb-6 md:mb-0">
            <div className="flex items-center space-x-2">
              <Rocket className="h-8 w-8 text-indigo-400" />
              <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-500">
                Voyage Reviews
              </h1>
            </div>
            <p className="text-gray-400 mt-2 max-w-lg">
              Explore authentic travel experiences from our global community of explorers
            </p>
          </div>

          {isAuthenticated && (
            <Link href="/reviews/new">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button className="group">
                  <Plus className="h-5 w-5 mr-2 group-hover:rotate-90 transition-transform" />
                  <span className="font-medium">New Review</span>
                </Button>
              </motion.div>
            </Link>
          )}
        </motion.div>

        {/* Search and Filter Panel */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="bg-gray-800/50 backdrop-blur-lg rounded-xl shadow-2xl p-6 mb-10 border border-gray-700"
        >
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search destinations, titles or comments..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-gray-900 border-indigo-500/30 text-white placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            </div>

            {isAuthenticated && (
              <div className="flex space-x-2">
                <Button
                  variant={filter === 'all' ? 'default' : 'outline'}
                  onClick={() => setFilter('all')}
                  className={`${filter === 'all' ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-gray-700 hover:bg-gray-600'} transition-colors`}
                >
                  <Globe className="h-4 w-4 mr-2" />
                  All Reviews
                </Button>
                <Button
                  variant={filter === 'mine' ? 'default' : 'outline'}
                  onClick={() => setFilter('mine')}
                  className={`${filter === 'mine' ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-gray-700 hover:bg-gray-600'} transition-colors`}
                >
                  <User className="h-4 w-4 mr-2" />
                  My Reviews
                </Button>
              </div>
            )}
          </div>
        </motion.div>

        {/* Error State */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-900/50 border border-red-700 text-red-100 px-4 py-3 rounded-lg mb-6 backdrop-blur-sm"
          >
            {error}
          </motion.div>
        )}

        {/* Loading State */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className={`h-80 rounded-xl bg-gray-800/50 border border-gray-700 ${shimmer}`} />
            ))}
          </div>
        ) :

          /* Empty State */
          filteredReviews.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="text-center py-16 bg-gray-800/50 rounded-xl shadow-lg border border-gray-700 backdrop-blur-sm"
            >
              <div className="mx-auto w-24 h-24 bg-indigo-900/30 rounded-full flex items-center justify-center mb-6">
                <Sparkles className="h-12 w-12 text-indigo-400" />
              </div>
              <h3 className="text-xl font-medium text-gray-200 mb-2">
                {searchTerm
                  ? 'No matching reviews found'
                  : filter === 'mine'
                    ? "You haven't shared any journeys yet"
                    : 'No reviews available yet'}
              </h3>
              <p className="text-gray-400 mb-6 max-w-md mx-auto">
                {searchTerm
                  ? 'Try different search terms or explore all reviews'
                  : 'Be the first to share your travel experience with our community'}
              </p>
              {isAuthenticated && (
                <Link href="/reviews/new">
                  <Button className="group">
                    <Plus className="h-5 w-5 mr-2 group-hover:rotate-90 transition-transform" />
                    Share Your Journey
                  </Button>
                </Link>
              )}
            </motion.div>
          ) :

            /* Reviews Grid */
            (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <AnimatePresence>
                  {filteredReviews.map((review) => (
                    <motion.div
                      key={review._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.3 }}
                      whileHover={{ y: -5 }}
                      onMouseEnter={() => setHoveredCard(review._id)}
                      onMouseLeave={() => setHoveredCard(null)}
                      className="relative overflow-hidden rounded-xl bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 shadow-lg"
                    >
                      {/* Hover effect overlay */}
                      <div className={`absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 opacity-0 transition-opacity duration-300 ${hoveredCard === review._id ? 'opacity-100' : ''}`} />

                      <div className="p-6 relative z-10">
                        {/* Review header with destination and rating */}
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3 className="text-xl font-semibold text-white line-clamp-1">{review.title}</h3>
                            <div className="flex items-center mt-2">
                              <MapPin className="h-4 w-4 text-indigo-400 mr-1.5" />
                              <span className="text-indigo-300 font-medium">{review.destination}</span>
                            </div>
                          </div>
                          <div className="flex items-center space-x-1">
                            <span className="text-white font-medium">{review.rating}</span>
                            <Star className="h-5 w-5 text-yellow-400 fill-current" />
                          </div>
                        </div>

                        {/* Rating stars */}
                        <div className="mb-4">
                          <RatingStars rating={review.rating} />
                        </div>

                        {/* Review comment */}
                        <p className="text-gray-300 mb-6 line-clamp-3">{review.comment}</p>

                        {/* User info and actions */}
                        <div className="flex items-center justify-between pt-4 border-t border-gray-700">
                          <div className="flex items-center">
                            <div className="relative">
                              <img
                                src={review.user.avatar || "/default-avatar.jpg"}
                                alt={review.user.username}
                                className="h-10 w-10 rounded-full object-cover border-2 border-indigo-500/30"
                              />
                              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-indigo-500 rounded-full border-2 border-gray-800"></div>
                            </div>
                            <div className="ml-3">
                              <p className="text-sm font-medium text-white">{review.user.username}</p>
                              <div className="flex items-center text-xs text-gray-400">
                                <Calendar className="h-3 w-3 mr-1" />
                                <span>Visited {formatDate(review.visitDate)}</span>
                              </div>
                            </div>
                          </div>

                          {isAuthenticated && user?.id === review.user._id && (
                            <div className="flex space-x-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => router.push(`/reviews/edit/${review._id}`)}
                                className="text-gray-400 hover:text-indigo-400 hover:bg-gray-700/50"
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDelete(review._id)}
                                className="text-gray-400 hover:text-red-400 hover:bg-gray-700/50"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
      </div>
    </div>
  );
}