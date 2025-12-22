import { type Response } from "express";
import { type AuthRequest } from "../middleware/authMiddleware.js";
import { User } from "../models/User.js";

export const updateSetting = async (req: AuthRequest, res: Response) => {
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
      userId,
      { gradingSystem: gradingSystem },
      { new: true, runValidators: true }
    ).select("-password");

    if (!updatedUser) {
      return res.status(404).json({
        message: "User not found",
        success: false,
      });
    }

    res.status(200).json({
      message: "User settings updated successfully",
      success: true,
      data: updatedUser,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      success: false,
    });
  }
};
