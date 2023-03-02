import express from "express";
import { getEmployees } from "../controllers/dashboard.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

//Requiring all for all routes below and or can attach it as a second function in get request
router.use(authMiddleware);

router.get("/dashboard", getEmployees);

export default router;
