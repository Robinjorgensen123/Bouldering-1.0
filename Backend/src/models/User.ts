import mongoose, { Document, Schema } from "mongoose";
import bcrypt from "bcrypt";
import { type IUser as IUserBase } from "../types/User.types.js";

export interface IUserDocument extends Omit<IUserBase, "_id">, Document {
  password: string;
  comparePassword(password: string): Promise<boolean>;
}

const UserSchema: Schema<IUserDocument> = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    gradingSystem: { type: String, enum: ["font", "v-scale"], default: "font" },
  },
  { timestamps: true }
);

UserSchema.pre("save", async function (this: IUserDocument) {
  if (!this.isModified("password")) {
    return;
  }
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  } catch (error: any) {
    throw error;
  }
});

UserSchema.methods.comparePassword = async function (password: string) {
  return bcrypt.compare(password, this.password);
};

export const User = mongoose.model<IUserDocument>("User", UserSchema);
