import { type IBoulder } from "../types/Boulder.types.js";
import mongoose, { Document, Schema } from "mongoose";

export interface IBoulderDocument extends Omit<IBoulder, "_id">, Document {
  _id: mongoose.Types.ObjectId;
}

const BoulderSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    grade: { type: String, required: true },
    description: { type: String },
    location: { type: String, required: true },
    coordinates: {
      lat: { type: Number, required: true },
      lng: { type: Number, required: true },
    },
    imagesUrl: { type: String },
    topoData: {
      linePoints: [
        {
          x: { type: Number },
          y: { type: Number },
        },
      ],
    },

    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Boulder = mongoose.model<IBoulderDocument>(
  "Boulder",
  BoulderSchema
);
