import express from "express";
import { login, register, logout, checkAuth } from "../controllers/auth.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/login", login);
router.post("/register", register);
router.post("/logout", logout);

// Route that requires authentication
router.get("/check-auth", authMiddleware, checkAuth);

export default router;
