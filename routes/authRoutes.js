const express = require('express');
const router = express.Router();
const { register, login, getProfile } = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');

// Employee registration (public)
router.post('/register', register);

// Employee login (public)
router.post('/login', login);

// Get employee profile (protected)
router.get('/profile', authMiddleware, getProfile);

module.exports = router;