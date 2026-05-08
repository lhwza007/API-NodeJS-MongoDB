import { MongoClient, Db } from "mongodb";
import dotenv from "dotenv";

dotenv.config();

class Database {
  private static instance: Database;
  private client: MongoClient;
  private db: Db | null = null;

  private constructor() {
    this.client = new MongoClient(
      process.env.MONGODB_URI || "mongodb://localhost:27017/api_nodejs_db"
    );
  }

  public static getInstance(): Database {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }

  public async connect(): Promise<void> {
    try {
      await this.client.connect();
      this.db = this.client.db();
      console.log("Connected to MongoDB successfully");
    } catch (error) {
      console.error("MongoDB connection error:", error);
      process.exit(1);
    }
  }

  public getDb(): Db {
    if (!this.db) {
      throw new Error("Database not connected. Call connect() first.");
    }
    return this.db;
  }

  public isConnected(): boolean {
    return this.db !== null;
  }

  public async disconnect(): Promise<void> {
    await this.client.close();
    this.db = null;
    console.log("Disconnected from MongoDB");
  }
}

export default Database;
