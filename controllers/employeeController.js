const Employee = require('../models/Employee');
const User = require('../models/User');
const mongoose = require('mongoose');
const Leave = require('../models/Leave');
const Attendance = require('../models/Attendance');


const getAllEmployees = async (req, res) => {
    try {
        // ✅ Step 1: Fetch all employees and populate userId from User model
        const employees = await Employee.find().populate('userId');
        console.log("📋 All Employees (with populate):", employees);

        // ✅ Step 2: Filter only those employees that have a valid linked user
        const validEmployees = employees.filter(emp => emp.userId);
        console.log("✅ Employees with valid userId populated:", validEmployees);

        // ✅ Step 3: Send filtered employees in response
        res.status(200).json({
            success: true,
            count: validEmployees.length,
            employees: validEmployees
        });

    } catch (error) {
        console.error("❌ Error in getAllEmployees:", error);
        res.status(500).json({
            success: false,
            message: 'Error fetching employees',
            error: error.message
        });
    }
};

const createEmployee = async (req, res) => {
    const { username, email, position, department, salary, employeeId } = req.body;

    try {
        // Step 1: Check if the user exists
        const userExists = await User.findById(employeeId);
        if (!userExists) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        // Step 2: Create a new employee and link to the userId
        const newEmployee = new Employee({
            username,
            email,
            position,
            department,
            salary,
            userId: employeeId  // Link employee to the user
        });

        // Step 3: Save employee to DB
        await newEmployee.save();
        console.log("✅ New Employee Created:", newEmployee);

        // Step 4: Respond with the created employee
        res.status(201).json({
            success: true,
            message: 'Employee created successfully',
            employee: newEmployee
        });

    } catch (error) {
        console.error("❌ Error in createEmployee:", error);
        res.status(500).json({
            success: false,
            message: 'Error creating employee',
            error: error.message
        });
    }
};



const updateEmployee = async (req, res) => {
    const { id } = req.params;
    const { username, email, position, department, salary } = req.body;
    try {
        const employee = await Employee.findById(id);
        if (!employee) {
            return res.status(404).json({ error: 'Employee not found' });
        }
        const userExists = await User.findById(employee._id);
        if (!userExists) {
            return res.status(404).json({ error: 'User not found' });
        }
        employee.username = username || employee.username;
        employee.email = email || employee.email;
        employee.position = position || employee.position;
        employee.department = department || employee.department;
        employee.salary = salary || employee.salary;
        await employee.save();
        res.status(200).json(employee);
    } catch (error) {
        res.status(500).json({ error: 'Error updating employee' });
    }
};

//Admin Panel - Delete Employee
const deleteEmployee = async (req, res) => {
    const { id } = req.params;
    try {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ error: 'Invalid employee ID' });
        }
        const employee = await Employee.findByIdAndDelete(id);
        if (!employee) {
            return res.status(404).json({ error: 'Employee not found' });
        }
        await User.findByIdAndDelete(id);
        await Leave.deleteMany({ employeeId: id });
        await Attendance.deleteMany({ employeeId: id });
    } catch (error) {
        res.status(500).json({ error: 'Error deleting employee' });
    }
};

module.exports = { getAllEmployees, createEmployee, updateEmployee, deleteEmployee };
