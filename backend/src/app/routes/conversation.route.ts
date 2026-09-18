import { Router } from "express";
import { ConversationController } from "../controllers/conversation.controller.js";
import { requireAuth } from "../middlewares/auth.middleware.js";

export const conversationRouter: Router = Router();

const conversationController = new ConversationController();

conversationRouter.use(requireAuth);
conversationRouter
  .route("/")
  .get(conversationController.getAllConversation.bind(conversationController))
  .post(conversationController.createConversation.bind(conversationController));

conversationRouter
  .route("/:conversationId")
  .get(conversationController.getConversationById.bind(conversationController));
conversationRouter
  .route("/:conversationId")
  .delete(
    conversationController.deleteConversation.bind(conversationController),
  );
