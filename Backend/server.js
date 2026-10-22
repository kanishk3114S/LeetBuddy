import { app } from "./src/app.js";
import connectDB from "./src/config/connectToDB.js";
import mongoose from "mongoose";

// Catch any unhandled promise rejections so the Node container never crashes
process.on("unhandledRejection", (reason, promise) => {
    console.error("[Process] Unhandled Rejection at:", promise, "reason:", reason);
});

// Catch any uncaught exceptions to prevent sudden container death
process.on("uncaughtException", (error) => {
    console.error("[Process] Uncaught Exception caught:", error);
});

connectDB().catch(err => {
    console.warn("[MongoDB] Initial connection error:", err.message);
});

const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, () => {
    console.log(`[LeetBuddy Backend] Server is listening on PORT ${PORT}`);
});

// FIX: Prevent Render / Cloudflare 502/503 Bad Gateway caused by proxy socket race conditions
// Render proxy timeout is ~100s. Node's default is 5s, which causes ECONNRESET on idle connections.
server.keepAliveTimeout = 120000; // 120 seconds
server.headersTimeout = 125000;   // 125 seconds

// Graceful shutdown handling for Render zero-downtime redeploys
const gracefulShutdown = (signal) => {
    console.log(`[Process] ${signal} signal received: closing HTTP server gracefully.`);
    server.close(() => {
        console.log("[Process] HTTP server closed.");
        mongoose.connection.close(false).then(() => {
            console.log("[Process] MongoDB connection closed.");
            process.exit(0);
        }).catch(() => process.exit(0));
    });
};

process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
process.on("SIGINT", () => gracefulShutdown("SIGINT"));
