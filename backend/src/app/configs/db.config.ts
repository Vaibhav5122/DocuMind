import mongoose from "mongoose";
import { envZod } from "../../common/envSanitization.js";

export async function connectDB() {
  try {
    await mongoose.connect(envZod.MONGO_URI);
    console.log(`MongoDB connected✅`);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
}
