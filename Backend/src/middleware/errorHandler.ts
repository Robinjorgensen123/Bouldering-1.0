import {
  type ErrorRequestHandler,
  type NextFunction,
  type Request,
  type Response,
} from "express";

export const notFoundHandler = (
  req: Request,
  _res: Response,
  next: NextFunction,
) => {
  const error = new Error(`Route not found: ${req.originalUrl}`);
  (error as Error & { statusCode?: number }).statusCode = 404;
  next(error);
};

export const globalErrorHandler: ErrorRequestHandler = (
  error,
  _req,
  res,
  _next,
) => {
  const statusCode =
    (error as Error & { statusCode?: number }).statusCode ?? 500;
  const isProduction = process.env.NODE_ENV === "production";

  res.status(statusCode).json({
    success: false,
    message:
      isProduction && statusCode === 500
        ? "Internal server error"
        : error.message || "Unexpected server error",
  });
};
