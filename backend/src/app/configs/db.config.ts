import mongoose from "mongoose";
import { envZod } from "../../common/envSanitization.js";

try {
  await mongoose.connect(envZod.MONGO_URI);
  console.log(`MongoDB connected✅`);
} catch (error) {
  console.log("MongoDB connection failed ❌", error);
  process.exit(1);
}

// for betterAuth raw connection
export const getRawDB = mongoose.connection.db!;

//Get Mongo client for betterauth
export const mongoClient = mongoose.connection.getClient();

//Optional no need to call

// export async function connectDB() {
//   if (mongoose.connection.readyState !== 1) {
//     await mongoose.connect(envZod.MONGO_URI);
//   }
// }
