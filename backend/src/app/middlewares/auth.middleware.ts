import type { Request, Response, NextFunction } from "express";
import { auth } from "../../lib/auth.js";
import { ApiError } from "../utils/ApiError.js";

export async function requireAuth(
  req: Request,
  _res: Response,
  next: NextFunction,
) {
  try {
    const session = await auth.api.getSession({ headers: req.headers });

    if (!session) {
      return next(ApiError.unauthorized("Authentication Required"));
    }

    req.user = session.user;

    next();
  } catch (error) {
    next(error);
  }
}
