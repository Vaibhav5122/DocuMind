import type { Document } from "@langchain/core/documents";
import { pc } from "../../configs/pinecone.config.js";
import { envZod } from "../../../common/envSanitization.js";
import { ApiError } from "../../utils/ApiError.js";

export const index = pc.index({
  name: envZod.PINECONE_INDEX_NAME,
  host: envZod.PINECONE_HOST_URL,
});

export async function indexDocumentChunks(chunks: Document[]): Promise<number> {
  if (chunks.length === 0) {
    return 0;
  }

  const firstChunk = chunks[0];

  const firstChunkUserId = firstChunk?.metadata?.userId;
  const firstChunkDocumentId = firstChunk?.metadata?.documentId;

  if (!firstChunkUserId || !firstChunkDocumentId) {
    throw ApiError.serverError(
      "Missing userId or documentId in chunk metadata",
    );
  }

  const records = chunks.map((chunk) => {
    const { documentId, userId, chunkIndex, source } = chunk.metadata;

    if (documentId !== firstChunkDocumentId || userId !== firstChunkUserId) {
      throw ApiError.serverError(
        "Chunk metadata contains inconsistent document ownership",
      );
    }

    if (chunkIndex === undefined || chunkIndex === null) {
      throw ApiError.serverError("Missing chunkIndex in chunk metadata");
    }

    return {
      id: `${documentId}_${chunkIndex}`,
      text: chunk.pageContent,
      documentId,
      userId,
      chunkIndex,
      source,
    };
  });

  await index.upsertRecords({
    namespace: `user-${firstChunkUserId}`,
    records,
  });

  return records.length;
}

export async function deleteDocumentVectors(
  documentId: string,
  userId: string,
): Promise<void> {
  try {
    await index.deleteMany({
      namespace: `user-${userId}`,
      filter: { documentId: { $eq: documentId } },
    });
  } catch (error: any) {
    console.warn(
      `⚠️ Could not delete Pinecone vectors for doc ${documentId}:`,
      error?.message || error,
    );
  }
}
