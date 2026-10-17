import mongoose from "mongoose";
import config from "./config.js";

async function connectDB() {
    if (!config.MONGO_URI) {
        console.warn("[MongoDB] MONGO_URI is missing in config");
        return;
    }

    try {
        await mongoose.connect(config.MONGO_URI, {
            serverSelectionTimeoutMS: 5000 // 5s timeout instead of hanging
        });
        console.log("[MongoDB] Database connected successfully");
    } catch (error) {
        console.warn("[MongoDB] Connection warning (server continuing):", error.message || "Database connection failed");
    }
}

export default connectDB;
