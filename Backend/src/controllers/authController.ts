import { type Request, type Response } from "express";
import { User } from "../models/User.js";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { type AuthResponse } from "../types/User.types.js";
import { sendPasswordResetEmail } from "../utils/mailer.js";

/// Login controller
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const normalizedEmail = String(email).trim().toLowerCase();

    const user = await User.findOne({ email: normalizedEmail });
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
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET!, {
      expiresIn: "24h",
    });

    const responseData: AuthResponse = {
      token,
      success: true,
      message: "Login successful",
      user: {
        _id: user._id.toString(),
        email: user.email,
        gradingSystem: user.gradingSystem,
      },
    };
    res.status(200).json(responseData);
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      success: false,
    });
  }
};

/// Register controller
export const register = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const normalizedEmail = String(email).trim().toLowerCase();

    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return res.status(409).json({
        message: "Email already in use",
        success: false,
      });
    }

    const newuser = new User({ email: normalizedEmail, password });
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

const RESET_RESPONSE_MESSAGE =
  "If an account exists for this email, a reset link has been generated.";

export const forgotPassword = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    const normalizedEmail = String(email).trim().toLowerCase();
    const user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      return res.status(200).json({
        success: true,
        message: RESET_RESPONSE_MESSAGE,
      });
    }

    const rawResetToken = crypto.randomBytes(32).toString("hex");
    const hashedResetToken = crypto
      .createHash("sha256")
      .update(rawResetToken)
      .digest("hex");

    user.passwordResetToken = hashedResetToken;
    user.passwordResetExpires = new Date(Date.now() + 1000 * 60 * 30);
    await user.save();

    const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
    const resetUrl = `${frontendUrl}/reset-password/${rawResetToken}`;

    await sendPasswordResetEmail(user.email, resetUrl);

    return res.status(200).json({
      success: true,
      message: RESET_RESPONSE_MESSAGE,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

export const resetPassword = async (req: Request, res: Response) => {
  try {
    const token = req.params["token"];
    const { password } = req.body;

    if (!token) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired reset token",
      });
    }

    const hashedResetToken = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");

    const user = await User.findOne({
      passwordResetToken: hashedResetToken,
      passwordResetExpires: { $gt: new Date() },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired reset token",
      });
    }

    user.password = password;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Password reset successful",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
