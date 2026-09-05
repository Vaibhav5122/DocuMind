import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { getRawDB, mongoClient } from "../app/configs/db.config.js";

import mongoose from "mongoose";
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
  emailAndPassword: {
    enabled: true,
  },

  baseURL: envZod.BETTER_AUTH_URL,
});
