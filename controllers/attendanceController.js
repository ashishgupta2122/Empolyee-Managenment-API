const Attendance = require('../models/Attendance');

//  Controller to mark attendance
exports.makeAttendance = async (req, res) => {
    try {
        const { employeeId, date, status } = req.body;

        const formattedStatus = status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();

        // Save to database
        const newAttendance = new Attendance({ employeeId, date, status });
        await newAttendance.save();

        res.status(201).json({
            message: 'Attendance marked successfully',
            data: newAttendance
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error marking attendance' });
    }
};

//  Controller to get attendance by employee ID
exports.getAttendance = async (req, res) => {
    try {
        const { employeeId } = req.params;

        const records = await Attendance.find({ employeeId });

        if (!records || records.length === 0) {
            return res.status(404).json({ error: 'No attendance records found' });
        }

        res.status(200).json({
            message: 'Attendance records fetched successfully',
            data: records
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error fetching attendance records' });
    }
};
