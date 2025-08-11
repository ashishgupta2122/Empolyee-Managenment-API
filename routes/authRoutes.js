const express = require('express');
const router = express.Router();
const { register, login, getProfile, logOut, deleteAccount } = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');

// Employee registration (public)
router.post('/register', register);

// Employee login (public)
router.post('/login', login);

// Get employee profile (protected)
router.get('/profile', authMiddleware, getProfile);

// Log out (public)
router.post('/logout', authMiddleware, logOut);

// Define account
router.delete('/delete:id', authMiddleware, deleteAccount);

module.exports = router;