// leaveController.js
const Leave = require('../models/Leave'); // Assuming you have a Leave model
exports.applyLeave = async (req, res) => {
    try {
        const { employeeId, startDate, endDate, reason, leaveType } = req.body;

        if (!employeeId || !startDate || !endDate || !reason || !leaveType) {
            return res.status(400).json({ error: "All fields (employeeId, startDate, endDate, reason, leaveType) are required" });
        }

        const newLeave = new Leave({
            employeeId,
            startDate,
            endDate,
            reason,
            leaveType
        });

        await newLeave.save();  // ensure you await this

        console.log(`Leave applied by employee ${employeeId} from ${startDate} to ${endDate} for reason: ${reason}`);

        res.status(200).json({
            message: "Leave applied successfully",
            data: {
                employeeId,
                startDate,
                endDate,
                reason,
                leaveType
            }
        });
    } catch (error) {
        console.error("Error applying leave:", error);
        res.status(500).json({
            message: "An error occurred while applying for leave",
            error: error.message
        });
    }
};


exports.getLeaves = async (req, res) => {
    const { employeeId } = req.params;

    try {
        const leaves = await Leave.find({ employeeId });

        if (!leaves || leaves.length === 0) {
            return res.status(404).json({ error: "No leave records found for this employee" });
        }

        res.status(200).json({
            message: "Leaves fetched successfully",
            data: leaves
        });
    } catch (error) {
        console.error("Error fetching leaves:", error);
        res.status(500).json({ error: "Failed to fetch leave records" });
    }
};