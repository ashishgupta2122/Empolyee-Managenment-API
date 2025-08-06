const mongoose = require('mongoose');

const leaveSchema = new mongoose.Schema({
    employeeId: {
        type: String, // Or ObjectId if referencing Employee model
        required: true
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    },
    reason: {
        type: String,
        required: true
    },
    leaveType: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('Leave', leaveSchema);
