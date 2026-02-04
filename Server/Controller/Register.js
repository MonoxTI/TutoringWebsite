import { UserModel } from "../Models/DB.js";

// Basic email regex (adjust as needed)
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const Register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Validate required fields
    if (!username || !email || !password) {
      return res.status(400).json({
        message: "Username, email, and password are required",
      });
    }

    // Validate email format
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    // Validate username
    if (username.length < 3) {
      return res.status(400).json({ message: "Username must be at least 3 characters" });
    }
    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      return res.status(400).json({ message: "Username can only contain letters, numbers, and underscores" });
    }

    // Validate password length
    if (password.length < 6) {
      return res.status(400).json({
        message: "Password must be at least 6 characters long",
      });
    }

    // Check for existing user
    const existingUser = await UserModel.findOne({
      $or: [{ email }, { username }],
    });

    if (existingUser) {
      return res.status(409).json({
        message: "User with this email or username already exists",
      });
    }

    // Create user (password hashed automatically by pre-save hook)
    const user = await UserModel.create({
      username,
      email,
      password,
    });

    // Respond without password
    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Registration error:", error); // Log in dev
    res.status(500).json({
      message: "Registration failed",
    });
  }
};