import { Types } from "mongoose";

export interface IHistory extends Document {
  user: Types.ObjectId;
  boulder: Types.ObjectId;
  style: "onsight" | "flash" | "redpoint";
  attempts: number;
  comment?: string;
  completedAt: Date;
}

export interface CreateHistoryDTO {
  boulder: string;
  style: "onsight" | "flash" | "redpoint";
  attempts: number;
  comment?: string;
}
