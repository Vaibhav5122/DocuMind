import type { Request, Response } from "express";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { askDocuments } from "../services/ai/ragNonStream.service.js";
import { askDocumentsStream } from "../services/ai/ragStream.service.js";

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

  //Chat with Stream response
  public async chatWithDocumentStream(req: Request, res: Response) {
    const userId = req.user?.id;
    if (!userId) {
      return ApiError.unauthorized("Authentication required");
    }
    const { query, documentId } = req.body;

    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    res.flushHeaders();

    try {
      const result = await askDocumentsStream({ query, documentId, userId });
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

      for await (const token of result.stream!) {
        res.write(
          `data: ${JSON.stringify({
            type: "token",
            text: token,
          })}\n\n`,
        );
      }

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
