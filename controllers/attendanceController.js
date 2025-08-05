const Attendance = require('../models/Attendance');

exports.markAttendance = async (req, res) => {
    const { employeeId, status, checkInTime, checkOutTime } = req.body;
    try {
        const attendance = new Attendance({
            employeeId,
            status,
            checkInTime: checkInTime ? new Date(checkInTime) : undefined,
            checkOutTime: checkOutTime ? new Date(checkOutTime) : undefined
        });
        await attendance.save();
        res.status(201).json(attendance);
    } catch (error) {
        res.status(500).json({ error: 'Error marking attendance' });
    }
};

exports.getAttendanceByEmployee = async (req, res) => {
    const { employeeId } = req.params;
    try {
        const attendanceRecords = await Attendance.find({ employeeId }).populate('employeeId');
        res.status(200).json(attendanceRecords);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching attendance records' });
    }
};