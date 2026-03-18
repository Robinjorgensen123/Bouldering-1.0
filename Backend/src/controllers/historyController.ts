import { type Response } from "express";
import mongoose from "mongoose";
import { type AuthRequest } from "../middleware/authMiddleware.js";
import { History } from "../models/History.js";
import type { CreateHistoryDTO } from "../types/History.types.js";

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
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message || "Error creating history record",
    });
  }
};

export const getHistoryByBoulder = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid boulder id",
      });
    }

    const history = await History.find({
      boulder: new mongoose.Types.ObjectId(id),
    })
      .populate("user", "email")
      .sort({ completedAt: -1 });

    return res.status(200).json({
      success: true,
      data: history,
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message || "Error fetching history for boulder",
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
