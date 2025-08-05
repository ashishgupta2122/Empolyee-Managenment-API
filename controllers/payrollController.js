const Payroll = require('../models/Payroll');

exports.generatePayroll = async (req, res) => {
    const { employeeId, month, year } = req.body;
    try {
        const payroll = new Payroll({
            employeeId,
            month,
            year,
            // Calculate other payroll details (e.g., salary, deductions) here
        });
        await payroll.save();
        res.status(201).json(payroll);
    } catch (error) {
        res.status(500).json({ error: 'Error generating payroll' });
    }
}

exports.getPayrollByEmployee = async (req, res) => {
    const { employeeId } = req.params;
    try {
        const payrolls = await Payroll.find({ employeeId }).populate('employeeId');
        res.status(200).json(payrolls);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching payroll records' });
    }
};