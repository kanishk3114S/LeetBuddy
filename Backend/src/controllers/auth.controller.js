import userModel from "../models/user.model.js"
import crypto from "crypto" 
import jwt from "jsonwebtoken"
import config from "../config/config.js"; 
import { sessionModel } from "../models/session.model.js";

export async function registerUser(req , res) {
    const {username , email , password} = req.body

    const isUserAlreadyRegistered = await userModel.findOne({
        $or: [
            {username} , 
            {email} 
        ]
    })

    // FIX 1: Added 'return' to stop execution if user exists
    if(isUserAlreadyRegistered) {
        return res.status(409).json({
            message: "Username or email is already registered"
        })
    }

    const hashedPassword = crypto.createHash("sha256").update(password).digest("hex")

    const newUser = await userModel.create({
        username,
        email,
        password: hashedPassword
    })

    
    const refreshToken = jwt.sign({
        id : newUser._id,
    } , config.JWT_SECRET , {
        expiresIn : "7d"
    })
    
    const refreshTokenHash = crypto.createHash("sha256").update(refreshToken).digest("hex")

    const session = await sessionModel.create({
        user: newUser._id,
        refreshTokenHash,
        ip: req.ip,
        userAgent: req.headers["user-agent"],
    })
    
    const accessToken = jwt.sign({
        id : newUser._id,
        sessionId: session._id,
    } , config.JWT_SECRET, {
        expiresIn: "15m"
    })

    res.cookie("refreshToken" , refreshToken , {

        httpOnly: true, //http only meanss jo client side pe javascript run hone wali hai woh kabhi bhi cookies ko read nahi kar paegi
        secure: false,
        sameSite: "strict",
        maxAge: 7*24*60*60*1000 //7 days tak yeh cookie browser mein rahegi jisko tum Js ke through access nahi kar sakte ho.....//

    })

    return res.status(201).json({
        message: "User registered successfully",
        user:{
            id: newUser._id
        },
        token : accessToken
    })

}

export async function login(req,res) {

    const {email , password} = req.body

    const user = await userModel.findOne({
        email
    })

    if (!user) {
        return res.status(401).json({
            message : "Invalid email or password"
        })
    }

    const hashedPassword = crypto.createHash("sha256").update(password).digest("hex")

    if (hashedPassword !== user.password) {
        return res.status(401).json({
            message : "Invalid email or password"
        })
    }

    const refreshToken = jwt.sign({
        id: user._id
    }, config.JWT_SECRET,{
        expiresIn : "7d"
    }
)

    const refreshTokenHash = crypto.createHash("sha256").update(refreshToken).digest("hex")

    const session = await sessionModel.create({
        user: user._id,
        refreshTokenHash,
        ip: req.ip,
        userAgent: req.headers["user-agent"]
    })

    //create the accessToken//

    const accessToken = jwt.sign({
        id: user._id,
        sessionId: session._id
    }, config.JWT_SECRET , {
        expiresIn : "15m"
    })

    res.cookie("refreshToken"  , refreshToken , {
        httpOnly: true,
        secure: false,
        sameSite: "strict",
        maxAge: 7*24*60*60*1000
    })

    res.status(200).json({
        message: "Logged in successfully",
        token: accessToken
    })

}

export async function getMe(req , res) { //when user hit this end point of backend then the token has been verified
    
    const token = req.headers.authorization?.split(" ")[ 1 ];

    if (!token) {

        return res.status(401).json({
            message : "token not provided/found"
        })

    }

    const decoded = jwt.verify(token , config.JWT_SECRET); //DECODED WILL EXTRACT ALL THE DATA provided in the token//

    const user = await userModel.findById(decoded.id).select("-password");

    res.status(200).json({
        message: "User fetched successfully",
        user: user
    })

}

//lets create a auth function to create and send back the refresh token//

export async function refreshtoken(req,res) {

    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
        return res.status(401).json({
            message: "Refresh token not found"
        })
    }

    const decodedInfo = jwt.verify(refreshToken , config.JWT_SECRET)

    const refreshTokenHash = crypto.createHash("sha256").update(refreshToken).digest("hex")

    const session = await sessionModel.findOne({
        user: decodedInfo.id,
        refreshTokenHash,
        revoked: false
    })

    if (!session) {
       return res.status(401).json({
            message : "the session has not been found"
        })
    }
    
    const newAccessToken = jwt.sign({
        id: decodedInfo.id,
        sessionId: session._id
    },config.JWT_SECRET,{
        expiresIn: "15m"
    })
    
    const newRefreshToken = jwt.sign({
        id: decodedInfo.id
    },config.JWT_SECRET,{
        expiresIn: "7d"
    })

    //after creating the new refresh token add that into cookie + add the hash into the 

    const newRefreshTokenHash = crypto.createHash("sha256").update(newRefreshToken).digest("hex")

    session.refreshTokenHash = newRefreshTokenHash
    await session.save();
    
    res.cookie("refreshToken" , newRefreshToken, {
        httpOnly: true,
        secure: false,
        sameSite: "strict",
        maxAge: 7*24*60*60*1000 //7 days tak yeh cookie browser mein rahegi jisko tum Js ke through access nahi kar sakte ho.....//
    })

    return res.status(200).json({
        message: "New access token generated",
        token : newAccessToken
    })

}


export async function logout(req,res) {

    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
        return res.status(401).json({
            message: "the refresh token does not exist"
        })
    }

    
    const refreshTokenHash = crypto.createHash("sha256").update(refreshToken).digest("hex")

    const session = await sessionModel.findOne({ //means find the session from the models which has the following properties//
        refreshTokenHash,
        revoked: false
    })

    if (!session) {
        return res.status(400).json({
            message : "invalid refresh token"
        })
    }

    session.revoked = true;

    await session.save(); //save in the database but since the database is in

    res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: false,
        sameSite: "strict"
    })

    return res.status(200).json({
        message: "Logged out successfully"
    })

}

export async function logoutAll(req , res) {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
        return res.status(400).json({
            message: "Refresh token not found"
        })
    }

    const decoded = jwt.verify(refreshToken , config.JWT_SECRET)

    await sessionModel.updateMany({
        user: decoded.id,
        revoked: false,
    } , {
        revoked : true,
    })

    res.clearCookie("refreshToken")

    return res.status(200).json({
        message : "Logged out from all the devices"
    })

}
