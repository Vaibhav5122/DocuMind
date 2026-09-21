import type { Request, Response } from "express";
import { ApiError } from "../utils/ApiError.js";
import { Conversation } from "../models/conversation.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import mongoose from "mongoose";
import { Message } from "../models/message.model.js";

export class ConversationController {
  public async createConversation(req: Request, res: Response) {
    const userId = req.user?.id;

    if (!userId) {
      throw ApiError.unauthorized("Authentiaction required");
    }

    const { title } = req.body;

    if (!title || title?.trim() === "") {
      throw ApiError.badRequest("Conversation Title is required");
    }

    const conversation = await Conversation.create({
      userId,
      title,
    });
    return ApiResponse.created(res, "Conversation title created", conversation);
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
    const message = await Message.find({ conversationId })
      .sort({ createdAt: 1 })
      .lean();

    return ApiResponse.ok(res, "Conversation fetched", {
      conversation,
      message,
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
