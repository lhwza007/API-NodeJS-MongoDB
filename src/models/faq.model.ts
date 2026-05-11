import {
  Collection,

} from "mongodb";
import Database from "../config/database";



import {
    IFaq,

  FaqResponse
} from "../types/faq.types";

export class faqModel {
  private collections: Map<string, Collection<IFaq>> = new Map();

  private getCollection(collectionName: string): Collection<IFaq> {
    if (!this.collections.has(collectionName)) {
      const db = Database.getInstance().getDb();
      const collection = db.collection<IFaq>(collectionName);
      this.collections.set(collectionName, collection);
    }
    return this.collections.get(collectionName)!;
  }

  async getAllFaqs(
        Xcollection: string,
        Xwebsite: string
    ): Promise<FaqResponse[]> {
        const faqs = await this.getCollection(Xcollection)
            .find({ siteOrigin: Xwebsite })
            .sort({ order: 1 })
            .toArray();
        return faqs.map((faq) => this.transformFaq(faq));
    }
 
  private transformFaq(faq: IFaq): FaqResponse {
    return {
      _id: faq._id!.toString(),
       question: faq.question, 
       answer: faq.answer,
       order: faq.order,
       slug: faq.slug,
       siteOrigin: faq.siteOrigin,
       createdAt: faq.createdAt!,
       updatedAt: faq.updatedAt!,
    };
  }
}
