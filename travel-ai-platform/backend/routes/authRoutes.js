// backend/routes/authRoutes.js
const express = require('express');
const router = express.Router();
const { login, register } = require('../controllers/authController');

// Auth routes
router.post('/login', login);
router.post('/register', register); // Add this line

module.exports = router;