import jwt from "jsonwebtoken";
import { UserModel } from "../Models/DB.js";

//
export const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await UserModel.findById(decoded.id);

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    req.user = user; // attach logged-in owner
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};


//
export const authenticate = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "No token provided" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await UserModel.findById(decoded.id);
    if (!req.user) return res.status(401).json({ message: "User not found" });
    next();
  } catch {
    res.status(401).json({ message: "Invalid token" });
  }
};

// Only let through users with dashboard access
export const requireAccess = (req, res, next) => {
  if (!req.user.hasAccess()) {
    return res.status(403).json({ 
      message: "Your account is pending admin approval" 
    });
  }
  next();
};

// Only let through admins
export const requireAdmin = (req, res, next) => {
  if (!req.user.isAdmin()) {
    return res.status(403).json({ message: "Admin access required" });
  }
  next();
};
