import { z } from "zod";

const envSchema = z.object({
  PORT: z.string().optional(),
  MONGO_URI: z.string(),
  BETTER_AUTH_URL: z.string().optional(),
});

function parsedEnvSchema(env: NodeJS.ProcessEnv) {
  const parsedEnv = envSchema.safeParse(env);
  if (!parsedEnv.success) {
    throw new Error("Error in ENV Validation");
  }
  return parsedEnv.data;
}

export const envZod = parsedEnvSchema(process.env);
