import mongoose, { Schema, Document, Types } from "mongoose";
import { type IHistory } from "../types/History.types.js";

const HistorySchema: Schema<IHistory> = new mongoose.Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    boulder: { type: Schema.Types.ObjectId, ref: "Boulder", required: true },
    ascentType: {
      type: String,
      enum: ["onsight", "flash", "redpoint"],
      required: true,
    },
    attempts: { type: Number, default: 1, min: 1 },
    comment: { type: String, trim: true, maxLength: 500 },
    completedAt: { type: Date, default: Date.now },
  },
  { timestamps: true },
);

export const History = mongoose.model<IHistory>("History", HistorySchema);
