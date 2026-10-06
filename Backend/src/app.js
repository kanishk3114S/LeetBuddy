import express from "express"
import morgan from "morgan" //morgan is a logger which tells which api is hit by whic user on which time like basically tells us the comepltely logging system//
import { authRouter } from "./routes/auth.routes.js"
import { leetcodeRouter } from "./routes/leetcode.routes.js"
import cookieParser from "cookie-parser"
import { verifyAccessToken } from "./middlewares/auth.middleware.js"

export const app = express()
app.use(cookieParser())

//middlewares//

app.use(express.json()) //converts the json file to req.body so that the backend system also get access//
app.use(morgan('dev'))

// General verification middleware: runs before any request reaches the backend route handlers
app.use(verifyAccessToken)

app.use("/api/auth", authRouter)
app.use("/api/leetcode", leetcodeRouter)
app.use("/api/v1/leetcode", leetcodeRouter)
