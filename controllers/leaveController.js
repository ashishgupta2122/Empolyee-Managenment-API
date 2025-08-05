const Leave = require('../models/Leave');

exports.applyLeave = async (req, res) => {
    const { employeeId, startDate, endDate, reason } = req.body;
    try {
        const leave = new Leave({
            employeeId,
            leaveType: req.body.leaveType || 'Casual Leave',
            startDate: new Date(startDate),
            endDate: new Date(endDate),
            reason
        });
        await leave.save();
        res.status(201).json(leave);
    }
    catch (error) {
        res.status(500).json({ error: 'Error applying for leave' });
    }
};

exports.getLeavesByEmployee = async (req, res) => {
    const { employeeId } = req.params;
    try {
        const leaves = await Leave.find({ employeeId }).populate('employeeId');
        res.status(200).json(leaves);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching leave records' });
    }
};