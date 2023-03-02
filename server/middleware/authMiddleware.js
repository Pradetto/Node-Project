import jwt from "jsonwebtoken";
import User from "../models/User.js";

const authMiddleware = async (req, res, next) => {
  const token =
    req.header("Authorization") &&
    req.header("Authorization").replace("Bearer ", "");

  if (!token) {
    // Token is missing
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded._id);

    if (!token) {
      // Token is missing
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (!user) {
      throw new Error("User not found");
    }

    req.user = user;
    req.token = token;

    // Call the next middleware function
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token expired" });
    } else {
      // Invalid token
      return res.status(401).json({ message: "Unauthorized" });
    }
  }
};

export default authMiddleware;
