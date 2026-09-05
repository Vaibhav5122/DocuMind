import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { getRawDB, mongoClient } from "../app/configs/db.config.js";
import { envZod } from "../common/envSanitization.js";

export const auth = betterAuth({
  //database
  database: mongodbAdapter(getRawDB, {
    client: mongoClient,
  }),

  //for faster query
  advanced: {
    database: {
      joins: true,
    },
  },
  baseURL: envZod.BETTER_AUTH_URL,
  emailAndPassword: {
    enabled: true,
  },
  socialProviders: {
    google: {
      clientId: envZod.GOOGLE_CLIENT_ID,
      clientSecret: envZod.GOOGLE_CLIENT_SECRET,
    },
  },
});
