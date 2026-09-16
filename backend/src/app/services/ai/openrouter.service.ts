import { envZod } from "../../../common/envSanitization.js";
import { openRouter } from "../../configs/openrouter.config.js";
import { ApiError } from "../../utils/ApiError.js";

interface GenerateAnswerInput {
  prompt: string;
  SYSTEM_PROMPT: string;
}
export async function* generateAnswerStream({
  prompt,
  SYSTEM_PROMPT,
}: GenerateAnswerInput) {
  const response = await openRouter.chat.send({
    chatRequest: {
      model: envZod.OPENROUTER_MODEL,
      stream: true,
      messages: [
        {
          role: "system",
          content: SYSTEM_PROMPT,
        },
        {
          role: "user",
          content: prompt,
        },
      ],
    },
  });
  if (!(response instanceof ReadableStream)) {
    throw ApiError.serverError("Expected a streaming response");
  }

  for await (const chunk of response) {
    const content = chunk.choices?.[0]?.delta?.content;
    if (content) {
      yield content;
    }
    if (chunk.usage) {
      console.log("Usage", chunk.usage); //Final chunk
    }
  }
}
