import mongoose, { Document, Schema } from "mongoose";

export interface IBoulder extends Document {
  name: string;
  grade: string;
  description?: string;
  location: {
    lat: number;
    lng: number;
  };
  imagesUrl?: string;
  topoData: {
    linePoints: { x: number; y: number }[];
    holds: {
      type: "start" | "finish" | "hand" | "foot";
      position: { x: number; y: number };
    }[];
  };
  author: mongoose.Types.ObjectId;
  createdAt: Date;
}

const BoulderSchema: Schema = new Schema({
  name: { type: String, required: true },
  grade: { type: String, required: true },
  description: { type: String },
  location: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
  },
  ImagesUrl: { type: String },
  topoData: {
    linePoints: [
      {
        x: { type: Number },
        y: { type: Number },
      },
    ],
    holds: [
      {
        type: {
          type: String,
          enum: ["start", "finish", "hand", "foot"],
          required: true,
        },
        position: {
          x: { type: Number, required: true },
          y: { type: Number, required: true },
        },
      },
    ],
  },

  author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  createdAt: { type: Date, default: Date.now },
});
export const Boulder = mongoose.model<IBoulder>("Boulder", BoulderSchema);
