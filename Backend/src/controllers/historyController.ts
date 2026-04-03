import { type Response } from "express";
import mongoose from "mongoose";
import { type AuthRequest } from "../middleware/authMiddleware.js";
import { History } from "../models/History.js";
import { User } from "../models/User.js";
import type { CreateHistoryDTO } from "../types/History.types.js";
import { convertToVScale } from "../utils/gradeConverter.js";

export const createHistoryRecord = async (req: AuthRequest, res: Response) => {
  try {
    const { boulder, ascentType, attempts, comment }: CreateHistoryDTO =
      req.body;

    if (!req.userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const historyData: any = {
      user: req.userId,
      boulder,
      ascentType,
      attempts,
      comment,
    };

    if (!ascentType) {
      return res.status(400).json({
        success: false,
        message: "Ascent type is required",
      });
    }

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
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

export const getHistoryByBoulder = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const history = await History.find({
      boulder: new mongoose.Types.ObjectId(id),
    })
      .populate("user", "email")
      .sort({ completedAt: -1 });

    return res.status(200).json({
      success: true,
      data: history,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error",
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

    const user = await User.findById(req.userId).select("gradingSystem");

    const history = await History.find({ user: req.userId })
      .populate("boulder", "name grade")
      .sort({ completedAt: -1 });

    const formattedHistory = history.map((record) => {
      const historyRecord = record.toObject();

      if (
        user?.gradingSystem === "v-scale" &&
        historyRecord.boulder &&
        typeof historyRecord.boulder === "object" &&
        "grade" in historyRecord.boulder &&
        typeof historyRecord.boulder.grade === "string"
      ) {
        historyRecord.boulder.grade = convertToVScale(
          historyRecord.boulder.grade,
        );
      }

      return historyRecord;
    });

    return res.status(200).json({
      success: true,
      data: formattedHistory,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
