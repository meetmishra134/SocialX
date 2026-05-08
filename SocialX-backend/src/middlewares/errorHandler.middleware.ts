import { NextFunction, Request, Response } from "express";
import { ApiError } from "../utils/api.error";

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      statusCode: err.statusCode,
      message: err.message,
      errors: err.errors,
      success: false,
    });
  }

  return res.status(500).json({
    success: false,
    message: "Internal Server Error",
    error: err.message,
  });
};
