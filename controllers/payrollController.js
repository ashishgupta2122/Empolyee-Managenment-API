const Payroll = require('../models/Payroll');
const User = require('../models/User');
const mongoose = require('mongoose');

exports.generatePayroll = async (req, res) => {
    const { employeeId, month, year } = req.body;

    console.log('EmployeeId received:', employeeId);

    if (!mongoose.Types.ObjectId.isValid(employeeId)) {
        return res.status(400).json({ error: 'Invalid employee ID' });
    }

    try {
        const employee = await User.findById(employeeId);
        if (!employee) {
            return res.status(404).json({ error: 'Employee not found' });
        }

        const baseSalary = employee.salary || 0;
        const allowances = employee.allowances || 0;
        const deductions = (employee.pf || 0) + (employee.tax || 0);

        const netPay = baseSalary + allowances - deductions;

        const payroll = new Payroll({
            employeeId,
            month,
            year,
            salary: baseSalary + allowances,
            deductions,
            netPay
        });

        await payroll.save();
        res.status(201).json(payroll);
    } catch (error) {
        console.error('Payroll generation error:', error);
        res.status(500).json({ error: 'Error generating payroll' });
    }
};


exports.getPayrollByEmployee = async (req, res) => {
    const { employeeId } = req.params;
    try {
        const payrolls = await Payroll.find({ employeeId }).populate('employeeId');
        res.status(200).json(payrolls);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching payroll records' });
    }
};