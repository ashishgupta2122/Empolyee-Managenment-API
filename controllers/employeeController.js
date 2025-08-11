const Employee = require('../models/Employee');
const User = require('../models/User');
const mongoose = require('mongoose');
const Leave = require('../models/Leave');
const Attendance = require('../models/Attendance');


const getAllEmployees = async (req, res) => {
    try {
        // Step 1: Populate userId while fetching employees
        const employees = await Employee.find().populate('userId');

        console.log("Employees in DB with populated userId:", employees);

        // Step 2: Filter only those where userId is actually populated (exists)
        const validEmployees = employees.filter(emp => emp.userId);
        console.log(validEmployees);
        res.status(200).json(employees);
    } catch (error) {
        console.error("Error in getAllEmployees:", error);
        res.status(500).json({ error: 'Error fetching employees' });
    }
};





const createEmployee = async (req, res) => {
    const { username, email, position, department, salary, employeeId } = req.body;
    try {
        const userExists = await User.findById(employeeId);
        if (!userExists) {
            return res.status(404).json({ error: 'User not found' });
        }
        const newEmployee = new Employee({ username, email, position, department, salary, _id: employeeId });
        await newEmployee.save();
        res.status(201).json(newEmployee);
    } catch (error) {
        console.error("Error in createEmployee:", error);  //  Add this
        res.status(500).json({ error: 'Error creating employee' });
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
