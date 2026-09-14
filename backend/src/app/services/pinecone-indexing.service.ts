import type { Document } from "langchain";
import { pc } from "../configs/pinecone.config.js";
import { envZod } from "../../common/envSanitization.js";
import { ApiError } from "../utils/ApiError.js";

const index = pc.index({
  name: envZod.PINECONE_INDEX_NAME,
  host: envZod.PINECONE_HOST_URL,
});

export async function indexDocumentChunks(chunks: Document[]): Promise<number> {
  if (chunks.length === 0) {
    return 0;
  }

  const firstChunkUserId = chunks[0]?.metadata?.userId;

  if (!firstChunkUserId) {
    throw ApiError.serverError("Missing userId in chunk metadata");
  }

  const records = chunks.map((chunk) => {
    const { documentId, userId, chunkIndex, source } = chunk.metadata;

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
