import { type Response } from "express";
import { type AuthRequest } from "../middleware/authMiddleware.js";
import { User } from "../models/User.js";
import { type IUser } from "../types/User.types.js";
import mongoose from "mongoose";

export const updateSettings = async (req: AuthRequest, res: Response) => {
  try {
    const { gradingSystem } = req.body;
    const userId = req.userId;

    if (!["font", "v-scale"].includes(gradingSystem)) {
      return res.status(400).json({
        message: "Invalid grading system, use 'font' or 'v-scale'",
        success: false,
      });
    }

    const updatedUser = await User.findByIdAndUpdate(
      new mongoose.Types.ObjectId(userId as string),
      { gradingSystem: gradingSystem },
      { new: true, runValidators: true },
    ).select("-password");

    if (!updatedUser) {
      return res.status(404).json({
        message: "User not found",
        success: false,
      });
    }

    const userData: IUser = {
      _id: updatedUser._id.toString(),
      email: updatedUser.email,
      gradingSystem: updatedUser.gradingSystem as "font" | "v-scale",
    };

    res.status(200).json({
      message: "User settings updated successfully",
      success: true,
      data: userData,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      success: false,
    });
  }
};

export const changePassword = async (req: AuthRequest, res: Response) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({
        message: "Not authorized",
        success: false,
      });
    }

    if (currentPassword === newPassword) {
      return res.status(400).json({
        message: "New password must be different from current password",
        success: false,
      });
    }

    const user = await User.findById(new mongoose.Types.ObjectId(userId));

    if (!user) {
      return res.status(404).json({
        message: "User not found",
        success: false,
      });
    }

    const isCurrentPasswordValid = await user.comparePassword(currentPassword);
    if (!isCurrentPasswordValid) {
      return res.status(400).json({
        message: "Current password is incorrect",
        success: false,
      });
    }

    user.password = newPassword;
    await user.save();

    return res.status(200).json({
      message: "Password updated successfully",
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Server error",
      success: false,
    });
  }
};
