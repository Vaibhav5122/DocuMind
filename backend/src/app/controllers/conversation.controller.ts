import type { Request, Response } from "express";
import { ApiError } from "../utils/ApiError.js";
import { Conversation } from "../models/conversation.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import mongoose from "mongoose";
import { Message } from "../models/message.model.js";
import { generateConversationTitle } from "../utils/titleGenerator.js";

export class ConversationController {
  public async createConversation(req: Request, res: Response) {
    const userId = req.user?.id;

    if (!userId) {
      throw ApiError.unauthorized("Authentication required");
    }

    const { title, query } = req.body;

    const resolvedTitle =
      title && typeof title === "string" && title.trim() !== ""
        ? title.trim()
        : generateConversationTitle(query);

    const conversation = await Conversation.create({
      userId,
      title: resolvedTitle,
    });
    return ApiResponse.created(res, "Conversation created", conversation);
  }

  public async getAllConversation(req: Request, res: Response) {
    const userId = req.user?.id;
    if (!userId) {
      throw ApiError.unauthorized("Authentication required");
    }

    const conversation = await Conversation.find({ userId })
      .select("-userId")
      .lean()
      .sort({ createdAt: -1 });

    return ApiResponse.ok(res, "Conversation fetched", conversation);
  }
  public async getConversationById(req: Request, res: Response) {
    const userId = req.user?.id;

    const { conversationId } = req.params;

    if (!userId) {
      throw ApiError.unauthorized("Authentication required");
    }
    if (!conversationId || !mongoose.isValidObjectId(conversationId)) {
      throw ApiError.badRequest("Valid conversation id required");
    }

    const conversation = await Conversation.findOne({
      _id: conversationId,
      userId,
    })
      .select("-userId")
      .lean();

    if (!conversation) {
      throw ApiError.notFound("Conversation not found");
    }
    const messages = await Message.find({ conversationId })
      .sort({ createdAt: 1 })
      .lean();

    return ApiResponse.ok(res, "Conversation fetched", {
      conversation,
      messages,
    });
  }

  public async deleteConversation(req: Request, res: Response) {
    const userId = req.user?.id;

    const { conversationId } = req.params;

    if (!userId) {
      throw ApiError.unauthorized("Authentication required");
    }
    if (!conversationId || !mongoose.isValidObjectId(conversationId)) {
      throw ApiError.badRequest("Valid conversation Id required");
    }

    const conversation = await Conversation.findOne({
      _id: conversationId,
      userId,
    });

    if (!conversation) {
      throw ApiError.notFound("Conversation not found");
    }

    await Message.deleteMany({ conversationId });

    await Conversation.deleteOne({
      _id: conversationId,
      userId,
    });

    return ApiResponse.noContent(res);
  }
}
