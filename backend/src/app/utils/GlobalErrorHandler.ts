import type { Request, Response, NextFunction } from "express";
import { ApiError } from "./ApiError.js";
import { ZodError } from "zod";

export function globalErrorHandler(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  let finalizedError: ApiError;

  if (err instanceof ZodError) {
    finalizedError = ApiError.zodError(err);
  } else if (err instanceof ApiError) {
    finalizedError = err;
  } else if (
    err?.type === "entity.parse.failed" ||
    err instanceof SyntaxError
  ) {
    finalizedError = ApiError.badRequest("Invalid or empty JSON provided");
  } else if (err?.code === 11000) {
    finalizedError = ApiError.emailAlreadyExists("Email already exists");
  } else {
    console.log(err);

    finalizedError = ApiError.serverError("Internal server error..");
  }

  res.status(finalizedError.statusCode).json({
    success: false,
    message: finalizedError.message,
  });
}
