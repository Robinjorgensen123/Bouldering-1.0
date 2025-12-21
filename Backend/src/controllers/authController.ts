import { type Request, type Response } from "express";
import { User } from "../models/User.js";

export const register = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const newuser = new User({ email, password });
    await newuser.save();
    res.status(201).json({
      message: "User registered successfully",
      success: true,
    });
  } catch (error) {
    res.status(400).json({
      message: "Error registering user",
      success: false,
    });
  }
};
