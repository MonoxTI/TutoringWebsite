import jwt from "jsonwebtoken";
import { UserModel } from "../Models/DB.js";

export const Login = async (req, res) => {
  try {
    // Normalize and validate input
    const email = req.body.email?.toLowerCase().trim();
    const password = req.body.password;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password required" });
    }

    // Find user and include password field
    const user = await UserModel.findOne({ email }).select("+password");

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Verify password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Generate JWT
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    // Send response (no password, no role-specific naming)
    res.json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email
      }
    });
  } catch (error) {
    console.error("Login error:", error); // Log full error for debugging
    res.status(500).json({ message: "Login failed" });
  }
};