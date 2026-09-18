import type { Request, Response } from "express";
import { ApiError } from "../utils/ApiError.js";
import { Conversation } from "../models/conversation.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";

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
}
