import mongoose from "mongoose";
import config from "./config.js";
import { ApiError } from "../utils/api-error.js";

async function connectDB() {
    if (!config.MONGO_URI) {
        throw new ApiError(500, "MongoDB URI is missing");
    }

    try {
        await mongoose.connect(config.MONGO_URI);
        console.log("The database has been connected");
    } catch (error) {
        throw new ApiError(500, error.message || "Database connection failed");
    }
}

export default connectDB;
