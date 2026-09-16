/*
You're importing Mongoose there not to connect to the DB again, but because you need Mongoose's tools to create the Schema and Model.
*/

import mongoose from "mongoose";

const userSchema = new mongoose.Schema({

    username : {
        type : String,
        required: [true , "Username is required"],
        unique: [true , "Username must be unique"]
    } ,

    email : {
        type : String,
        required: [true , "email is required"],
        unique: [true , "email must be unique"]        
    } , 

    password : {
        type : String , 
        required : [true , "password is required"]
    }

})

const userModel = mongoose.model("users" , userSchema);

/* 
users --> name in MongoDB atlaas
userModel --> name in the java script user model

*/


export default userModel

