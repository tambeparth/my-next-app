//backend/api/profile.js
const express = require("express");
const { getProfile, updateProfile } = require("../controllers/profileController");
const auth = require("../middleware/auth");

const router = express.Router();

router.get("/", auth, getProfile);
router.put("/update", auth, updateProfile);

module.exports = router;
