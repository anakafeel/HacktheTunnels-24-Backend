import express, { Request, Response } from "express";
import { AccountRouter, ScheduledEventRouter, TimetableRouter } from "./routes";

const router = express.Router();

// Define your API routers first
router.use("/account", AccountRouter); // Assuming AccountRouter has its own paths
router.use("/scheduledEvents", ScheduledEventRouter);
router.use("/timetables", TimetableRouter);

// Then define the root route
const getAPIRoot = async (_: Request, response: Response) => {
  response.json({
    message: "API - 👋",
  });
};

router.get("/", getAPIRoot); // This should now work correctly

export default router;
