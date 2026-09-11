import { Router } from "express";
import type { Request, Response, NextFunction } from "express";
import { DocumentController } from "../controllers/document.controller.js";
import { requireAuth } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/upload.middleware.js";

export const documentRouter: Router = Router();

const documentController = new DocumentController();

const handleFileUpload = (req: Request, res: Response, next: NextFunction) => {
  console.log("-> 1. Content-Type Header:", req.headers["content-type"]);

  upload.single("file")(req, res, (err) => {
    if (err) {
      console.error("-> Multer Error:", err);
      return next(err);
    }
    console.log(
      "-> 2. Multer Finished. req.file is:",
      req.file ? "Found ✅" : "Undefined ❌",
    );
    next();
  });
};

documentRouter
  .route("/")
  .get(requireAuth, documentController.getAllDocument.bind(documentController))
  .post(
    requireAuth,
    handleFileUpload,
    documentController.createDocument.bind(documentController),
  );

documentRouter
  .route("/:documentId")
  .get(requireAuth, documentController.getDocumentById.bind(documentController))
  .delete(
    requireAuth,
    documentController.deleteDocumentById.bind(documentController),
  );
