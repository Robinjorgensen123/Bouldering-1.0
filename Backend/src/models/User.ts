import mongoose, { Document } from "mongoose";
import bcrypt from "bcrypt";

export interface IUser extends Document {
  email: string;
  password: string;
}

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

UserSchema.pre<IUser>("save", async function (next) {
  const user = this;

  if (!this.isModified("password")) return;

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  } catch (error: any) {
    throw error;
  }
});

export const User = mongoose.model<IUser>("User", UserSchema);
