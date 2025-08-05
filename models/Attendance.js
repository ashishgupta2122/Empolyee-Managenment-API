const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
    employeeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Employee',
        required: true
    },
    date: {
        type: Date,
        default: Date.now,
        required: true
    },
    status: {
        type: String,
        enum: ['Present', 'Absent', 'Leave'],
        default: 'Present'
    },
    checkInTime: {
        type: Date
    },
    checkOutTime: {
        type: Date
    }
}, { timestamps: true });

module.exports = mongoose.model('Attendance', attendanceSchema);