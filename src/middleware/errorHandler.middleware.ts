import { Request, Response, NextFunction } from "express";

/**
 * Global error handling middleware.
 * Catches unhandled errors and returns a consistent JSON response.
 */
export const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  console.error("Global error handler:", err);

  res.status(500).json({
    success: false,
    message: "Internal server error",
    error:
      process.env.NODE_ENV === "development"
        ? err.message
        : "Something went wrong",
  });
};
