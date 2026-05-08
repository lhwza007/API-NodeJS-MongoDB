import { ObjectId } from "mongodb";
import { Request } from "express";
import { IWebsiteConfig } from "../config/websiteConfig";

export interface IProduct {
  _id?: ObjectId;
  product_id: string;
  name: string;
  price: number;
  description: string;
  category: string;
  siteOrigin: string;
  image_url: string[];
  order: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IResponseProduct {
  _id: string;
  product_id: string;
  name: string;
  price: number;
  description: string;
  category: string;
  siteOrigin: string;
  image_url: string[];
  order?: number | undefined;
  createdAt: Date;
  updatedAt: Date;
}

export interface ICreateProductRequest {
  product_id: string;
  name: string;
  price: number;
  description: string;
  category: string;
  image_url: string[];
}

export interface IUpdateProductRequest {
  product_id?: string;
  name?: string;
  price?: number;
  description?: string;
  category?: string;
  image_url?: string[];
  updatedAt?: Date;
}

export interface ICategory {
  category: string[];
}

export interface WebsiteRequest extends Request {
  website?: IWebsiteConfig;
  websiteId?: string;
}
