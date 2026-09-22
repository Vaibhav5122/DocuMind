import { generateAnswer } from "./openrouter.service.js";
import { prepareRagContext, type AskDocumentInput } from "./rag.service.js";

export async function askDocuments({
  query,
  documentId,
  userId,
  conversationId,
}: AskDocumentInput) {
  const result = await prepareRagContext({
    query,
    documentId,
    userId,
    conversationId,
  });
  if (result.noResult) {
    return {
      answer: null,
      citations: [],
      noResult: true,
    };
  }
  const answer = await generateAnswer({
    prompt: result.prompt!,
    SYSTEM_PROMPT: result.SYSTEM_PROMPT!,
  });

  return {
    answer,
    citations: result.citations,
    noResult: false,
  };
}
