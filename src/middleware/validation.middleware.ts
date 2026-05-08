import { Request, Response, NextFunction } from "express";
import { z } from "zod";
import { sendError } from "../utils/response";

/**
 * Middleware ตรวจสอบ req.body ด้วย Zod schema
 */
export const validateRequest = (schema: z.ZodSchema<unknown>) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        sendError(
          res,
          400,
          "Validation error",
          {
            errors: error.errors.map((err) => ({
              field: err.path.join("."),
              message: err.message,
            })),
          }
        );
        return;
      }
      next(error);
    }
  };
};

/**
 * Middleware ตรวจสอบ req.params ด้วย Zod schema
 */
export const validateParams = (schema: z.ZodSchema<unknown>) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      schema.parse(req.params);
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        sendError(
          res,
          400,
          "Invalid parameters",
          {
            errors: error.errors.map((err) => ({
              field: err.path.join("."),
              message: err.message,
            })),
          }
        );
        return;
      }
      next(error);
    }
  };
};
