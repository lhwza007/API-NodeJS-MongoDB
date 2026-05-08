// Code-based Website Configuration (Programmer Managed)
// No admin API — configurations are managed by programmer in code
// All configuration is loaded from src/config/websites.ts

import {
  IWebsiteConfig,
  getWebsiteConfig as getWebsiteConfigFromCode,
  getActiveWebsites,
  isValidWebsiteId as isValidWebsiteIdFromCode,
} from "./websites";

// Re-export IWebsiteConfig for backward compatibility
export { IWebsiteConfig };

export class WebsiteConfigService {
  private static instance: WebsiteConfigService;

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {}

  public static getInstance(): WebsiteConfigService {
    if (!WebsiteConfigService.instance) {
      WebsiteConfigService.instance = new WebsiteConfigService();
    }
    return WebsiteConfigService.instance;
  }

  // Get website configuration by ID
  public getWebsiteConfig(websiteId: string): IWebsiteConfig | null {
    return getWebsiteConfigFromCode(websiteId);
  }

  // Get all active websites
  public getAllActiveWebsites(): IWebsiteConfig[] {
    return getActiveWebsites();
  }

  // Validate website ID
  public isValidWebsiteId(websiteId: string): boolean {
    return isValidWebsiteIdFromCode(websiteId);
  }

  // Get collection name for website
  public getCollectionName(websiteId: string): string | null {
    const config = getWebsiteConfigFromCode(websiteId);
    return config ? config.collectionName : null;
  }
}
