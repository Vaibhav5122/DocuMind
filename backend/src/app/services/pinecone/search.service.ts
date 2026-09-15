import { index } from "./indexing.service.js";

export async function searchDocumentChunks(
  query: string,
  userId: string,
  topK: number,
) {
  const response = await index.namespace(`user-${userId}`).searchRecords({
    query: {
      topK,
      inputs: { text: query },
    },
    fields: [
      "text",
      "documentId",
      "userId",
      "originalFileName",
      "chunkIndex",
      "source",
    ],
  });
  console.log(
    "pinecone result is here ----------------",
    response.result.hits,
    "hello-------------------",
    response,
  );
  return response.result?.hits || [];
}
