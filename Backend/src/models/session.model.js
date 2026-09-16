import mongoose, { Mongoose } from "mongoose";

const sessionSchema = new mongoose.Schema({

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: [true , "User is required"] //[true , (if false)]
    } , 

    refreshTokenHash : {
        type: String , 
        required: [true , "Refresh Token hash is required"]
    } , 

    ip : {
        type : String , 
        required: [true , "IP Address is requried"]
    }, 

    userAgent : { //tells which browser version the user is using
        type: String , 
        required : [true , "User agent is required"]
    } ,

    revoked : {
        type : Boolean,
        default : false
    }

} , {
    timestamps : true
})

export const sessionModel = new mongoose.model("sessions" , sessionSchema)

