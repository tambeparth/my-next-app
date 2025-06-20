const express = require('express');
const router = express.Router();
const { getProfile, updateProfile } = require('../controllers/profileController');
const auth = require('../middleware/auth');

// Profile routes
router.get('/', auth, getProfile);
router.put('/update', auth, updateProfile);

module.exports = router;