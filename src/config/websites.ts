// Website Access Configuration
// กำหนดว่าเว็บไซต์ไหนสามารถเข้าถึง collection อะไรได้บ้าง

export interface IWebsiteConfig {
  id: string;
  name: string;
  collectionName: string; // Default collection
  collections: string[];  // Array of available collections
  domain?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

import dayjs from "dayjs";

// Website configuration mapping
export const WEBSITE_CONFIGS: Record<string, IWebsiteConfig> = {
  bananashop: {
    id: "bananashop",
    name: "Banana Shop",
    collectionName: "products",
    collections: ["products","faqs"],
    domain: "bananashop.com",
    isActive: true,
    createdAt: dayjs().toDate(),
    updatedAt: dayjs().toDate(),
  },

  fruitstore: {
    id: "fruitstore",
    name: "Fruit Store",
    collectionName: "products",
    collections: ["products","faqs"],
    domain: "fruitstore.com",
    isActive: true,
    createdAt: dayjs().toDate(),
    updatedAt: dayjs().toDate(),
  },

  // --- เพิ่มเว็บไซต์ใหม่ได้ตามรูปแบบด้านบน ---
  // mywebsite: {
  //   id: "mywebsite",
  //   name: "My Website",
  //   collectionName: "products",
  //   collections: ["products"],
  //   domain: "mywebsite.com",
  //   isActive: true,
  //   createdAt: dayjs().toDate(),
  //   updatedAt: dayjs().toDate(),
  // },
};

// Get website configuration by ID
export const getWebsiteConfig = (websiteId: string): IWebsiteConfig | null => {
  return WEBSITE_CONFIGS[websiteId] || null;
};

// Get all active websites
export const getActiveWebsites = (): IWebsiteConfig[] => {
  return Object.values(WEBSITE_CONFIGS).filter((config) => config.isActive);
};

// Validate website ID
export const isValidWebsiteId = (websiteId: string): boolean => {
  return websiteId in WEBSITE_CONFIGS && WEBSITE_CONFIGS[websiteId].isActive;
};

// Get collection name for website
export const getCollectionName = (websiteId: string): string | null => {
  const config = getWebsiteConfig(websiteId);
  return config ? config.collectionName : null;
};
