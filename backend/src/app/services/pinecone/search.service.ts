import { ApiError } from "../../utils/ApiError.js";
import { index } from "./indexing.service.js";

export interface SearchDocumentInput {
  query: string;
  userId: string;
  documentId?: string | string[] | undefined;
  topK?: number;
}

export async function searchDocumentChunks({
  query,
  userId,
  documentId,
  topK = 5,
}: SearchDocumentInput) {
  if (!query || query.trim().length === 0) {
    throw ApiError.badRequest("Search query not given");
  }
  const queryPayload: {
    topK: number;
    inputs: { text: string };
    filter?: Record<string, unknown>;
  } = {
    topK,
    inputs: { text: query },
  };
  if (documentId) {
    if (Array.isArray(documentId) && documentId.length > 0) {
      if (documentId.length === 1) {
        queryPayload.filter = {
          documentId: { $eq: documentId[0] },
        };
      } else {
        queryPayload.filter = {
          documentId: { $in: documentId },
        };
      }
    } else if (typeof documentId === "string" && documentId.trim().length > 0) {
      queryPayload.filter = {
        documentId: { $eq: documentId },
      };
    }
  }

  const response = await index.namespace(`user-${userId}`).searchRecords({
    query: queryPayload,
    fields: ["text", "documentId", "userId", "chunkIndex", "source"],
  });
  return response.result?.hits || [];
}
