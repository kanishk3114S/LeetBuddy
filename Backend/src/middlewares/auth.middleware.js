import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import config from "../config/config.js";
import { sessionModel } from "../models/session.model.js";

/**
 * Public routes whitelist:
 * Endpoints that do not require an accessToken (e.g., initial authentication endpoints).
 * Set ALLOW_PUBLIC_AUTH_ROUTES to false if you want every single request strictly blocked.
 */
export const ALLOW_PUBLIC_AUTH_ROUTES = true;

const PUBLIC_ROUTES = [
    { method: "POST", path: "/api/auth/register" },
    { method: "POST", path: "/api/auth/login" },
    { method: "GET", path: "/api/auth/refresh-token" },
    { method: "POST", path: "/api/v1/auth/register" },
    { method: "POST", path: "/api/v1/auth/login" },
    { method: "GET", path: "/api/v1/auth/refresh-token" },
    { method: "POST", path: "/api/leetcode/hero-card" },
    { method: "POST", path: "/api/v1/leetcode/hero-card" },
    { method: "POST", path: "/api/leetcode/refresh" },
    { method: "POST", path: "/api/v1/leetcode/refresh" },
];

/**
 * Generalized authentication verification middleware.
 * Runs on every incoming request before reaching backend controllers.
 * Checks for a valid accessToken in Authorization headers, custom headers, or cookies.
 */
export async function verifyAccessToken(req, res, next) {
    // Allow CORS preflight requests
    if (req.method === "OPTIONS") {
        return next();
    }

    const requestPath = (req.originalUrl || req.path).split("?")[0].replace(/\/+$/, "") || "/";
    const requestMethod = req.method.toUpperCase();

    // Check if the current route is in the public whitelist
    const isContestRoute = requestPath.startsWith("/api/v1/contests") || requestPath.startsWith("/api/contests");
    const isWeaknessRoute = requestPath.startsWith("/api/v1/weakness") || requestPath.startsWith("/api/weakness");
    const isPublicRoute = ALLOW_PUBLIC_AUTH_ROUTES && (
        isContestRoute ||
        isWeaknessRoute ||
        PUBLIC_ROUTES.some(
            route => route.method === requestMethod && route.path === requestPath
        )
    );

    // Extract access token from Authorization header, cookies, or custom headers
    let token = null;

    if (req.headers.authorization) {
        const parts = req.headers.authorization.split(" ");
        token = parts.length === 2 && parts[0] === "Bearer" ? parts[1] : req.headers.authorization;
    } else if (req.cookies?.accessToken) {
        token = req.cookies.accessToken;
    } else if (req.cookies?.token) {
        token = req.cookies.token;
    } else if (req.headers["x-access-token"]) {
        token = req.headers["x-access-token"];
    }

    // If no access token is provided, proceed if public or return 401
    if (!token) {
        if (isPublicRoute) {
            return next();
        }
        return res.status(401).json({
            message: "Access token not provided/found"
        });
    }

    try {
        // Verify JWT token signature and expiration
        const decoded = jwt.verify(token, config.JWT_SECRET);

        // Verify if session exists and is active (not revoked by logout / logoutAll)
        if (decoded.sessionId && mongoose.connection.readyState === 1) {
            try {
                const session = await sessionModel.findById(decoded.sessionId);
                if (!session || session.revoked) {
                    if (isPublicRoute) return next();
                    return res.status(401).json({
                        message: "Session has been revoked or expired. Please login again."
                    });
                }
                req.session = session;
            } catch (sessionErr) {
                console.warn("[Auth] Session validation skipped:", sessionErr.message);
            }
        }

        // Attach decoded user info to the request for subsequent handlers
        req.user = decoded;
        return next();
    } catch (error) {
        if (isPublicRoute) {
            return next();
        }
        if (error.name === "TokenExpiredError") {
            return res.status(401).json({
                message: "Access token has expired. Please refresh your token or login again."
            });
        }
        return res.status(401).json({
            message: "Invalid access token"
        });
    }
}
export const requireAuth = verifyAccessToken;
