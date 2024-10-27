import express from "express";
import morgan from "morgan";
import helmet from "helmet";
import cors from "cors";
import dotenv from "dotenv";
import { router, notFound, errorHandler } from "../api";

dotenv.config();

class Application {
  private server: express.Express;

  constructor() {
    this.server = express();
    this.server.set("port", process.env.PORT || 5000);
    this.server.use(morgan("dev"));
    this.server.use(helmet());
    this.server.use(cors());
    this.server.use(express.json());
    
    // Use the API routes
    this.server.use("/api/v1", router);

    // Use 404 and error handlers after all routes
    this.server.use(notFound);
    this.server.use(errorHandler);
  }

  public start(): void {
    const port: number = this.server.get("port");
    this.server.listen(port, () => {
      console.log(`Server started on port ${port}`);
    });
  }
}

const app = new Application();
app.start();
