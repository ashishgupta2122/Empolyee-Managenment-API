// middleware/authMiddleware.js
const jwt = require("jsonwebtoken");
const User = require("../models/User");

module.exports = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ error: "Access denied. No token provided." });
        }

        const token = authHeader.split(" ")[1];

        // 1. Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // 2. Find user
        const user = await User.findById(decoded.id);
        if (!user) {
            return res.status(401).json({ error: "User does not exist" });
        }

        // 3. Optional: Token match check (for logout/session invalidation)
        if (!user.activeTokens.includes(token)) {
            return res.status(401).json({ error: "Session expired or logged out" });
        }

        // 4. Set user data on req
        req.user = user;
        req.token = token;
        next();

    } catch (err) {
        console.error("Token verification failed:", err.message);
        return res.status(401).json({ error: "Unauthorized: Invalid or expired token" });
    }
};
