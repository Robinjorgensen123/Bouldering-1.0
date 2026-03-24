import { type Request, type Response, type NextFunction } from "express";
import mongoose from "mongoose";

export const validateId = (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;

  if (!id || !mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({
      success: false,
      message: "Unknown ID-Format. Must be a 24-char hex-id",
    });
  }
  next();
};
