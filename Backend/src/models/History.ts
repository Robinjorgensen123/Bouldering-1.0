import mongoose from "mongoose";
import { maxHeaderSize } from "node:http";

const HistorySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User reference is required"],
    },
    boulder: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Boulder",
      required: [true, "Boulder reference is required"],
    },
    style: {
      type: String,
      enum: {
        values: ["onsight", "flash", "redpoint"],
        message: "{VALUE} is not a valid",
      },
      required: [true, "Value is required"],
    },
    attempts: {
      type: Number,
      default: 1,
      min: [1, "Attempts cannot be less than 1"],
    },
    comment: {
      type: String,
      trim: true,
      maxLength: [500, "Comment cannot exceed 500 characters"],
    },
    completedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true },
);

HistorySchema.index({ user: 1, completedAt: -1 });

export const History = mongoose.model("History", HistorySchema);
