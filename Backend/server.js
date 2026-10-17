import { app } from "./src/app.js";
import connectDB from "./src/config/connectToDB.js"

connectDB().catch(err => {
    console.warn("[MongoDB] Initial connection error:", err.message);
});

app.listen(3000 , ()=>{
    console.log("server is listening to the PORT 3000")
})