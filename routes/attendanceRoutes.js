const express = require('express');
const router = express.Router();
const { makeAttendance, getAttendance } = require('../controllers/attendanceController');
const authMiddleware = require('../middleware/authMiddleware');

// Route to make attendance
router.post('/', authMiddleware, makeAttendance);
router.get('/:employeeId', authMiddleware, getAttendance);

module.exports = router;