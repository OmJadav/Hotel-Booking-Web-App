import jwt from "jsonwebtoken";
import User from "../models/userSchema.js";


export const verifyToken = async (req, res, next) => {
    try {
        let token;
        token = req.cookies.jwt
        if (token) {
            try {
                const decoded = jwt.verify(token, process.env.JWT_SECRET);
                req.user = await User.findById(decoded.userId).select('-password');
                next();
            } catch (error) {
                res.status(401).json({ error: "Unauthorized! - Invalid Token!" })
            }
        } else {
            res.status(401).json({ error: "No Token! Unauthorized!" })
        }
    } catch (error) {
        console.error("ERROR in TOKEN AUTHENTICATION (auth Middleware)-- ", error.message);
        res.status(401).json({ error: "Token authentication problem!" })
    }
}

export const verifyUser = (req, res, next) => {
    if (req.user.id === req.params.id || req.user.isAdmin) {
        next();
    } else {
        return res.status(400).json({ error: "You are not authorized!" });
    }
};

export const verifyAdmin = (req, res, next) => {
    if (req.user.isAdmin) {
        next();
    } else {
        return res.status(400).json({ error: "You are not authorized!" });
    }
};