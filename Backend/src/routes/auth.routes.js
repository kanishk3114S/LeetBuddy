import { Router } from "express";
import * as authController from "../controllers/auth.controller.js";

export const authRouter = Router();

authRouter.post("/register", authController.registerUser);
authRouter.get("/me", authController.getMe);

/*
GET /api/auth/refresh-token
*/

authRouter.get("/refresh-token" , authController.refreshtoken);

/*
GET /api/auth/Log-outs
*/

authRouter.get("/logout" , authController.logout);

/*
GET /api/auth/LogoutAll
*/

authRouter.get("/logoutAll" , authController.logoutAll);

/*
GET /api/auth/Login
*/

authRouter.post("/login" , authController.login);