import { z } from "zod";

export const createProductSchema = z.object({
  product_id: z
    .string()
    .min(1, "Product ID is required")
    .max(100, "Product ID must be less than 100 characters"),
  name: z
    .string()
    .min(1, "Name is required")
    .max(200, "Name must be less than 200 characters"),
  price: z.number().min(0, "Price must be a positive number"),
  description: z
    .string()
    .min(1, "Description is required")
    .max(2000, "Description must be less than 2000 characters"),
  category: z
    .string()
    .min(1, "Category is required")
    .max(200, "Category must be less than 200 characters"),
  image_url: z
    .array(z.string().url("Image URL must be a valid URL"))
    .min(1, "At least one image is required"),
});

export const updateProductSchema = z.object({
  product_id: z
    .string()
    .min(1, "Product ID is required")
    .max(100, "Product ID must be less than 100 characters")
    .optional(),
  name: z
    .string()
    .min(1, "Name is required")
    .max(200, "Name must be less than 200 characters")
    .optional(),
  price: z.number().min(0, "Price must be a positive number").optional(),
  description: z
    .string()
    .min(1, "Description is required")
    .max(2000, "Description must be less than 2000 characters")
    .optional(),
  category: z
    .string()
    .min(1, "Category is required")
    .max(200, "Category must be less than 200 characters")
    .optional(),
  image_url: z
    .array(z.string().url("Image URL must be a valid URL"))
    .min(1)
    .optional(),
});

export const productIdSchema = z.object({
  id: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid MongoDB ObjectId format"),
});

export type CreateProductInput = z.infer<typeof createProductSchema>;
export type UpdateProductInput = z.infer<typeof updateProductSchema>;
export type ProductIdInput = z.infer<typeof productIdSchema>;
