import { Router } from "express";
import { UploadController } from "../controllers/test-upload.controller.js";
import { requireAuth } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/upload.middleware.js";

export const fileRouter: Router = Router();

const uploadController = new UploadController();

fileRouter.post(
  "/",
  requireAuth,
  upload.single("file"),
  uploadController.testUploadController.bind(uploadController),
);
