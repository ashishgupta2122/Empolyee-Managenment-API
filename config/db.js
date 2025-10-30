const mongoose = require("mongoose");

let isConnected = false; // Track connection status

const connectDB = async () => {
    try {
        const db = await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
        });

        isConnected = db.connections[0].readyState;
        console.log("✅ MongoDB connected successfully");
    } catch (error) {
        console.error("❌ MongoDB connection failed:", error.message);
        // Don't use process.exit(1) in serverless
        throw new Error("MongoDB connection failed");
    }
};

module.exports = connectDB;
