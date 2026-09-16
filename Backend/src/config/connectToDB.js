import mongoose from "mongoose";
import config from "./config.js"; //we have imported an object//

async function connectDB() {

    await mongoose.connect(config.MONGO_URI);
    console.log("The database has been connected")

}

export default connectDB;