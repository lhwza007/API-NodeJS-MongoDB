import { Router } from "express";
import dayjs from "dayjs";
import productRoutes from "./product.routes";

const router = Router();

// API Routes
router.use("/products", productRoutes);

// Health check endpoint
router.get("/health", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "Product API Server is running!",
    timestamp: dayjs().toISOString(),
  });
});

export default router;
