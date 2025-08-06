const roleMiddleware = (...roles) => (req, res, next) => {
    console.log("👤 User role:", req.user.role);       // 🔥 ADD THIS
    console.log("✅ Allowed roles:", roles);            // 🔥 ADD THIS

    if (!roles.includes(req.user.role)) {
        return res.status(403).json({ error: 'Access denied' });
    }
    next();
};
module.exports = roleMiddleware;