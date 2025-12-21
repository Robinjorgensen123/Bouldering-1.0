import { type Request, type Response, type NextFunction } from "express";
import jwt from "jsonwebtoken";

export interface AuthRequest extends Request {
  userId?: string;
}

export const protect = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  let token: string | undefined;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(
        token!,
        process.env.JWT_SECRET || "fallback_secret"
      ) as unknown as { userId: string };
      req.userId = decoded.userId;
      return next();
    } catch (error) {
      return res
        .status(401)
        .json({ message: "Not authorized", success: false });
    }
  }

  if (!token) {
    return res
      .status(401)
      .json({ message: "Not authorized, no token", success: false });
  }
};
