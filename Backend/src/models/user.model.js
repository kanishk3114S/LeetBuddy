/*
You're importing Mongoose there not to connect to the DB again, but because you need Mongoose's tools to create the Schema and Model.
*/
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, "Username is required"],
        unique: [true, "Username must be unique"]
    },
    email: {
        type: String,
        required: [true, "email is required"],
        unique: [true, "email must be unique"]        
    }, 
    password: {
        type: String, 
        required: [true, "password is required"]
    },
    
    // LeetCode connection fields
    leetcode: {
        username: { 
            type: String, 
            default: null 
        },
        verificationToken: { 
            type: String, 
            default: null 
        },
        isVerified: { 
            type: Boolean, 
            default: false 
        },
        lastSynced: { 
            type: Date, 
            default: null 
        }
    }
}, {
    timestamps: true // This automatically adds and manages createdAt and updatedAt fields
});

const userModel = mongoose.model("users", userSchema);

/* 
users --> name in MongoDB atlas
userModel --> name in the javascript user model
*/

export default userModel;