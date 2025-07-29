'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Star, MapPin, Calendar, Edit, Trash2, Plus, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import Link from 'next/link';
import axios from 'axios';
import ProtectedRoute from '@/components/ProtectedRoute';

interface Review {
    _id: string;
    destination: string;
    rating: number;
    title: string;
    comment: string;
    visitDate: string;
    createdAt: string;
}

const Dashboard = () => {
    const router = useRouter();
    const { user, isAuthenticated, logout } = useAuth();
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!isAuthenticated) {
            router.push('/LogIn');
            return;
        }

        fetchUserReviews();
    }, [isAuthenticated, router]);

    const fetchUserReviews = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                router.push('/LogIn');
                return;
            }

            const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
            const response = await axios.get<{ reviews: Review[] }>(`${API_BASE_URL}/api/reviews/user`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setReviews(response.data.reviews);
            setLoading(false);
        } catch (err: any) {
            console.error('Error fetching user reviews:', err);
            setError('Failed to load your reviews. Please try again later.');
            setLoading(false);
        }
    };

    const handleDeleteReview = async (reviewId: string) => {
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

            // Remove the deleted review from the state
            setReviews(reviews.filter(review => review._id !== reviewId));
        } catch (err: any) {
            console.error('Error deleting review:', err);
            alert('Failed to delete review. Please try again.');
        }
    };

    const formatDate = (dateString: string) => {
        const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    if (!isAuthenticated) {
        return null; // ProtectedRoute will handle redirecti
    }

    return (
        <ProtectedRoute>
            <div className="min-h-screen bg-gray-50">
                <div className="container mx-auto px-4 py-8">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* User Profile Card */}
                        <div className="bg-white rounded-lg shadow-md p-6">
                            <div className="flex items-center space-x-4 mb-6">
                                <img
                                    src={user?.avatar || "/avatar-svgrepo-com.svg"}
                                    alt={user?.username || "User"}
                                    className="h-16 w-16 rounded-full object-cover"
                                />
                                <div>
                                    <h2 className="text-xl font-bold">{user?.username}</h2>
                                    <p className="text-gray-600">{user?.email}</p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <Link href="/Profile">
                                    <Button variant="outline" className="w-full justify-between">
                                        Edit Profile
                                        <ChevronRight className="h-4 w-4" />
                                    </Button>
                                </Link>

                                <Link href="/reviews/new">
                                    <Button variant="outline" className="w-full justify-between">
                                        Write a Review
                                        <ChevronRight className="h-4 w-4" />
                                    </Button>
                                </Link>

                                <Button
                                    variant="outline"
                                    className="w-full justify-between text-red-500 hover:text-red-700"
                                    onClick={logout}
                                >
                                    Logout
                                    <ChevronRight className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>

                        {/* Main Content Area */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Reviews Section */}
                            <div className="bg-white rounded-lg shadow-md p-6">
                                <div className="flex justify-between items-center mb-6">
                                    <div>
                                        <h2 className="text-2xl font-bold">Your Reviews</h2>
                                        <p className="text-gray-600">Manage your travel experiences</p>
                                    </div>

                                    <Link href="/reviews/new">
                                        <Button>
                                            <Plus className="h-4 w-4 mr-2" />
                                            Add Review
                                        </Button>
                                    </Link>
                                </div>

                                {error && (
                                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                                        {error}
                                    </div>
                                )}

                                {loading ? (
                                    <div className="text-center py-8">
                                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                                        <p className="mt-4 text-gray-600">Loading your reviews...</p>
                                    </div>
                                ) : reviews.length === 0 ? (
                                    <div className="text-center py-8 bg-gray-50 rounded-lg">
                                        <p className="text-gray-600 mb-4">You haven't written any reviews yet.</p>
                                        <Link href="/reviews/new">
                                            <Button>Write Your First Review</Button>
                                        </Link>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {reviews.map((review) => (
                                            <div key={review._id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                                                <div className="flex justify-between items-start">
                                                    <div>
                                                        <h3 className="font-semibold text-lg">{review.title}</h3>
                                                        <div className="flex items-center text-sm text-gray-600 mt-1">
                                                            <MapPin className="h-4 w-4 mr-1" />
                                                            <span>{review.destination}</span>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center bg-gray-100 px-2 py-1 rounded">
                                                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                                                        <span className="ml-1 font-medium">{review.rating}</span>
                                                    </div>
                                                </div>

                                                <p className="text-gray-700 my-3 line-clamp-2">{review.comment}</p>

                                                <div className="flex items-center justify-between text-sm">
                                                    <div className="flex items-center text-gray-500">
                                                        <Calendar className="h-4 w-4 mr-1" />
                                                        <span>Visited {formatDate(review.visitDate)}</span>
                                                    </div>

                                                    <div className="flex space-x-2">
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => router.push(`/reviews/edit/${review._id}`)}
                                                        >
                                                            <Edit className="h-4 w-4" />
                                                        </Button>
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => handleDeleteReview(review._id)}
                                                        >
                                                            <Trash2 className="h-4 w-4 text-red-500" />
                                                        </Button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}

                                        <div className="text-center mt-4">
                                            <Link href="/reviews">
                                                <Button variant="outline">
                                                    View All Reviews
                                                    <ChevronRight className="h-4 w-4 ml-2" />
                                                </Button>
                                            </Link>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </ProtectedRoute>
    );
};

export default Dashboard;