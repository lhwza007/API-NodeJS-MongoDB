import { Router } from "express";
import { ProductController } from "../controllers/product.controller";
import { validateWebsite } from "../middleware/website.middleware";
import { validateRequest, validateParams } from "../middleware/validation.middleware";
import {
  createProductSchema,
  updateProductSchema,
  productIdSchema,
} from "../schemas/product.schema";

const router = Router();
const productController = new ProductController();

// Apply website validation middleware to all routes in this router
router.use(validateWebsite);

router.get("/", productController.getAllProducts);
router.get("/categories", productController.getAllCategories);
router.get("/:id", validateParams(productIdSchema), productController.getProductById);
router.post("/", validateRequest(createProductSchema), productController.createProduct);
router.put("/:id", validateParams(productIdSchema), validateRequest(updateProductSchema), productController.updateProduct);
router.delete("/:id", validateParams(productIdSchema), productController.deleteProduct);

export default router;
