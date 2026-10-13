import mongoose from "mongoose";

const profileDataSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users", // References your User model
        required: true,
        unique: true  // Ensures one profile data document per user for V1
    },
    
    // Core Problem Solving Stats
    stats: {
        totalSolved: { type: Number, default: 0 },
        easySolved: { type: Number, default: 0 },
        mediumSolved: { type: Number, default: 0 },
        hardSolved: { type: Number, default: 0 },
        totalSubmissions: { type: Number, default: 0 },
        acceptedSubmissions: { type: Number, default: 0 },
        acceptanceRate: { type: Number, default: 0 }, // Stored as a percentage (e.g., 65.5)
        leetBuddyPoints: { type: Number, default: 0 } // Calculated before saving: (Easy*1 + Med*3 + Hard*5)
    },

    // Total available questions on LeetCode for percentage/progress calculations
    allQuestionsCount: {
        all: { type: Number, default: 0 },
        easy: { type: Number, default: 0 },
        medium: { type: Number, default: 0 },
        hard: { type: Number, default: 0 }
    },

    // Problem Solved Beats Percentages (e.g., beats 95.4% of users)
    beatsStats: {
        easy: { type: Number, default: 0 },
        medium: { type: Number, default: 0 },
        hard: { type: Number, default: 0 }
    },

    // User Profile Metadata from LeetCode
    profile: {
        ranking: { type: Number, default: 0 },
        userAvatar: String,
        realName: String,
        aboutMe: String
    },

    // Active / Most Recent Badge
    activeBadge: {
        id: String,
        name: String,
        icon: String
    },

    // Topic Wise Performance
    topics: [{
        tagName: String,        // e.g., "Dynamic Programming", "Arrays"
        problemsSolved: Number,
        category: String        // From LeetCode: "fundamental", "intermediate", or "advanced"
    }],

    // Badges Earned
    badges: [{
        id: String,
        name: String,           // e.g., "100 Days Badge 2026"
        icon: String,           // URL to the badge image
        category: String,
        creationDate: Date
    }],

    // Activity and Streaks (The "Green Streaks")
    activity: {
        currentStreak: { type: Number, default: 0 },
        maxStreak: { type: Number, default: 0 },
        totalActiveDays: { type: Number, default: 0 },
        activeYears: [Number],
        bestPerformingDay: {
            date: Date,
            submissionCount: Number
        }
    },

    // To store the raw daily submission calendar if needed for the frontend charting library
    // Map stores data as key-value pairs, perfect for LeetCode's {"timestamp": count} format
    submissionCalendar: {
        type: Map,
        of: Number 
    }

}, {
    timestamps: true 
});

const profileDataModel = mongoose.model("profileData", profileDataSchema);

export default profileDataModel;