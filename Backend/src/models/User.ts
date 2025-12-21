import mongoose, { Document } from "mongoose";
import bcrypt from "bcrypt";

export interface IUser extends Document {
  email: string;
  password: string;
  comparePassword(password: string): Promise<boolean>;
}

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

UserSchema.pre<IUser>("save", async function (this: IUser) {
  if (!this.isModified("password")) return;

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

UserSchema.methods.comparePassword = async function (password: string) {
  return bcrypt.compare(password, this.password);
};

export const User = mongoose.model<IUser>("User", UserSchema);
