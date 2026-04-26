import { NextFunction, Request, Response } from "express";
import { ApiError } from "../utils/api.error";

export const requireVerification = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (!req.user?.isEmailVerified) {
    throw new ApiError(403, "Email verification required");
  }
  next();
};
