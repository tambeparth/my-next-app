"use client";

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { Star } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import axios from 'axios';

interface ReviewFormProps {
  onSuccess?: () => void;
  initialData?: {
    id?: string;
    destination?: string;
    rating?: number;
    title?: string;
    comment?: string;
    visitDate?: string;
  };
  isEditing?: boolean;
}

export default function ReviewForm({ onSuccess, initialData, isEditing = false }: ReviewFormProps) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    destination: initialData?.destination || '',
    rating: initialData?.rating || 5,
    title: initialData?.title || '',
    comment: initialData?.comment || '',
    visitDate: initialData?.visitDate || new Date().toISOString().split('T')[0],
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [hoverRating, setHoverRating] = useState(0);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleRatingClick = (rating: number) => {
    setFormData(prev => ({ ...prev, rating }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/LogIn');
        return;
      }

      const headers = {
        Authorization: `Bearer ${token}`,
      };

      let response;
      if (isEditing && initialData?.id) {
        // Update existing review
        response = await axios.put(
          `http://localhost:5000/api/reviews/${initialData.id}`,
          formData,
          { headers }
        );
      } else {
        // Create new review
        response = await axios.post(
          'http://localhost:5000/api/reviews',
          formData,
          { headers }
        );
      }

      if (onSuccess) {
        onSuccess();
      } else {
        router.push('/reviews');
      }
    } catch (err: any) {
      console.error('Error submitting review:', err);
      setError(err.response?.data?.message || 'Failed to submit review. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto bg-white rounded-lg shadow-md p-6">
      <div className="text-center mb-6">
        <Badge className="mb-2">{isEditing ? 'Edit Review' : 'New Review'}</Badge>
        <h2 className="text-2xl font-bold">
          {isEditing ? 'Update Your Travel Experience' : 'Share Your Travel Experience'}
        </h2>
        <p className="text-gray-600 mt-2">
          Help other travelers by sharing your honest opinion about your trip
        </p>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="destination" className="block text-sm font-medium text-gray-700 mb-1">
            Destination
          </label>
          <Input
            id="destination"
            name="destination"
            value={formData.destination}
            onChange={handleChange}
            placeholder="e.g. Paris, France"
            required
          />
        </div>

        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
            Review Title
          </label>
          <Input
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="e.g. Amazing experience in Paris!"
            required
          />
        </div>

        <div>
          <label htmlFor="rating" className="block text-sm font-medium text-gray-700 mb-1">
            Rating
          </label>
          <div className="flex items-center space-x-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`h-8 w-8 cursor-pointer ${
                  star <= (hoverRating || formData.rating)
                    ? 'text-yellow-400 fill-current'
                    : 'text-gray-300'
                }`}
                onClick={() => handleRatingClick(star)}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
              />
            ))}
          </div>
        </div>

        <div>
          <label htmlFor="visitDate" className="block text-sm font-medium text-gray-700 mb-1">
            Visit Date
          </label>
          <Input
            type="date"
            id="visitDate"
            name="visitDate"
            value={formData.visitDate}
            onChange={handleChange}
            max={new Date().toISOString().split('T')[0]}
            required
          />
        </div>

        <div>
          <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-1">
            Your Review
          </label>
          <textarea
            id="comment"
            name="comment"
            value={formData.comment}
            onChange={handleChange}
            rows={5}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="Share details about your experience, what you liked, what could be improved..."
            required
          />
        </div>

        <div className="flex justify-end space-x-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? 'Submitting...' : isEditing ? 'Update Review' : 'Submit Review'}
          </Button>
        </div>
      </form>
    </div>
  );
}
