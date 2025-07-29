const express = require('express');
const router = express.Router();
const {
    getAllReviews,
    getReviewsByDestination,
    getUserReviews,
    getReviewById,
    createReview,
    updateReview,
    deleteReview
} = require('../controllers/reviewController');
const auth = require('../middleware/auth');

// Public routes
router.get('/', getAllReviews);
router.get('/destination/:destination', getReviewsByDestination);

// Protected routes (require authentication)
router.get('/user', auth, getUserReviews);
router.get('/:reviewId', auth, getReviewById);
router.post('/', auth, createReview);
router.put('/:reviewId', auth, updateReview);
router.delete('/:reviewId', auth, deleteReview);

module.exports = router;
