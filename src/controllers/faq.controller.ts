import { Response } from "express";
import { faqModel } from "../models/faq.model";
import { WebsiteRequest } from "../types/product.types";

import {
  getXWebsiteFromRequest,
  getXCollectionFromRequest,
} from "../middleware/website.middleware";
import { sendError, sendSuccess } from "../utils/response";


export class faqController {
  private faqModel: faqModel;

  constructor() {
    this.faqModel = new faqModel();
  }

  
 
  getAllFaq = async (
    req: WebsiteRequest,
    res: Response
  ): Promise<void> => {
    try {
      const Xwebsite = getXWebsiteFromRequest(req);
      const Xcollection = getXCollectionFromRequest(req);

      

      const result = await this.faqModel.getAllFaqs(
        Xcollection,
        Xwebsite,
        
      );

      const message = ""
        

      sendSuccess(res, 200, message, {
        website: Xwebsite,
        ...result,
      });
    } catch (error) {
      console.error("Error getting all products:", error);
      sendError(res, 500, "Internal server error", {
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  };

}