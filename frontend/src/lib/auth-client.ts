import { createAuthClient } from "better-auth/react";

export const { signIn, signUp, signOut, useSession, getSession } =
  createAuthClient({
    baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  });
