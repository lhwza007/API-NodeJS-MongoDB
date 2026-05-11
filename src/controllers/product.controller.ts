import { Response } from "express";
import { ProductModel } from "../models/product.model";
import { WebsiteRequest } from "../types/product.types";
import {
  CreateProductInput,
  UpdateProductInput,
} from "../schemas/product.schema";
import {
  getXWebsiteFromRequest,
  getXCollectionFromRequest,
} from "../middleware/website.middleware";
import { sendError, sendSuccess } from "../utils/response";
import { PaginationUtils } from "../utils/pagination";

export class ProductController {
  private productModel: ProductModel;

  constructor() {
    this.productModel = new ProductModel();
  }

  /**
   * POST /products
   * สร้างสินค้าใหม่ — auto-inject siteOrigin จาก x-website header
   */
  createProduct = async (req: WebsiteRequest, res: Response): Promise<void> => {
    try {
      const productData = req.body as CreateProductInput;
      const siteOrigin = getXWebsiteFromRequest(req);
      const collectionName = getXCollectionFromRequest(req);

      const newProduct = await this.productModel.createProduct(
        productData,
        collectionName,
        siteOrigin
      );

      sendSuccess(res, 201, "Product created successfully", {
        website: siteOrigin,
        data: newProduct,
      });
    } catch (error) {
      console.error("Error creating Product:", error);
      sendError(res, 500, "Internal server error", {
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  };

  /**
   * GET /products
   * ดึงสินค้าทั้งหมด รองรับ filter by category และ pagination
   */
  getAllProducts = async (
    req: WebsiteRequest,
    res: Response
  ): Promise<void> => {
    try {
      const category = req.query.category as string | undefined;
      const siteOrigin = getXWebsiteFromRequest(req);
      const collectionName = getXCollectionFromRequest(req);

      // pagination
      const paginationParams = PaginationUtils.parsePaginationParams(
        req.query as Record<string, unknown>
      );
      const validationErrors =
        PaginationUtils.validatePaginationParams(paginationParams);
      if (validationErrors.length > 0) {
        sendError(res, 400, "Invalid pagination parameters", {
          errors: validationErrors,
        });
        return;
      }

      const result = await this.productModel.getAllProducts(
        paginationParams,
        collectionName,
        siteOrigin,
        category
      );

      const message = category
        ? `Get products successfully for category: ${category}`
        : "Get all products successfully";

      sendSuccess(res, 200, message, {
        website: siteOrigin,
        ...result,
      });
    } catch (error) {
      console.error("Error getting all products:", error);
      sendError(res, 500, "Internal server error", {
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  };

  /**
   * GET /products/:id
   * ดึงสินค้าตาม ID
   */
  getProductById = async (req: WebsiteRequest, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const siteOrigin = getXWebsiteFromRequest(req);
      const collectionName = getXCollectionFromRequest(req);

      const product = await this.productModel.getProductById(
        String(id),
        collectionName
      );

      if (!product) {
        sendError(res, 404, "Product not found");
        return;
      }

      sendSuccess(res, 200, "Get product by ID successfully", {
        website: siteOrigin,
        data: product,
      });
    } catch (error) {
      console.error("Error getting Product by ID:", error);
      sendError(res, 500, "Internal server error", {
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  };

  /**
   * PUT /products/:id
   * อัปเดตสินค้าตาม ID
   */
  updateProduct = async (req: WebsiteRequest, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const body = req.body as UpdateProductInput;
      const siteOrigin = getXWebsiteFromRequest(req);
      const collectionName = getXCollectionFromRequest(req);

      const productData: Record<string, unknown> = {};
      if (body.product_id !== undefined) productData.product_id = body.product_id;
      if (body.name !== undefined) productData.name = body.name;
      if (body.price !== undefined) productData.price = body.price;
      if (body.description !== undefined) productData.description = body.description;
      if (body.category !== undefined) productData.category = body.category;
      if (body.image_url !== undefined) productData.image_url = body.image_url;

      const updatedProduct = await this.productModel.updateProduct(
        String(id),
        productData,
        collectionName
      );

      if (!updatedProduct) {
        sendError(res, 404, "Product not found");
        return;
      }

      sendSuccess(res, 200, "Product updated successfully", {
        website: siteOrigin,
        data: updatedProduct,
      });
    } catch (error) {
      console.error("Error updating Product:", error);
      sendError(res, 500, "Internal server error", {
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  };

  /**
   * DELETE /products/:id
   * ลบสินค้าตาม ID
   */
  deleteProduct = async (req: WebsiteRequest, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const siteOrigin = getXWebsiteFromRequest(req);
      const collectionName = getXCollectionFromRequest(req);

      const deleted = await this.productModel.deleteProduct(String(id), collectionName);

      if (!deleted) {
        sendError(res, 404, "Product not found");
        return;
      }

      sendSuccess(res, 200, `Product ID ${id} has been deleted.`, {
        website: siteOrigin,
      });
    } catch (error) {
      console.error("Error deleting Product:", error);
      sendError(res, 500, "Internal server error", {
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  };

  /**
   * GET /products/categories
   * ดึง category ทั้งหมด
   */
  getAllCategories = async (req: WebsiteRequest, res: Response): Promise<void> => {
    try {
      const siteOrigin = getXWebsiteFromRequest(req);
      const collectionName = getXCollectionFromRequest(req);

      const categories = await this.productModel.getAllCategories(
        collectionName,
        siteOrigin
      );

      sendSuccess(res, 200, "Get categories successfully", {
        website: siteOrigin,
        data: categories,
      });
    } catch (error) {
      console.error("Error getting categories:", error);
      sendError(res, 500, "Internal server error", {
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  };
}
