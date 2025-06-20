const Review = require('../models/Review');
const User = require('../models/User');

// Get all reviews
const getAllReviews = async (req, res) => {
    try {
        const reviews = await Review.find()
            .populate('user', 'username avatar')
            .sort({ createdAt: -1 });

        res.json({ reviews });
    } catch (err) {
        console.error('Error fetching reviews:', err);
        res.status(500).json({ message: 'Error fetching reviews' });
    }
};

// Get reviews by destination
const getReviewsByDestination = async (req, res) => {
    try {
        const { destination } = req.params;
        const reviews = await Review.find({ destination })
            .populate('user', 'username avatar')
            .sort({ createdAt: -1 });

        res.json({ reviews });
    } catch (err) {
        console.error('Error fetching destination reviews:', err);
        res.status(500).json({ message: 'Error fetching destination reviews' });
    }
};

// Get user's reviews
const getUserReviews = async (req, res) => {
    try {
        const reviews = await Review.find({ user: req.user.userId })
            .sort({ createdAt: -1 });

        res.json({ reviews });
    } catch (err) {
        console.error('Error fetching user reviews:', err);
        res.status(500).json({ message: 'Error fetching user reviews' });
    }
};

// Get a single review by ID
const getReviewById = async (req, res) => {
    try {
        const { reviewId } = req.params;
        const review = await Review.findById(reviewId);

        if (!review) {
            return res.status(404).json({ message: 'Review not found' });
        }

        res.json({ review });
    } catch (err) {
        console.error('Error fetching review:', err);
        res.status(500).json({ message: 'Error fetching review' });
    }
};

// Create a review
const createReview = async (req, res) => {
    try {
        const { destination, rating, title, comment, visitDate, photos } = req.body;

        const newReview = new Review({
            user: req.user.userId,
            destination,
            rating,
            title,
            comment,
            visitDate: visitDate || Date.now(),
            photos: photos || []
        });

        await newReview.save();

        res.status(201).json({
            message: 'Review created successfully',
            review: newReview
        });
    } catch (err) {
        console.error('Error creating review:', err);
        res.status(500).json({ message: 'Error creating review' });
    }
};

// Update a review
const updateReview = async (req, res) => {
    try {
        const { reviewId } = req.params;
        const { destination, rating, title, comment, visitDate, photos } = req.body;

        const review = await Review.findById(reviewId);

        if (!review) {
            return res.status(404).json({ message: 'Review not found' });
        }

        // Check if the user is the owner of the review
        if (review.user.toString() !== req.user.userId) {
            return res.status(403).json({ message: 'Not authorized to update this review' });
        }

        // Update fields
        review.destination = destination || review.destination;
        review.rating = rating || review.rating;
        review.title = title || review.title;
        review.comment = comment || review.comment;
        review.visitDate = visitDate || review.visitDate;
        review.photos = photos || review.photos;
        review.updatedAt = Date.now();

        await review.save();

        res.json({
            message: 'Review updated successfully',
            review
        });
    } catch (err) {
        console.error('Error updating review:', err);
        res.status(500).json({ message: 'Error updating review' });
    }
};

// Delete a review
const deleteReview = async (req, res) => {
    try {
        const { reviewId } = req.params;

        const review = await Review.findById(reviewId);

        if (!review) {
            return res.status(404).json({ message: 'Review not found' });
        }

        // Check if the user is the owner of the review
        if (review.user.toString() !== req.user.userId) {
            return res.status(403).json({ message: 'Not authorized to delete this review' });
        }

        await Review.findByIdAndDelete(reviewId);

        res.json({ message: 'Review deleted successfully' });
    } catch (err) {
        console.error('Error deleting review:', err);
        res.status(500).json({ message: 'Error deleting review' });
    }
};

module.exports = {
    getAllReviews,
    getReviewsByDestination,
    getUserReviews,
    getReviewById,
    createReview,
    updateReview,
    deleteReview
};
