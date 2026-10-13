import crypto from "crypto";
import userModel from "../models/user.model.js";
import profileDataModel from "../models/profile-data.model.js";

// Master list of all recognized LeetCode topics across all 3 tiers
const ALL_LEETCODE_TOPICS = [
    // Fundamental
    { tagName: "Array", category: "fundamental" },
    { tagName: "String", category: "fundamental" },
    { tagName: "Sorting", category: "fundamental" },
    { tagName: "Two Pointers", category: "fundamental" },
    { tagName: "Stack", category: "fundamental" },
    { tagName: "Queue", category: "fundamental" },
    { tagName: "Linked List", category: "fundamental" },
    { tagName: "Matrix", category: "fundamental" },
    { tagName: "Simulation", category: "fundamental" },
    { tagName: "Enumeration", category: "fundamental" },

    // Intermediate
    { tagName: "Hash Table", category: "intermediate" },
    { tagName: "Tree", category: "intermediate" },
    { tagName: "Binary Tree", category: "intermediate" },
    { tagName: "Binary Search", category: "intermediate" },
    { tagName: "Graph Theory", category: "intermediate" },
    { tagName: "Breadth-First Search", category: "intermediate" },
    { tagName: "Depth-First Search", category: "intermediate" },
    { tagName: "Greedy", category: "intermediate" },
    { tagName: "Sliding Window", category: "intermediate" },
    { tagName: "Bit Manipulation", category: "intermediate" },
    { tagName: "Math", category: "intermediate" },
    { tagName: "Design", category: "intermediate" },
    { tagName: "Heap (Priority Queue)", category: "intermediate" },
    { tagName: "Recursion", category: "intermediate" },
    { tagName: "Ordered Set", category: "intermediate" },
    { tagName: "Brainteaser", category: "intermediate" },

    // Advanced
    { tagName: "Dynamic Programming", category: "advanced" },
    { tagName: "Backtracking", category: "advanced" },
    { tagName: "Trie", category: "advanced" },
    { tagName: "Union-Find", category: "advanced" },
    { tagName: "Segment Tree", category: "advanced" },
    { tagName: "Binary Indexed Tree", category: "advanced" },
    { tagName: "Monotonic Stack", category: "advanced" },
    { tagName: "Bitmask", category: "advanced" },
    { tagName: "Game Theory", category: "advanced" },
    { tagName: "Topological Sort", category: "advanced" },
    { tagName: "Divide and Conquer", category: "advanced" },
    { tagName: "Data Stream", category: "advanced" },
    { tagName: "Rolling Hash", category: "advanced" },
    { tagName: "Suffix Array", category: "advanced" },
    { tagName: "Quickselect", category: "advanced" }
];

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

export const verifyLeetCode = async (req, res) => {
    try {
        const userId = req.user.id;

        // 1. Database Lookup for pending username & token
        const user = await userModel.findById(userId);
        const { username, verificationToken } = user?.leetcode || {};

        if (!username || !verificationToken) {
            return res.status(400).json({ error: "No pending verification token found. Please generate one first." });
        }

        // 2. Fetch LeetCode 'aboutMe' bio via GraphQL
        const bioQuery = `
            query getUserProfile($username: String!) {
                matchedUser(username: $username) {
                    profile { aboutMe }
                }
            }
        `;

        const bioRes = await fetch("https://leetcode.com/graphql", {
            method: "POST",
            headers: { "Content-Type": "application/json", "Referer": "https://leetcode.com" },
            body: JSON.stringify({ query: bioQuery, variables: { username } })
        });

        const bioData = await bioRes.json();
        const aboutMe = bioData?.data?.matchedUser?.profile?.aboutMe || "";

        // 3. Match Check
        if (!aboutMe.includes(verificationToken)) {
            return res.status(400).json({ error: "Token not found, please try again" });
        }

        // 4. Mark verified & clear token for security
        await userModel.findByIdAndUpdate(userId, {
            $set: {
                "leetcode.isVerified": true,
                "leetcode.verificationToken": null,
                "leetcode.lastSynced": new Date()
            }
        });

        // 5. FETCH STATS, CALENDAR, TOPICS & BADGES (No submission queries)
        const statsQuery = `
            query getUserFullStats($username: String!) {
                matchedUser(username: $username) {
                    submitStats {
                        acSubmissionNum { difficulty count submissions }
                        totalSubmissionNum { difficulty count submissions }
                    }
                    userCalendar {
                        streak
                        totalActiveDays
                        submissionCalendar
                    }
                    tagProblemCounts {
                        fundamental { tagName problemsSolved }
                        intermediate { tagName problemsSolved }
                        advanced { tagName problemsSolved }
                    }
                    badges {
                        name
                        icon
                        creationDate
                    }
                }
            }
        `;

        const statsRes = await fetch("https://leetcode.com/graphql", {
            method: "POST",
            headers: { "Content-Type": "application/json", "Referer": "https://leetcode.com" },
            body: JSON.stringify({ query: statsQuery, variables: { username } })
        });

        const statsData = await statsRes.json();
        const userData = statsData?.data?.matchedUser;

        // Extract Problem Counts
        const acList = userData?.submitStats?.acSubmissionNum || [];
        const totalSolved = acList.find(x => x.difficulty === "All")?.count || 0;
        const easySolved = acList.find(x => x.difficulty === "Easy")?.count || 0;
        const mediumSolved = acList.find(x => x.difficulty === "Medium")?.count || 0;
        const hardSolved = acList.find(x => x.difficulty === "Hard")?.count || 0;

        // Submissions & Acceptance Rate
        const acceptedSubmissions = acList.find(x => x.difficulty === "All")?.submissions || 0;
        const totalSubmissions = userData?.submitStats?.totalSubmissionNum?.find(x => x.difficulty === "All")?.submissions || 0;
        const acceptanceRate = totalSubmissions > 0 ? Number(((acceptedSubmissions / totalSubmissions) * 100).toFixed(1)) : 0;

        // LeetBuddy Points: Easy: 1pt, Medium: 3pts, Hard: 5pts
        const leetBuddyPoints = (easySolved * 1) + (mediumSolved * 3) + (hardSolved * 5);

        // Map all topic questions solved
        const solvedMap = new Map();
        const userTags = [
            ...(userData?.tagProblemCounts?.fundamental || []).map(t => ({ ...t, category: "fundamental" })),
            ...(userData?.tagProblemCounts?.intermediate || []).map(t => ({ ...t, category: "intermediate" })),
            ...(userData?.tagProblemCounts?.advanced || []).map(t => ({ ...t, category: "advanced" }))
        ];

        userTags.forEach(t => {
            solvedMap.set(t.tagName.toLowerCase(), {
                problemsSolved: t.problemsSolved,
                category: t.category
            });
        });

        // Ensure ALL topics exist with question counts (defaults to 0 if not solved yet)
        const topics = ALL_LEETCODE_TOPICS.map(topic => {
            const found = solvedMap.get(topic.tagName.toLowerCase());
            return {
                tagName: topic.tagName,
                category: topic.category,
                problemsSolved: found ? found.problemsSolved : 0
            };
        });

        // Also append any extra tags LeetCode returned that weren't in the predefined list
        userTags.forEach(t => {
            if (!topics.some(existing => existing.tagName.toLowerCase() === t.tagName.toLowerCase())) {
                topics.push({
                    tagName: t.tagName,
                    category: t.category,
                    problemsSolved: t.problemsSolved
                });
            }
        });

        // Parse Calendar and find Best Performing Day
        const parsedCalendar = JSON.parse(userData?.userCalendar?.submissionCalendar || "{}");
        let bestPerformingDay = null;
        let maxSubmissionsOnDay = 0;

        for (const [timestamp, count] of Object.entries(parsedCalendar)) {
            if (count > maxSubmissionsOnDay) {
                maxSubmissionsOnDay = count;
                bestPerformingDay = {
                    date: new Date(Number(timestamp) * 1000),
                    submissionCount: count
                };
            }
        }

        // Format Badges
        const badges = (userData?.badges || []).map(b => ({
            name: b.name,
            icon: b.icon?.startsWith("http") ? b.icon : (b.icon ? `https://leetcode.com${b.icon}` : ""),
            creationDate: b.creationDate ? new Date(b.creationDate) : null
        }));

        // 6. SAVE / UPSERT TO DATABASE (profileDataModel)
        const profileData = await profileDataModel.findOneAndUpdate(
            { userId },
            {
                userId,
                stats: {
                    totalSolved,
                    easySolved,
                    mediumSolved,
                    hardSolved,
                    totalSubmissions,
                    acceptedSubmissions,
                    acceptanceRate,
                    leetBuddyPoints
                },
                topics,
                badges,
                activity: {
                    currentStreak: userData?.userCalendar?.streak || 0,
                    totalActiveDays: userData?.userCalendar?.totalActiveDays || 0,
                    bestPerformingDay
                },
                submissionCalendar: parsedCalendar
            },
            { upsert: true, new: true }
        );

        // 7. RETURN IN RESPONSE TO FRONTEND
        return res.status(200).json({
            message: "LeetCode profile verified and data synced successfully!",
            username,
            profile: profileData
        });

    } catch (error) {
        console.error("Error verifying LeetCode profile:", error);
        return res.status(500).json({ error: "Internal server error while verifying profile" });
    }
};