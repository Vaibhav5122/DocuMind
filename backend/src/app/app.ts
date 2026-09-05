import express, { type Application } from "express";
import { globalErrorHandler } from "./utils/GlobalErrorHandler.js";
import { ApiError } from "./utils/ApiError.js";
import { auth } from "../lib/auth.js";
import { toNodeHandler } from "better-auth/node";

export async function expressApplication(): Promise<Application> {
  const app = express();

  //BetterAuth Middleware
  app.all("/api/auth/{*any}", toNodeHandler(auth));

  app.use(express.json());

  //MongoDB connection call
  // await connectDB();

  app.get("/", (req, res) => {
    return res.status(200).json({ status: "Healthy" });
  });

  //Unknown/invalid api endpoint route
  app.use((req, res, next) => {
    next(new ApiError(404, "Invalid route"));
  });

  //Global error handler Middleware
  app.use(globalErrorHandler);
  return app;
}
