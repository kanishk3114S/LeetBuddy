import { app } from "./src/app.js";
import connectDB from "./src/config/connectToDB.js"

connectDB();

app.listen(3000 , ()=>{
    console.log("server is listening to the PORT 3000")
})