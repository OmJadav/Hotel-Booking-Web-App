import express from "express";
import { loginUser, logoutUser, registerUser } from "../controllers/authContoller.js";
import { verifyToken } from "../utils/verifyToken.js";

const router = express.Router();

router.post("/register", registerUser)
router.post("/login", loginUser)
router.post("/logout", verifyToken, logoutUser)

export default router;