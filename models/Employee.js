const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    position: String,
    department: String,
    salary: Number
});

module.exports = mongoose.model('Employee', employeeSchema);
