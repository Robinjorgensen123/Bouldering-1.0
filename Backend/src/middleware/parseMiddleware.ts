import { type Request, type Response, type NextFunction } from "express";

export const parseFormData = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const jsonFields = ["coordinates", "topoData"];

    jsonFields.forEach((field) => {
      if (req.body[field] && typeof req.body[field] === "string") {
        req.body[field] = JSON.parse(req.body[field]);
      }
    });

    next();
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: "invalid JSON form data",
    });
  }
};
