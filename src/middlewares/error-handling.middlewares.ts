import { ErrorRequestHandler, NextFunction, Request, Response } from "express";

import { AppError } from "../errors/app-error.error";
import { logger } from "../config/winston";
import { MongoServerError } from "mongodb";
import { env } from "../config/env";

export const errorHandler: ErrorRequestHandler = async (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (env.environment === "development") logger.error(err);

  if (err instanceof AppError) {
    res.status(err.statusCode).json({ message: err.serializeError() });
    return;
  }

  if (err instanceof MongoServerError && err.code === 11000) {
    res.status(400).json({
      errors: [{ message: "Duplicate value, this slug already exists." }],
    });
    return;
  }

  res.status(500).json({ errors: [{ message: "server error" }] });

  next();
};
