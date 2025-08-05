const mongoose = require('mongoose');

const payrollSchema = new mongoose.Schema({
    employeeId: mongoose.Schema.Types.ObjectId,
    month: String,
    basicSalary: Number,
    deductions: Number,
    netSalary: Number
}, { timestamps: true });
module.exports = mongoose.model('Payroll', payrollSchema);