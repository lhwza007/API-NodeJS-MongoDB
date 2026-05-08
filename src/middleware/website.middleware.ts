import { Response, NextFunction } from "express";
import { WebsiteConfigService } from "../config/websiteConfig";
import { WebsiteRequest } from "../types/product.types";
import { sendError } from "../utils/response";

export interface WebsiteValidationError {
  success: false;
  message: string;
  error?: string;
}

/**
 * Middleware ตรวจสอบ x-website header และเพิ่ม website config เข้าไปใน request object
 */
export const validateWebsite = (
  req: WebsiteRequest,
  res: Response,
  next: NextFunction
): void => {
  try {
    const websiteService = WebsiteConfigService.getInstance();

    // Extract website ID from x-website header
    const websiteId = req.headers["x-website"] as string;

    // Check if x-website header is provided
    if (!websiteId) {
      sendError(
        res,
        400,
        "Missing x-website header. Please provide a valid website identifier.",
        { error: "MISSING_WEBSITE_HEADER" }
      );
      return;
    }

    // Validate website ID format and existence
    const isValid = websiteService.isValidWebsiteId(websiteId);
    if (!isValid) {
      sendError(res, 400, `Invalid website identifier: ${websiteId}`, {
        error: "INVALID_WEBSITE_ID",
      });
      return;
    }

    // Get website configuration
    const websiteConfig = websiteService.getWebsiteConfig(websiteId);

    if (!websiteConfig) {
      sendError(res, 500, "Website configuration not found", {
        error: "WEBSITE_CONFIG_ERROR",
      });
      return;
    }

    // Check if website is active
    if (!websiteConfig.isActive) {
      sendError(res, 403, `Website ${websiteId} is currently inactive`, {
        error: "WEBSITE_INACTIVE",
      });
      return;
    }

    // Add website info to request object
    req.websiteId = websiteId;
    req.website = websiteConfig;

    console.log(
      `[Website Middleware] Request from website: ${websiteId} -> Collection: ${
        req.headers["x-collection"] as string
      }`
    );

    next();
  } catch (error) {
    console.error("Website validation error:", error);
    sendError(res, 500, "Internal server error during website validation", {
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

/**
 * ดึงชื่อ collection จาก x-collection header และตรวจสอบสิทธิ์การเข้าถึง
 */
export const getCollectionFromRequest = (req: WebsiteRequest): string => {
  if (!req.website) {
    throw new Error(
      "Website context not found in request. Ensure validateWebsite middleware is applied."
    );
  }

  const requestedCollection = req.headers["x-collection"] as string;

  if (!requestedCollection) {
    throw new Error(
      "Missing x-collection header. Please specify which collection to access."
    );
  }

  const availableCollections = req.website.collections || [
    req.website.collectionName,
  ];

  if (!availableCollections.includes(requestedCollection)) {
    throw new Error(
      `Access denied. Collection "${requestedCollection}" is not available for website "${
        req.websiteId
      }". Available collections: ${availableCollections.join(", ")}`
    );
  }

  return requestedCollection;
};

/**
 * ดึง website ID จาก request context
 */
export const getWebsiteIdFromRequest = (req: WebsiteRequest): string => {
  if (!req.websiteId) {
    throw new Error(
      "Website ID not found in request. Ensure validateWebsite middleware is applied."
    );
  }
  return req.websiteId;
};
