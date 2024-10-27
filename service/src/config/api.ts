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
        this.server.use(cors());
        this.server.use(express.json());

        // Use the API router for all /api routes
        this.server.use("/api/v1", router); // Make sure this line is present

        // Error handling middleware should be last
        this.server.use(notFound); // Make sure to define these
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
