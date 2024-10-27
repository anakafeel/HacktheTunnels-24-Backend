import express, { Express } from "express";
import morgan from "morgan";
import helmet from "helmet";
import cors from "cors";
import dotenv from "dotenv";
import { router, notFound, errorHandler } from "../api"; // Ensure correct path to your API

dotenv.config();

class Application {
    private server: Express;

constructor() {
    this.server = express();
    this.server.set("port", process.env.PORT || 5000);
    this.server.use(morgan("dev"));
    this.server.use(helmet());
    this.server.use(cors({
      origin: 'https://hackthe-tunnels-24.vercel.app', // allow requests from your Vercel frontend
      methods: ['GET', 'POST', 'PUT', 'DELETE'],
      allowedHeaders: ['Content-Type', 'Authorization'],
    }));
    this.server.use(express.json());

    // Use the API router for all /api routes
    this.server.use("/api/v1", router);

    // Error handling middleware should be last
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