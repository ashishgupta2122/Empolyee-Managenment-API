const Attendance = require('../models/Attendance');
const User = require('../models/User');

exports.makeAttendance = async (req, res) => {
    try {
        const { employeeId, date, status } = req.body;

        const user = await User.findById(employeeId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const formattedStatus = status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();

        // Step 1: Mark attendance for the selected user
        const newAttendance = new Attendance({ employeeId, date, status: formattedStatus });
        await newAttendance.save();

        // Step 2: Get all employee IDs
        const allUsers = await User.find({}, '_id');
        const allUserIds = allUsers.map(user => user._id.toString()); // ✅ FIXED HERE

        // Step 3: Get all users whose attendance is already marked for this date
        const existingAttendance = await Attendance.find({ date });
        const alreadyMarkedIds = existingAttendance.map(a => a.employeeId.toString());

        // Step 4: Find users not yet marked
        const unmarkedUserIds = allUserIds.filter(id => !alreadyMarkedIds.includes(id));

        // Step 5: Mark 'Absent' for unmarked users
        for (const uid of unmarkedUserIds) {
            await Attendance.create({
                employeeId: uid,
                date,
                status: 'Absent'
            });
        }

        res.status(201).json({
            message: 'Attendance marked successfully. Unmarked users were set as Absent.',
            data: newAttendance,
            autoMarkedAbsent: unmarkedUserIds.length
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
        const user = await User.findById(employeeId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

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
