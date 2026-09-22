import type { Request, Response } from "express";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { askDocuments } from "../services/ai/ragNonStream.service.js";
import { askDocumentsStream } from "../services/ai/ragStream.service.js";
import mongoose from "mongoose";
import { Conversation } from "../models/conversation.model.js";
import { Message } from "../models/message.model.js";
import { generateConversationTitle } from "../utils/titleGenerator.js";

export class ChatController {
  public async chatWithDocument(req: Request, res: Response) {
    const userId = req.user?.id;

    if (!userId) {
      return ApiError.unauthorized("Authentication required");
    }
    const { query, documentId, conversationId } = req.body;

    if (!query || query.trim().length === 0) {
      throw ApiError.badRequest("Question is required");
    }

    let activeConversationId = conversationId;
    let title = "";

    if (activeConversationId && mongoose.isValidObjectId(activeConversationId)) {
      const conversation = await Conversation.findOne({
        _id: activeConversationId,
        userId,
      });

      if (!conversation) {
        throw ApiError.notFound("Conversation not found");
      }
      title = conversation.title;
      if (title === "New Chat") {
        title = generateConversationTitle(query.trim());
        await Conversation.updateOne(
          { _id: activeConversationId, userId },
          { $set: { title } },
        );
      }
    } else {
      // Auto-create conversation with title from query
      title = generateConversationTitle(query.trim());
      const newConversation = await Conversation.create({
        userId,
        title,
      });
      activeConversationId = newConversation._id.toString();
    }

    await Message.create({
      conversationId: activeConversationId,
      role: "USER",
      content: query.trim(),
    });

    const result = await askDocuments({
      query,
      documentId,
      userId,
      conversationId: activeConversationId,
    });

    return ApiResponse.ok(res, "Answer generated", {
      ...result,
      conversationId: activeConversationId,
      title,
    });
  }

  //Chat with Stream response
  public async chatWithDocumentStream(req: Request, res: Response) {
    const userId = req.user?.id;
    if (!userId) {
      return ApiError.unauthorized("Authentication required");
    }
    const { query, documentId, conversationId } = req.body;

    if (!query || query.trim().length === 0) {
      throw ApiError.badRequest("Question is required");
    }

    let activeConversationId = conversationId;
    let title = "";

    if (activeConversationId && mongoose.isValidObjectId(activeConversationId)) {
      const conversation = await Conversation.findOne({
        _id: activeConversationId,
        userId,
      });

      if (!conversation) {
        throw ApiError.notFound("Conversation not found");
      }
      title = conversation.title;
      if (title === "New Chat") {
        title = generateConversationTitle(query.trim());
        await Conversation.updateOne(
          { _id: activeConversationId, userId },
          { $set: { title } },
        );
      }
    } else {
      // Auto-create conversation with title from query
      title = generateConversationTitle(query.trim());
      const newConversation = await Conversation.create({
        userId,
        title,
      });
      activeConversationId = newConversation._id.toString();
    }

    await Message.create({
      conversationId: activeConversationId,
      role: "USER",
      content: query.trim(),
    });

    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    res.flushHeaders();

    // Emit conversation metadata event immediately so frontend gets the conversationId
    res.write(
      `data: ${JSON.stringify({
        type: "conversation",
        conversationId: activeConversationId,
        title,
      })}\n\n`,
    );

    try {
      const result = await askDocumentsStream({
        query: query.trim(),
        documentId,
        userId,
        conversationId: activeConversationId,
      });
      if (result.noResult) {
        res.write(
          `data: ${JSON.stringify({
            type: "error",
            message: "I couldn't find relevant information in your documents.",
          })}\n\n`,
        );

        res.end();
        return;
      }
      res.write(
        `data: ${JSON.stringify({
          type: "citations",
          citations: result.citations,
        })}\n\n`,
      );

      let completeAnswer = "";
      for await (const token of result.stream!) {
        completeAnswer += token;
        res.write(
          `data: ${JSON.stringify({
            type: "token",
            text: token,
          })}\n\n`,
        );
      }

      await Message.create({
        conversationId: activeConversationId,
        role: "ASSISTANT",
        content: completeAnswer,
        citations: result.citations,
      });

      await Conversation.updateOne(
        {
          _id: activeConversationId,
          userId,
        },
        {
          $set: {
            updatedAt: new Date(),
          },
        },
      );

      res.write(
        `data: ${JSON.stringify({
          type: "done",
        })}\n\n`,
      );

      res.end();
    } catch (error) {
      console.error("Chat stream error:", error);

      if (!res.writableEnded) {
        res.write(
          `data: ${JSON.stringify({
            type: "error",
            message: "Failed to generate response.",
          })}\n\n`,
        );

        res.end();
      }
    }
  }
}
