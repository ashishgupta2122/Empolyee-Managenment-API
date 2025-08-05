const Employee = require('../models/Employee');

exports.getAllEmployees = async (req, res) => {
    try {
        const employees = await Employee.find();
        res.status(200).json(employees);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching employees' });
    }
};

exports.createEmployee = async (req, res) => {
    const { name, email, position, department, salary } = req.body;
    try {
        const newEmployee = new Employee({ name, email, position, department, salary });
        await newEmployee.save();
        res.status(201).json(newEmployee);
    } catch (error) {
        res.status(500).json({ error: 'Error creating employee' });
    }
};