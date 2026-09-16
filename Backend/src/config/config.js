import dotenv from "dotenv"
dotenv.config(); //without using this we can't use any of the environment variables

if (!process.env.MONGO_URI) {
    throw new Error("Mongo uri nahi hai , daal use pehle")
}

if (!process.env.JWT_SECRET) {
    throw new Error("JWT secret file key has not been defined in the environment variables")
}


const config = {
    MONGO_URI : process.env.MONGO_URI,
    JWT_SECRET: process.env.JWT_SECRET
}

export default config