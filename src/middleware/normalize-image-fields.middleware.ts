import { Request, Response, NextFunction, RequestHandler } from "express";

export const normalizeImageFields: RequestHandler = (
  req: Request,
  _res: Response,
  next: NextFunction
): void => {
  if (!req.body) return next();

  const mapField = (variants: string[], target: string) => {
    for (const v of variants) {
      if (req.body[v] !== undefined) {
        req.body[target] = req.body[v];
        break;
      }
    }

    const val = req.body[target];
    if (val === undefined) return;

    // If string (comma-separated), convert to array
    if (typeof val === "string") {
      req.body[target] = val
        .split(",")
        .map((s: string) => s.trim())
        .filter((s: string) => s.length > 0);
    } else if (Array.isArray(val)) {
      req.body[target] = val.map((x: any) => (typeof x === "string" ? x.trim() : x));
    } else {
      // wrap single value
      req.body[target] = [String(val)];
    }
  };

  // ตัวอย่างการทำ mapping field รูปภาพ (ปรับเปลี่ยนได้ตามความต้องการ)
  mapField(["image_urls", "images", "product_images"], "image_url");

  next();
};
