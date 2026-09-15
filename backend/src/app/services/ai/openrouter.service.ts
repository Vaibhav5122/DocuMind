import { envZod } from "../../../common/envSanitization.js";
import { openRouter } from "../../configs/openrouter.config.js";
import { ApiError } from "../../utils/ApiError.js";

interface GenerateAnswerInput {
  prompt: string;
}
export async function generateAnswer({ prompt }: GenerateAnswerInput) {
  const response = await openRouter.chat.send({
    chatRequest: {
      model: envZod.OPENROUTER_MODEL,
      stream: true,
      messages: [
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
  let answer = "";

  for await (const chunk of response) {
    const content = chunk.choices?.[0]?.delta?.content;
    if (content) {
      console.log(content);
      answer += content;
    }
    if (chunk.usage) {
      console.log("Usage", chunk.usage); //Final chunk
    }
  }
  return answer;
}
