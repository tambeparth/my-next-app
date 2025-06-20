const User = require('../models/User');

// Get Profile Controller
const getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json({ user });
    } catch (err) {
        console.error('Profile fetch error:', err);
        res.status(500).json({ message: 'Error fetching profile' });
    }
};

// Update Profile Controller
const updateProfile = async (req, res) => {
    const { username, email, bio, location, interests, avatar } = req.body;
    try {
        const user = await User.findById(req.user.userId);
        if (!user) return res.status(404).json({ message: 'User not found' });

        // Update user fields if provided in the request
        if (username) user.username = username;
        if (email) user.email = email;
        if (bio !== undefined) user.bio = bio;
        if (location !== undefined) user.location = location;
        if (Array.isArray(interests)) user.interests = interests;
        if (avatar) user.avatar = avatar;

        await user.save();
        res.json({ message: 'Profile updated successfully', user });
    } catch (err) {
        console.error('Profile update error:', err);
        res.status(500).json({ message: 'Error updating profile' });
    }
};

module.exports = { getProfile, updateProfile };