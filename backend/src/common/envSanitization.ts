import { z } from "zod";

const envSchema = z.object({
  PORT: z.string().optional(),
  MONGO_URI: z.string(),
  BETTER_AUTH_URL: z.string().optional(),
  GOOGLE_CLIENT_ID: z.string(),
  GOOGLE_CLIENT_SECRET: z.string(),
  FRONTEND_URL: z.string(),
  CLOUDINARY_CLOUD_NAME: z.string().min(1),
  CLOUDINARY_API_KEY: z.string().min(1),
  CLOUDINARY_API_SECRET: z.string().min(1),
  PINECONE_API_KEY: z.string().min(1),
  PINECONE_INDEX_NAME: z.string().min(1),
  PINECONE_HOST_URL: z.string().min(1),
});

function parsedEnvSchema(env: NodeJS.ProcessEnv) {
  const parsedEnv = envSchema.safeParse(env);
  if (!parsedEnv.success) {
    throw new Error("Error in ENV Validation");
  }
  return parsedEnv.data;
}

export const envZod = parsedEnvSchema(process.env);
