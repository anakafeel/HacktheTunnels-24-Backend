import express, { Express } from "express";
import morgan from "morgan";
import helmet from "helmet";
import cors, { CorsOptions } from "cors";
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

    // Configure CORS to allow your frontend
    const corsOptions: CorsOptions = {
      origin: "https://hackthe-tunnels-24.vercel.app/login", 
      methods: ["GET", "POST", "PUT", "DELETE"], 
      credentials: true, 
    };

    this.server.use(cors(corsOptions));
    this.server.use(express.json());
    this.server.use("/api/v1", router);
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

const app: Application = new Application();

app.start();
