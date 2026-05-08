import {
  Collection,
  DeleteResult,
  ObjectId,
  InsertOneResult,
  UpdateResult,
} from "mongodb";
import Database from "../config/database";
import dayjs from "dayjs";
import {
  IProduct,
  IResponseProduct,
  ICreateProductRequest,
  IUpdateProductRequest,
} from "../types/product.types";
import { PaginationParams, PaginationUtils, PaginationResult } from "../utils/pagination";

export class ProductModel {
  private collections: Map<string, Collection<IProduct>> = new Map();

  private getCollection(collectionName: string): Collection<IProduct> {
    if (!this.collections.has(collectionName)) {
      const db = Database.getInstance().getDb();
      const collection = db.collection<IProduct>(collectionName);
      this.collections.set(collectionName, collection);
    }
    return this.collections.get(collectionName)!;
  }

  private async getNextOrderValue(collectionName: string): Promise<number> {
    const lastProduct = await this.getCollection(collectionName).findOne(
      {},
      { sort: { order: -1 } }
    );
    return lastProduct ? lastProduct.order + 1 : 1;
  }

  async getAllProducts(
    paginationParams: PaginationParams,
    collectionName: string,
    siteOrigin?: string,
    category?: string
  ): Promise<PaginationResult<IResponseProduct>> {
    const { page, pageSize, sortBy, sortOrder } = paginationParams;
    const skip = PaginationUtils.calculateSkip(page, pageSize);
    const sortField = sortBy ? sortBy : "order";
    const sortDirection = sortOrder === "asc" ? 1 : -1;

    const filter: Record<string, unknown> = {};
    if (siteOrigin) filter.siteOrigin = siteOrigin;
    if (category) filter.category = category;

    const [products, total] = await Promise.all([
      this.getCollection(collectionName)
        .find(filter)
        .skip(skip)
        .limit(pageSize)
        .sort({ [sortField]: sortDirection })
        .toArray(),
      this.getCollection(collectionName).countDocuments(filter),
    ]);

    const productResponses = products.map((prod) =>
      this.transformProductResponse(prod)
    );

    return PaginationUtils.createPaginationResult(
      productResponses,
      page,
      pageSize,
      total
    );
  }

  async getProductById(
    productId: string,
    collectionName: string
  ): Promise<IResponseProduct | null> {
    const product = await this.getCollection(collectionName).findOne({
      _id: new ObjectId(productId),
    });
    return product ? this.transformProductResponse(product) : null;
  }

  async createProduct(
    productData: ICreateProductRequest,
    collectionName: string,
    siteOrigin: string
  ): Promise<IResponseProduct> {
    const order = await this.getNextOrderValue(collectionName);
    const newProduct: IProduct = {
      product_id: productData.product_id,
      name: productData.name,
      price: productData.price,
      description: productData.description,
      category: productData.category,
      siteOrigin,
      image_url: productData.image_url,
      order,
      createdAt: dayjs().toDate(),
      updatedAt: dayjs().toDate(),
    };

    const result: InsertOneResult<IProduct> = await this.getCollection(
      collectionName
    ).insertOne(newProduct);

    const createdProduct = await this.getCollection(collectionName).findOne({
      _id: result.insertedId,
    });

    if (!createdProduct) {
      throw new Error("Failed to create Product");
    }
    return this.transformProductResponse(createdProduct);
  }

  async updateProduct(
    productId: string,
    updateData: IUpdateProductRequest,
    collectionName: string
  ): Promise<IResponseProduct | null> {
    const filteredUpdateData = Object.fromEntries(
      Object.entries(updateData).filter(([, value]) => value !== undefined)
    );

    const updatePayload = {
      ...filteredUpdateData,
      updatedAt: dayjs().toDate(),
    };

    const result: UpdateResult = await this.getCollection(
      collectionName
    ).updateOne({ _id: new ObjectId(productId) }, { $set: updatePayload });

    if (result.matchedCount === 0) {
      return null;
    }

    const updatedProduct = await this.getCollection(collectionName).findOne({
      _id: new ObjectId(productId),
    });

    return updatedProduct
      ? this.transformProductResponse(updatedProduct)
      : null;
  }

  async deleteProduct(
    productId: string,
    collectionName: string
  ): Promise<boolean> {
    const result: DeleteResult = await this.getCollection(
      collectionName
    ).deleteOne({ _id: new ObjectId(productId) });
    return result.deletedCount > 0;
  }

  async getAllCategories(
    collectionName: string,
    siteOrigin?: string
  ): Promise<string[]> {
    const filter: Record<string, unknown> = {};
    if (siteOrigin) filter.siteOrigin = siteOrigin;

    const categories = (await this.getCollection(collectionName).distinct(
      "category",
      filter
    )) as string[];

    return categories
      .filter((c) => typeof c === "string" && c.trim() !== "")
      .sort((a, b) => a.localeCompare(b));
  }

  private transformProductResponse(product: IProduct): IResponseProduct {
    return {
      _id: product._id!.toString(),
      product_id: product.product_id,
      name: product.name,
      price: product.price,
      description: product.description,
      category: product.category,
      siteOrigin: product.siteOrigin,
      image_url: product.image_url,
      order: product.order,
      createdAt: product.createdAt!,
      updatedAt: product.updatedAt!,
    };
  }
}
