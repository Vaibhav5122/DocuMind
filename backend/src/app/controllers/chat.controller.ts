import type { Request, Response } from "express";
import { ApiError } from "../utils/ApiError.js";
import { askDocuments } from "../services/ai/rag.service.js";
import { ApiResponse } from "../utils/ApiResponse.js";

export class ChatController {
  public async chatWithDocument(req: Request, res: Response) {
    const userId = req.user?.id;

    if (!userId) {
      return ApiError.unauthorized("Authentication required");
    }
    const { query, documentId } = req.body;

    const result = await askDocuments({ query, documentId, userId });

    return ApiResponse.ok(res, "Answer generated", result);
  }
}
