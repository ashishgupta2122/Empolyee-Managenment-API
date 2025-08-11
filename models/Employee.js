const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
    username: String,
    email: String,
    position: String,
    department: String,
    salary: Number,
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // important for populate
        required: true // optional, but ensures every employee has a user link
    }
});

module.exports = mongoose.model('Employee', employeeSchema);
