import { type Response } from "express";
import { type AuthRequest } from "../middleware/authMiddleware.js";
import { type IBoulder } from "../types/Boulder.types.js";
import { Boulder } from "../models/Boulder.js";
import { User } from "../models/User.js";
import { convertToFont, convertToVScale } from "../utils/gradeConverter.js";

export const createBoulder = async (req: AuthRequest, res: Response) => {
  try {
    let {
      name,
      grade,
      description,
      coordinates,
      location,
      imagesUrl,
      topoData,
    } = req.body;
    const userId = req.userId;

    const user = await User.findById(userId);
    if (!user) {
      return res
        .status(404)
        .json({ message: "User not found", success: false });
    }

    const finalImageUrl = req.file ? req.file.path : imagesUrl;

    let gradeToSave = grade;

    if (user.gradingSystem?.toLowerCase() === "v-scale") {
      gradeToSave = convertToFont(grade);
    }

    const newBoulder = new Boulder({
      name,
      grade: gradeToSave.toUpperCase(),
      description,
      location,
      coordinates,
      imagesUrl: finalImageUrl,
      topoData,
      author: userId,
    });

    await newBoulder.save();

    res.status(201).json({
      message: "Boulder created successfully",
      success: true,
      data: newBoulder.toObject() as unknown as IBoulder,
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

    const formattedBoulders: IBoulder[] = boulders.map((boulder) => {
      const b = boulder.toObject() as unknown as IBoulder;

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

export const updateBoulder = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.userId;

    const boulder = await Boulder.findById(id);

    if (!boulder) {
      return res.status(404).json({
        success: false,
        message: "Could not find the specified boulder",
      });
    }

    if (boulder.author.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to update this boulder",
      });
    }

    const updateFields: any = { ...req.body };

    if (req.file) {
      updateFields.imagesUrl = req.file.path;
    }

    if (req.body.coordinates) {
      updateFields.coordinates =
        typeof req.body.coordinates === "string"
          ? JSON.parse(req.body.coordinates)
          : req.body.coordinates;
    }

    if (req.body.location) {
      updateFields.location = req.body.location;
    }

    if (req.body.grade) {
      const user = await User.findById(userId);
      if (user?.gradingSystem?.toLowerCase() === "v-scale") {
        updateFields.grade = convertToFont(req.body.grade.toUpperCase());
      }
    }

    const updatedBoulder = await Boulder.findByIdAndUpdate(
      id,
      { $set: updateFields },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: "Boulder updated successfully",
      data: updatedBoulder as unknown as IBoulder,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error during update",
    });
  }
};
