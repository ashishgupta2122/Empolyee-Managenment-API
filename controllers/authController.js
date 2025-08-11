// controllers/authController.js
const User = require('../models/User');
const Leave = require('../models/Leave');
const Attendance = require('../models/Attendance');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const Employee = require('../models/Employee');

// Register a new user
exports.register = async (req, res) => {
    try {
        const { username, email, password, role } = req.body;
        console.log('Register request body:', req.body);
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ success: false, error: 'User already exists' });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({ username, email, password: hashedPassword, role });
        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.status(201).json({ success: true, user: { id: user._id, username, email, role }, token });
    } catch (error) {
        console.error('Register error:', error); // Debug log
        res.status(500).json({ success: false, error: error.message });
    }
};
// User login
exports.login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ error: 'User not found' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ error: 'Invalid credentials' });

        const token = jwt.sign(
            { id: user._id, role: user.role },   //include role here!
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );
        user.activeTokens.push(token);
        await user.save();


        res.json({
            token,
            user: {
                id: user._id,
                username: user.username,  //  use "username" not "name"
                email: user.email,
                role: user.role
            }
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getProfile = async (req, res) => {
    try {
        const existingUser = await User.findById(req.user.id).select('-password -currentToken'); // exclude sensitive fields
        if (!existingUser) {
            return res.status(404).json({
                success: false,
                error: 'User not found'
            });
        }

        res.status(200).json({
            success: true,
            message: "User profile fetched successfully",
            data: {
                id: existingUser._id,
                username: existingUser.username,
                email: existingUser.email,
                role: existingUser.role,
                createdAt: existingUser.createdAt,
                updatedAt: existingUser.updatedAt
            }
        });

    } catch (error) {
        console.error("Error in getProfile:", error);
        res.status(500).json({
            success: false,
            error: 'Internal server error while fetching user profile'
        });
    }
};


exports.logOut = async (req, res) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ error: "No token provided" });
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id);

        if (!user) {
            return res.status(401).json({ error: "User not found" });
        }

        // Remove the token from activeTokens array
        user.activeTokens = user.activeTokens.filter(t => t !== token);
        await user.save();

        res.status(200).json({
            success: true,
            message: "Logout successful. Token invalidated.",
        });

    } catch (error) {
        console.error("Logout error:", error);
        res.status(500).json({
            success: false,
            error: "An error occurred while logging out."
        });
    }
};

exports.deleteAccount = async (req, res) => {
    const userId = req.user.id;
    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        // Delete associated data
        await Leave.deleteMany({ user: userId });
        await Attendance.deleteMany({ user: userId });
        await User.findByIdAndDelete(userId);
        res.status(200).json({ success: true, message: 'Account deleted successfully' });
    } catch (error) {
        console.error("Error deleting account:", error);
    }
}
