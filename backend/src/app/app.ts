import express, { type Application } from "express";
import { globalErrorHandler } from "./utils/GlobalErrorHandler.js";
import { ApiError } from "./utils/ApiError.js";
import { auth } from "../lib/auth.js";
import { toNodeHandler } from "better-auth/node";
import cors from "cors";
import { requireAuth } from "./middlewares/auth.middleware.js";
import { fileRouter } from "./routes/fileUpload.route.js";
import { documentRouter } from "./routes/document.route.js";
import { serve } from "inngest/express";
import { inngest } from "../inngest/client.js";
import { functions } from "../inngest/index.js";
import { chatRouter } from "./routes/chat.route.js";

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

  //Health Routes
  app.get("/", (_req, res) => {
    return res.status(200).json({ status: "Healthy" });
  });

  app.get("/api/test-auth", requireAuth, (req, res) => {
    return res.status(200).json({ authenticated: true, user: req.user });
  });

  //Routes
  app.use("/api/file-upload", fileRouter);
  app.use("/api/documents", documentRouter);
  app.use("/api/chat", chatRouter);

  //Inggest Route
  app.use("/api/inngest", serve({ client: inngest, functions: functions }));

  //Unknown/invalid api endpoint route
  app.use((_req, _res, next) => {
    next(new ApiError(404, "Invalid route"));
  });

  //Global error handler Middleware
  app.use(globalErrorHandler);
  return app;
}
