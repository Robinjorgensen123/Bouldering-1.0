import { type Response } from "express";
import { type AuthRequest } from "../middleware/authMiddleware.js";
import { History } from "../models/History.js";
import type { CreateHistoryDTO } from "../types/History.types.js";

export const createHistoryRecord = async (req: AuthRequest, res: Response) => {
  try {
    const { boulder, style, attempts, comment }: CreateHistoryDTO = req.body;

    if (!req.userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const historyData: any = {
      user: req.userId,
      boulder,
      style,
      attempts,
      comment,
    };

    if (comment !== undefined) {
      historyData.comment = comment;
    }

    const newRecord = new History(historyData);

    await newRecord.save();

    return res.status(201).json({
      success: true,
      message: "History record created successfully",
      data: newRecord,
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message || "Error creating history record",
    });
  }
};

export const getUserHistory = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }
    const history = await History.find({ user: req.userId })
      .populate("boulder", "name grade")
      .sort({ completedAt: -1 });

    return res.status(200).json({
      success: true,
      data: history,
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message || "Error fetching history",
    });
  }
};
