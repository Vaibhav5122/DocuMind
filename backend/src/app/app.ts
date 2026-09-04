import express, { type Application } from "express";

export function expressApplication(): Application {
  const app = express();

  app.get("/", (req, res) => {
    return res.status(200).json({ status: "Healthy" });
  });

  return app;
}
