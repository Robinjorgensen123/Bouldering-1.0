import { type Response } from "express";
import { type AuthRequest } from "../middleware/authMiddleware.js";
import { Boulder } from "../models/Boulder.js";
import { User } from "../models/User.js";
import { convertToFont, convertToVScale } from "../utils/gradeConverter.js";

export const createBoulder = async (req: AuthRequest, res: Response) => {
  try {
    const { name, grade, description, coordinates, imagesUrl, topoData } =
      req.body;
    const userId = req.userId;

    const user = await User.findById(userId);
    console.log(
      `DEBUG: User ${user?.email} has gradingSystem: ${user?.gradingSystem}`
    );
    if (!user) {
      return res
        .status(404)
        .json({ message: "User not found", success: false });
    }

    let gradeToSave = grade;

    if (user.gradingSystem?.toLowerCase() === "v-scale") {
      gradeToSave = convertToFont(grade);
    }
    const newBoulder = new Boulder({
      name,
      grade: gradeToSave.toUpperCase(),
      description,
      location: coordinates,
      imagesUrl,
      topoData,
      author: userId,
    });

    await newBoulder.save();

    res.status(201).json({
      message: "Boulder created successfully",
      success: true,
      data: newBoulder,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", success: false });
  }
};

export const getBoulders = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId;
    const user = await User.findById(userId);

    const boulders = await Boulder.find();

    const formattedBoulders = boulders.map((boulder) => {
      const b = boulder.toObject();

      if (user?.gradingSystem === "v-scale") {
        b.grade = convertToVScale(b.grade);
      }
      return b;
    });

    res.status(200).json({
      success: true,
      data: formattedBoulders,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", success: false });
  }
};

export const deleteBoulder = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.userId;

    const boulder = await Boulder.findById(id);

    if (!boulder) {
      return res
        .status(404)
        .json({ message: "Boulder not found", success: false });
    }

    if (boulder.author.toString() !== userId) {
      return res.status(403).json({
        message: "Not authorized to delete this boulder",
        success: false,
      });
    }

    await Boulder.findByIdAndDelete(id);

    res.status(200).json({
      message: "Boulder deleted successfully",
      success: true,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", success: false });
  }
};
