import { ApiError } from "../../utils/ApiError.js";
import { searchDocumentChunks } from "../pinecone/search.service.js";
import { generateAnswer } from "./openrouter.service.js";

interface AskDocumentInput {
  query: string;
  userId: string;
  documentId?: string;
}

export async function askDocuments({
  query,
  documentId,
  userId,
}: AskDocumentInput) {
  if (!query || query.trim().length === 0) {
    throw ApiError.badRequest("Question is required");
  }

  const chunks = await searchDocumentChunks({
    query,
    documentId,
    userId,
    topK: 5,
  });

  if (chunks.length === 0) {
    return {
      answer: "I couldn't find relevant information in your documents.",
      citations: [],
    };
  }

  const context = chunks
    .map((chunk, index) => {
      const fields = chunk.fields as Record<string, unknown>;

      return `[Source ${index + 1}: ${fields.source ?? "Unknown"} | Chunk: ${fields.chunkIndex ?? "Unknown"}]
            ${fields.text ?? ""}`;
    })
    .join("\n\n");

  const prompt = `
        You are DocuMind AI, an AI assistant that answers questions using the user's uploaded documents.

        Use ONLY the provided document context to answer the question.

        Rules:
        - Do not invent information.
        - Do not use your general knowledge if the answer is not present in the context.
        - If the answer cannot be found in the provided context, clearly say that the information was not found in the user's documents.
        - Give a clear and concise answer.
        - Use the retrieved context as evidence for your answer.

        DOCUMENT CONTEXT:
        ${context}

        USER QUESTION:
        ${query}
    `;

  const answer = await generateAnswer({ prompt });

  const citations = chunks.map((chunk, index) => {
    const fields = chunk.fields as Record<string, unknown>;

    return {
      index: index + 1,
      source: fields.source,
      documentId: fields.documentId,
      chunkIndex: fields.chunkIndex,
      score: chunk._score,
    };
  });
  return {
    answer,
    citations,
  };
}
