import { type Request, type Response } from "express";
import { User } from "../models/User.js";
import jwt from "jsonwebtoken";
import { type AuthRequest } from "../middleware/authMiddleware.js";

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        message: "Invalid email or password",
        success: false,
      });
    }
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid email or password",
        success: false,
      });
    }
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET || "fallback_secret",
      { expiresIn: "1h" }
    );
    res.status(200).json({
      message: "Login successful",
      success: true,
      token,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      success: false,
    });
  }
};
export const register = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const newuser = new User({ email, password });
    await newuser.save();
    res.status(201).json({
      message: "User registered successfully",
      success: true,
    });
  } catch (error) {
    res.status(400).json({
      message: "Error registering user",
      success: false,
    });
  }
};

export const updateSetting = async (req: AuthRequest, res: Response) => {
  try {
    const { gradingSystem } = req.body;

    const userId = req.userId;

    if (!["font", "v-scale"].includes(gradingSystem)) {
      return res
        .status(400)
        .json({ message: "Invalid grading system", success: false });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res
        .status(404)
        .json({ message: "User not found", success: false });
    }
    user.gradingSystem = gradingSystem;
    await user.save();
    res
      .status(200)
      .json({
        message: "Settings updated successfully",
        success: true,
        gradingSystem: user.gradingSystem,
      });
  } catch (error) {
    res.status(500).json({ message: "Server error", success: false });
  }
};
