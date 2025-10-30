const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const cors = require('cors');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4001;

// ✅ Connect to MongoDB only if not in test environment
if (process.env.NODE_ENV !== 'test') {
    connectDB()
        .then(() => console.log('✅ MongoDB connected'))
        .catch((err) => console.error('❌ MongoDB connection error:', err));
}

// ✅ Middleware
const allowedOrigins = (process.env.CLIENT_ORIGIN || 'http://localhost:5173')
    .split(',')
    .map((o) => o.trim());

app.use(cors({ origin: allowedOrigins, credentials: false }));
app.use(express.json());

// ✅ Routes
const authRoutes = require('./routes/authRoutes');
const leaveRoutes = require('./routes/leaveRoutes');
const attendanceRoutes = require('./routes/attendanceRoutes');
const payrollRoutes = require('./routes/payrollRoutes');
const employeeRoutes = require('./routes/employeeRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/employees', employeeRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/leave', leaveRoutes);
app.use('/api/payroll', payrollRoutes);

// ✅ Health check route (helps Jest confirm app works)
app.get('/', (req, res) => {
    res.json({ message: 'Server running successfully 🚀' });
});

// ✅ Start server only when not testing
if (process.env.NODE_ENV !== 'test') {
    app.listen(PORT, () => {
        console.log(`✅ Server is running on port ${PORT}`);
    });
}

// ✅ Export app for Jest
module.exports = app;
