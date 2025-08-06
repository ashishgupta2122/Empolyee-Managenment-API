const Employee = require('../models/Employee');

const getAllEmployees = async (req, res) => {
    try {
        const employees = await Employee.find();
        res.status(200).json(employees);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching employees' });
    }
};

const createEmployee = async (req, res) => {
    const { username, email, position, department, salary } = req.body;
    try {
        const newEmployee = new Employee({ username, email, position, department, salary });
        await newEmployee.save();
        res.status(201).json(newEmployee);
    } catch (error) {
        console.error("🔥 Error in createEmployee:", error);  // 👈 Add this
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

const deleteEmployee = async (req, res) => {
    const { id } = req.params;
    try {
        const employee = await Employee.findByIdAndDelete(id);
        if (!employee) {
            return res.status(404).json({ error: 'Employee not found' });
        }
        res.status(200).json({ message: 'Employee deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Error deleting employee' });
    }
};

module.exports = { getAllEmployees, createEmployee, updateEmployee, deleteEmployee };