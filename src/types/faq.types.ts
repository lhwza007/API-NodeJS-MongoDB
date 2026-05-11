import { ObjectId } from "mongodb";
import { Request } from "express";
import { IWebsiteConfig } from "../config/websites";

export interface IFaq {
  _id?: ObjectId;
  question: string;
  answer: string;
  order: number;
  slug: string;
  siteOrigin: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CreateFaqRequest {
    question: string;
    answer: string;
    order?: number | undefined;
    slug:string
}

export interface UpdateFaqRequest {
    question?: string | undefined;
    answer?: string | undefined;
    order?: number | undefined;
    slug?:string | undefined;
}

export interface FaqResponse {
    _id: string;
    question: string;
    answer: string;
    order: number;
    slug:string;
    siteOrigin: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface WebsiteRequest extends Request {
  website?: IWebsiteConfig;
  websiteId?: string;
}

export interface WebsiteFaqContext {
  websiteId: string;
  collectionName: string;
  websiteConfig: IWebsiteConfig;
}