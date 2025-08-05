const express = require('express');
const router = express.Router();
const { login, register, getprofile } = require('../controllers/authController.js');
const authMiddleware = require('../middleware/authMiddleware');

// Route to register a new user
router.post('/register', authMiddleware, register);
router.post('/login', authMiddleware, login);
router.get('/getprofile', authMiddleware, (req, res) => {
    res.json(req.user);
});