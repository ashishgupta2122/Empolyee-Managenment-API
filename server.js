const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const cors = require('cors');

const app = express();
dotenv.config();

const PORT = process.env.PORT || 4001;

// Connect to MongoDB
connectDB();

// Middlewares
const allowedOrigins = (process.env.CLIENT_ORIGIN || 'http://localhost:5173')
    .split(',')
    .map(o => o.trim());
app.use(cors({ origin: allowedOrigins, credentials: false }));
app.use(express.json());

// Routes
const authRoutes = require('./routes/authRoutes');
const leaveRoutes = require('./routes/leaveRoutes');
const attendanceRoutes = require('./routes/attendanceRoutes');
const payrollRoutes = require('./routes/payrollRoutes');
const employeeRoutes = require('./routes/employeeRoutes');

// API Endpoints
app.use('/api/auth', authRoutes);
app.use('/api/employees', employeeRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/leave', leaveRoutes);
app.use('/api/payroll', payrollRoutes);

// Server Start
app.listen(PORT, () => {
    console.log(`✅ Server is running on port ${PORT}`);
});