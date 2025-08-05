const express = require('express');
const router = express.Router();
const { applyLeave, getLeaves } = require('../controllers/leaveController');
const authMiddleware = require('../middleware/authMiddleware');

// Route to apply for leave
router.post('/', authMiddleware, applyLeave);
router.get('/:employeeId', authMiddleware, getLeaves);

module.exports = router;