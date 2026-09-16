import { Router } from "express";
import { ChatController } from "../controllers/chat.controller.js";
import { requireAuth } from "../middlewares/auth.middleware.js";

export const chatRouter: Router = Router();

const chatController = new ChatController();

chatRouter
  .route("/")
  .post(requireAuth, chatController.chatWithDocument.bind(chatController));

chatRouter
  .route("/stream")
  .post(
    requireAuth,
    chatController.chatWithDocumentStream.bind(chatController),
  );
