import { generateAnswerStream } from "./openrouter.service.js";
import { prepareRagContext, type AskDocumentInput } from "./rag.service.js";

export async function askDocumentsStream({
  query,
  documentId,
  userId,
}: AskDocumentInput) {
  const result = await prepareRagContext({
    query,
    documentId,
    userId,
  });

  if (result.noResult) {
    return {
      stream: null,
      citations: [],
      noResult: true,
    };
  }

  const stream = generateAnswerStream({
    prompt: result.prompt!,
    SYSTEM_PROMPT: result.SYSTEM_PROMPT!,
  });

  return {
    stream,
    citations: result.citations,
    noResult: false,
  };
}
