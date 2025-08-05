const express = require('express');
const router = express.Router();
const { generatePayroll, getPayrollByEmployee } = require('../controllers/payrollController');
const authMiddleware = require('../middleware/authMiddleware');

// Route to generate payroll
router.post('/', authMiddleware, generatePayroll);
router.get('/:employeeId', authMiddleware, getPayrollByEmployee);

module.exports = router;