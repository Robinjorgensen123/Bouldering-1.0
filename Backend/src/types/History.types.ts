import { Types } from "mongoose";

export interface IHistory extends Document {
  user: Types.ObjectId;
  boulder: Types.ObjectId;
  ascentType: "onsight" | "flash" | "redpoint";
  attempts: number;
  comment?: string;
  completedAt: Date;
}

export interface CreateHistoryDTO {
  boulder: string;
  ascentType: "onsight" | "flash" | "redpoint";
  attempts: number;
  comment?: string;
}
