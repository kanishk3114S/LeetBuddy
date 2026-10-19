import { app } from "./src/app.js";
import connectDB from "./src/config/connectToDB.js"

connectDB().catch(err => {
    console.warn("[MongoDB] Initial connection error:", err.message);
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`[LeetBuddy Backend] Server is listening on PORT ${PORT}`);
});