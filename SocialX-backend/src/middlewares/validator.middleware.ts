import { Request, Response, NextFunction } from "express";

import { z, ZodError } from "zod";
import { ApiError } from "../utils/api.error";

export function validate(schema: z.ZodObject<any, any>) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errorMessages = error.issues.map((issue: any) => ({
          message: `${issue.path.join(".")} is ${issue.message}`,
        }));
        throw new ApiError(400, "Invalid Data", errorMessages);
      } else {
        res.status(500).json({ error: "Internal Server Error" });
      }
    }
  };
}
