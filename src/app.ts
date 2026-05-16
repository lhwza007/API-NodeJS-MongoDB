import express, { Application, Request, Response, NextFunction } from "express";
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";
import dayjs from "dayjs";
import Database from "./config/database";
import routes from "./routes";
import { normalizeImageFields } from "./middleware/normalize-image-fields.middleware";

dotenv.config();

class App {
  public app: Application;
  private port: number;

  constructor() {
    this.app = express();
    this.port = parseInt(process.env.PORT || "3000");

    this.initializeMiddlewares();
    this.initializeRoutes();
    this.initializeErrorHandling();
  }

  private initializeMiddlewares(): void {
    this.app.use(
      helmet({
        crossOriginResourcePolicy: false,
      })
    );
    // Normalize incoming image field names and formats
    this.app.use(normalizeImageFields);

    this.app.use(
      cors({
        origin: true,
        credentials: true,
        methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
        allowedHeaders: [
          "Content-Type",
          "Authorization",
          "x-website",
          "x-collection",
          "X-Requested-With",
          "Accept",
          "Origin",
        ],
        exposedHeaders: ["Content-Range", "X-Content-Range"],
        optionsSuccessStatus: 204,
        preflightContinue: false,
      })
    );

    this.app.options("*", cors());

    this.app.use(express.json({ limit: "10mb" }));
    this.app.use(express.urlencoded({ extended: true, limit: "10mb" }));

    this.app.use((req: Request, _res: Response, next: NextFunction) => {
      console.log(`${dayjs().toISOString()} - ${req.method} ${req.path}`);
      next();
    });
  }

  private initializeRoutes(): void {
    this.app.use("/api", routes);

    this.app.get("/", (_req: Request, res: Response) => {
      res.status(200).json({
        success: true,
        message: "Product API Server is running!",
        version: "1.0.0",
        endpoints: {
          health: "/api/health",
          products: "/api/products",
        },
      });
    });

    this.app.use("*", (req: Request, res: Response) => {
      res.status(404).json({
        success: false,
        message: `Route ${req.originalUrl} not found`,
      });
    });
  }

  private initializeErrorHandling(): void {
    this.app.use(
      (error: Error, _req: Request, res: Response, _next: NextFunction) => {
        console.error("Global error handler:", error);

        res.status(500).json({
          success: false,
          message: "Internal server error",
          error:
            process.env.NODE_ENV === "development"
              ? error.message
              : "Something went wrong",
        });
      }
    );
  }

  public async start(): Promise<void> {
    try {
      const database = Database.getInstance();
      await database.connect();

      this.app.listen(this.port, () => {
        console.log(`Server is running on port ${this.port}`);
        console.log(
          `API Documentation: http://localhost:${this.port}/api/health`
        );
        console.log(`MongoDB connected successfully`);
        console.log(`Environment: ${process.env.NODE_ENV || "development"}`);
      });
    } catch (error) {
      console.error("Failed to start server:", error);
      process.exit(1);
    }
  }

  public getApp(): Application {
    return this.app;
  }
}

export default App;
