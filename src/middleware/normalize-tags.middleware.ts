import { Request, Response, NextFunction, RequestHandler } from "express";

export const normalizeTags: RequestHandler = (
  req: Request,
  _res: Response,
  next: NextFunction
): void => {
  if (req.body && req.body.tag !== undefined) {
    const tag = req.body.tag;

    if (typeof tag === "string") {
      req.body.tag = tag
        .split(",")
        .map((t: string) => t.trim())
        .filter((t: string) => t.length > 0);
    } else if (Array.isArray(tag)) {
      req.body.tag = tag
        .map((t: any) => (typeof t === "string" ? t.trim() : String(t)))
        .filter((t: string) => t.length > 0);
    } else {
      req.body.tag = [String(tag).trim()].filter((t: string) => t.length > 0);
    }
  }

  next();
};
