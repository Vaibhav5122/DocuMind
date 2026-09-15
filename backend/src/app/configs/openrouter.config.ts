import { OpenRouter } from "@openrouter/sdk";
import { envZod } from "../../common/envSanitization.js";

export const openRouter = new OpenRouter({
  apiKey: envZod.OPENROUTER_API_KEY,
  appTitle: "DocuMind",
});
