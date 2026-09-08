import { Router } from "express";
import { DocumentController } from "../controllers/document.controller.js";
import { requireAuth } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/upload.middleware.js";

export const documentRouter: Router = Router();

const documentController = new DocumentController();

documentRouter
  .route("/")
  .get(requireAuth, documentController.getAllDocument.bind(documentController))
  .post(
    requireAuth,
    upload.single("file"),
    documentController.createDocument.bind(documentController),
  );

documentRouter
  .route("/:documentId")
  .get(requireAuth, documentController.getDocumentById.bind(documentController))
  .delete(
    requireAuth,
    documentController.deleteDocumentById.bind(documentController),
  );
