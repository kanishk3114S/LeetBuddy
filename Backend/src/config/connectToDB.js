import mongoose from "mongoose";
import config from "./config.js";

// Prevent uncaught exceptions on EventEmitter connection errors
mongoose.connection.on("error", (err) => {
    console.warn("[MongoDB] Connection error event (handled):", err.message);
});

mongoose.connection.on("disconnected", () => {
    console.warn("[MongoDB] Disconnected from Atlas. Mongoose will automatically reconnect.");
});

mongoose.connection.on("reconnected", () => {
    console.log("[MongoDB] Successfully reconnected to Atlas.");
});

async function connectDB() {
    if (!config.MONGO_URI) {
        console.warn("[MongoDB] MONGO_URI is missing in config");
        return;
    }

    try {
        await mongoose.connect(config.MONGO_URI, {
            serverSelectionTimeoutMS: 5000, // 5s timeout instead of hanging
            socketTimeoutMS: 45000,         // Close sockets after 45s of inactivity
            maxPoolSize: 10,                // Maintain up to 10 socket connections
            minPoolSize: 1,                 // Keep at least 1 socket alive
        });
        console.log("[MongoDB] Database connected successfully");
    } catch (error) {
        console.warn("[MongoDB] Connection warning (server continuing):", error.message || "Database connection failed");
    }
}

export default connectDB;
