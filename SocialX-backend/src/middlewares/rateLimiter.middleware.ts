import rateLimit from "express-rate-limit";
import { ApiError } from "../utils/api.error";

export const rateLimiterMiddleware = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  handler: (req, res, next) => {
    const error = new ApiError(
      429,
      "Too many requests please try again after 15 minutes",
    );
    next(error);
  },
  legacyHeaders: false,
  standardHeaders: true,
});
