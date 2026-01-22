import { NextFunction, Request, Response } from "express";
import { User } from "../models/user.model";
import { ApiError } from "../utils/api.error";
import { asyncHandler } from "../utils/async-handler";
import jwt from "jsonwebtoken";
import { AccessTokenPayload } from "../types/jwt.types";

export const verifyJwt = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies?.accessToken;
    if (!token) {
      throw new ApiError(401, "Unauthorized access!Token missing");
    }
    try {
      const decodeToken = jwt.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET,
      ) as AccessTokenPayload;
      const user = await User.findById(decodeToken._id).select(
        "-password -emailVerificationToken -emailVerificationExpiry -refreshToken",
      );
      if (!user) {
        throw new ApiError(401, "Unauthorized access! user not found");
      }
      req.user = user;
      next();
    } catch (error) {
      throw new ApiError(401, "Unauthorized access token is invalid");
    }
  },
);
