const express = require('express');
const router = express.Router();
const { getAllEmployees, createEmployee, updateEmployee, deleteEmployee } = require('../controllers/employeeController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

router.get('/', authMiddleware, getAllEmployees);
router.post('/', authMiddleware, roleMiddleware('Admin'), createEmployee);
router.put('/:id', authMiddleware, roleMiddleware('Admin'), updateEmployee);
router.delete('/:id', authMiddleware, roleMiddleware('Admin'), deleteEmployee);

module.exports = router;