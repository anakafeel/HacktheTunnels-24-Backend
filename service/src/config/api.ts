import express, { Express } from "express";
import morgan from "morgan";
import helmet from "helmet";
import cors from "cors";
import dotenv from "dotenv";
import { router, notFound, errorHandler } from "../api";

dotenv.config();

class Application {
  private server: Express;

  constructor() {
    this.server = express();
    this.server.set("port", process.env.PORT || 5000);
    
    this.server.use(morgan("dev"));
    this.server.use(helmet());

    // Update CORS configuration to allow multiple origins
    this.server.use(cors({
      origin: [
        'http://localhost:5173',  // Allow local development
        'https://hackthe-tunnels-24.vercel.app'  // Allow your production frontend
      ],
      credentials: true, // Allow credentials (like cookies, authorization headers, etc.)
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Specify allowed methods
    }));

    this.server.use(express.json());
    this.server.use("/api/v1", router);
    this.server.use(notFound);
    this.server.use(errorHandler);
  }

  public start(): void {
    const host: string = process.env.HOST || "0.0.0.0";
    const port: number = this.server.get("port");

    this.server.listen(port, host, () => {
      console.log(`Server started at http://${host}:${port}`);
    });
  }
}

const app: Application = new Application();
app.start();
