import express, { type Application } from "express";
import { globalErrorHandler } from "./utils/GlobalErrorHandler.js";
import { ApiError } from "./utils/ApiError.js";
import { auth } from "../lib/auth.js";
import { toNodeHandler } from "better-auth/node";
import cors from "cors";
import { requireAuth } from "./middlewares/auth.middleware.js";

export async function expressApplication(): Promise<Application> {
  const app = express();

  app.use(
    cors({
      origin: "http://localhost:3000",
      credentials: true,
      methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    }),
  );

  //BetterAuth Middleware
  app.all("/api/auth/{*any}", toNodeHandler(auth));

  app.use(express.json());

  //MongoDB connection call
  // await connectDB();

  app.get("/", (req, res) => {
    return res.status(200).json({ status: "Healthy" });
  });

  app.get("/api/test-auth", requireAuth, (req, res) => {
    return res.status(200).json({ authenticated: true, user: req.user });
  });

  //Unknown/invalid api endpoint route
  app.use((req, res, next) => {
    next(new ApiError(404, "Invalid route"));
  });

  //Global error handler Middleware
  app.use(globalErrorHandler);
  return app;
}
