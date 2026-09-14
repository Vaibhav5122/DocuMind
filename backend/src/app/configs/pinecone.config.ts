import { Pinecone } from "@pinecone-database/pinecone";
import { envZod } from "../../common/envSanitization.js";

export const pc = new Pinecone({ apiKey: envZod.PINECONE_API_KEY });

export async function pineconeConnect() {
  try {
    const result = await pc.indexes.list();
    console.log("✅ Connected! Indexes:", result.indexes);
  } catch (error: any) {
    console.error("❌ Pinecone connection failed:", error.message);
  }
}
