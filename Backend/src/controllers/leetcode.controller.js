import crypto from "crypto";
import userModel from "../models/user.model.js";

export const generateVerificationToken = async (req, res) => {
    try {
        const { leetcodeUsername } = req.body;
        const userId = req.user.id;

        if (!leetcodeUsername) {
            return res.status(400).json({ error: "LeetCode username is required" });
        }

        // Generate a random 12-character hex string and append prefix
        const rawToken = crypto.randomBytes(6).toString("hex");
        const verificationToken = `LeetBuddy-${rawToken}`;

        // Update user document with the new token and unverified status
        await userModel.findByIdAndUpdate(
            userId,
            {
                $set: {
                    "leetcode.username": leetcodeUsername,
                    "leetcode.verificationToken": verificationToken,
                    "leetcode.isVerified": false
                }
            },
            { new: true }
        );

        return res.status(200).json({
            message: "Token generated successfully",
            token: verificationToken,
            instructions: "Please paste this token into your LeetCode profile's 'About Me' section and click verify."
        });

    } catch (error) {
        console.error("Error generating token:", error);
        return res.status(500).json({ error: "Internal server error while generating token" });
    }
};
