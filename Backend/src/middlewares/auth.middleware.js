import jwt from "jsonwebtoken";
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
    if (ALLOW_PUBLIC_AUTH_ROUTES) {
        const isPublicRoute = PUBLIC_ROUTES.some(
            route => route.method === requestMethod && route.path === requestPath
        );

        if (isPublicRoute) {
            return next();
        }
    }

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

    // If no access token is provided, return 401 Unauthorized
    if (!token) {
        return res.status(401).json({
            message: "Access token not provided/found"
        });
    }

    try {
        // Verify JWT token signature and expiration
        const decoded = jwt.verify(token, config.JWT_SECRET);

        // Verify if session exists and is active (not revoked by logout / logoutAll)
        if (decoded.sessionId) {
            const session = await sessionModel.findById(decoded.sessionId);
            if (!session || session.revoked) {
                return res.status(401).json({
                    message: "Session has been revoked or expired. Please login again."
                });
            }
            req.session = session;
        }

        // Attach decoded user info to the request for subsequent handlers
        req.user = decoded;
        return next();
    } catch (error) {
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
