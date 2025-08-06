const express = require('express');
const router = express.Router();
const { makeAttendance, getAttendance } = require('../controllers/attendanceController');
const authMiddleware = require('../middleware/authMiddleware');

// Route to mark attendance
router.post('/', authMiddleware, makeAttendance);

// Route to get attendance by employee ID
router.get('/:employeeId', authMiddleware, getAttendance);

module.exports = router;
